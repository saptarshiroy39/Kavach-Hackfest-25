// This script checks and fixes component declaration issues in EncryptedMessaging.tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ESM support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'components', 'messaging', 'EncryptedMessaging.tsx');

try {
  // Check if file exists first
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  let needsUpdate = false;
  let updatedContent = content;

  // Check if the file is using arrow function syntax
  if (updatedContent.includes('const EncryptedMessaging') && 
      updatedContent.includes('= () => {')) {
    // Replace the React component declaration
    updatedContent = updatedContent.replace(
      /const EncryptedMessaging(: React\.FC)? = \(\) => {/,
      'export default function EncryptedMessaging() {'
    );
    // Remove the export default line at the end of the file
    updatedContent = updatedContent.replace(/export default EncryptedMessaging;/, '');
    needsUpdate = true;
  }

  // Check for unclosed CardContent tags if needed
  if (updatedContent.includes('<CardContent') && 
      !updatedContent.includes('</CardContent>')) {
    // Add proper closing tag for CardContent before Card's closing tag
    updatedContent = updatedContent.replace(
      '</Card>',
      '      </CardContent>\n    </Card>'
    );
    needsUpdate = true;
  }

  // Only write the file if changes were made
  if (needsUpdate) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log('✅ Fixed component declaration in EncryptedMessaging.tsx');
  } else {
    console.log('✓ No fixes needed for EncryptedMessaging.tsx');
  }
} catch (error) {
  console.error('Error processing the file:', error);
  process.exit(1);
}
