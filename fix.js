const fs = require('fs');
const path = 'node_modules/express/lib/application.js';
let f = fs.readFileSync(path, 'utf8');
f = f.replace("this.options('*', cb)", "this.options('/{*splat}', cb)");
fs.writeFileSync(path, f);
console.log('Fixed!');
console.log('Fixed!');