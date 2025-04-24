// This script checks for common issues that cause blank pages in React applications
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ESM support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to read a file
const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
};

// Utility function to write a file
const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
    return false;
  }
};

// Check if index.html has the correct root div
const checkIndexHtml = () => {
  const indexPath = path.join(__dirname, 'index.html');
  const content = readFile(indexPath);
  
  if (!content) return;
  
  if (!content.includes('<div id="root"></div>')) {
    console.error('❌ index.html is missing the root div. Please add <div id="root"></div> to the body.');
  } else {
    console.log('✅ index.html has the correct root div');
  }
  
  // Check if the script tag points to the right file
  if (!content.includes('src="/src/main.tsx"') && !content.includes('src="./src/main.tsx"')) {
    const fixedContent = content.replace(
      /<script type="module" src="[^"]*"><\/script>/,
      '<script type="module" src="/src/main.tsx"></script>'
    );
    writeFile(indexPath, fixedContent);
  } else {
    console.log('✅ index.html has the correct script import');
  }
};

// Check main.tsx for correct rendering
const checkMainTsx = () => {
  const mainPath = path.join(__dirname, 'src', 'main.tsx');
  const content = readFile(mainPath);
  
  if (!content) return;
  
  // Check if using createRoot correctly
  if (!content.includes('createRoot')) {
    console.error('❌ main.tsx should use createRoot from react-dom/client');
    
    // Add proper React 18 rendering code
    const fixedContent = `import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
${content.includes('BlockchainProvider') ? "import { BlockchainProvider } from '@/context/BlockchainContext'" : ''}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    ${content.includes('BlockchainProvider') ? '<BlockchainProvider>\n    <App />\n    </BlockchainProvider>' : '<App />'}
  </StrictMode>
);`;
    
    writeFile(mainPath, fixedContent);
  } else {
    console.log('✅ main.tsx uses createRoot correctly');
  }
};

// Ensure App.tsx has proper structure
const checkAppTsx = () => {
  const appPath = path.join(__dirname, 'src', 'App.tsx');
  const content = readFile(appPath);
  
  if (!content) return;
  
  // Check if App is exported correctly
  if (!content.includes('export default App')) {
    console.error('❌ App.tsx should export the App component as default');
  } else {
    console.log('✅ App.tsx exports App correctly');
  }
  
  // Add a basic error boundary if not present
  if (!content.includes('componentDidCatch') && !content.includes('ErrorBoundary')) {
    console.log('ℹ️ Adding ErrorBoundary component to catch rendering errors');
    const errorBoundary = `
// Add ErrorBoundary at the top of your App component to catch rendering errors
import { Component, ErrorInfo, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
            <p className="text-card-foreground mb-4">
              An error occurred while rendering the application.
            </p>
            <pre className="bg-muted p-2 rounded text-sm overflow-auto mb-4">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

`;
    
    // Insert ErrorBoundary at the beginning of the file and wrap App's return with it
    const fixedContent = content.replace(
      /^(import .+)/,
      `${errorBoundary}$1`
    );
    
    // Find return statement of App and wrap with ErrorBoundary
    const withErrorBoundary = fixedContent.replace(
      /(return\s*\(\s*)/,
      '$1<ErrorBoundary>\n      '
    ).replace(
      /(\s*\)\s*;\s*}\s*;\s*export default App)/,
      '\n      </ErrorBoundary>$1'
    );
    
    writeFile(appPath, withErrorBoundary);
  }
};

// Check for empty components that might cause blank renders
const checkComponents = () => {
  const componentsDir = path.join(__dirname, 'src', 'components');
  
  try {
    // Check if components directory exists
    if (!fs.existsSync(componentsDir)) {
      console.log('ℹ️ Components directory not found, skipping component checks');
      return;
    }
    
    // List of components to check
    const criticalComponents = ['MainLayout.tsx', 'Header.tsx', 'Sidebar.tsx'];
    
    criticalComponents.forEach(component => {
      const componentPath = path.join(componentsDir, 'layout', component);
      
      if (fs.existsSync(componentPath)) {
        const content = readFile(componentPath);
        
        if (content && !content.includes('return')) {
          console.error(`❌ ${component} doesn't have a return statement, which could cause blank rendering`);
        } else if (content) {
          console.log(`✅ ${component} has a return statement`);
        }
      }
    });
  } catch (error) {
    console.error('Error checking components:', error.message);
  }
};

console.log('🔍 Checking for common issues that cause blank pages in React applications...');
checkIndexHtml();
checkMainTsx();
checkAppTsx();
checkComponents();
console.log('✨ Done checking for issues!');
console.log('🚀 Try running the app with: npm run dev');