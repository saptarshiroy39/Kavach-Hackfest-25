// This script replaces all component declarations in the EncryptedMessaging.tsx file
// to use the standard React function declaration instead of arrow function syntax
// This helps fix issues with component recognition

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'messaging', 'EncryptedMessaging.tsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace the React component declaration
content = content.replace(
  /const EncryptedMessaging(: React\.FC)? = \(\) => {/,
  'export default function EncryptedMessaging() {'
);

// Remove the export default line at the end of the file
content = content.replace(/export default EncryptedMessaging;/, '');

// Add proper closing tags for CardContent
content = content.replace(
  /<CardContent className="flex flex-1 p-0 overflow-hidden relative">/g,
  '<CardContent className="flex flex-1 p-0 overflow-hidden relative">'
);

// Fix any JSX fragment closing issues
content = content.replace(/}\s*\)/g, '}\n            </>\n          )');

// Add proper closing tag for CardContent before Card's closing tag
if (!content.includes('</CardContent>')) {
  content = content.replace(
    '</Card>',
    '      </CardContent>\n    </Card>'
  );
}

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed component declaration in EncryptedMessaging.tsx');
