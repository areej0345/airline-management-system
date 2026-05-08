const fs = require('fs');
const filePath = 'node_modules/express/lib/application.js';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Looking for options handler...');

// Try multiple possible strings
content = content
  .replace(/this\.options\('\*'/g, "this.options('/{*splat}'")
  .replace(/app\.options\('\*'/g, "app.options('/{*splat}'");

fs.writeFileSync(filePath, content);
console.log('Express patched successfully!');