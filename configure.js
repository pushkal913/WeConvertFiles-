const fs = require('fs');
const path = require('path');

// Basic command line argument parser
const args = process.argv.slice(2);
let domain = '';
let email = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--domain' && args[i + 1]) {
    domain = args[i + 1].replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    i++;
  } else if (args[i] === '--email' && args[i + 1]) {
    email = args[i + 1];
    i++;
  }
}

if (!domain && !email) {
  console.log('WeConvertFiles Setup Utility');
  console.log('Usage: node configure.js --domain <your-domain.com> --email <your-email@mail.com>');
  process.exit(1);
}

const targetDir = __dirname;
console.log(`Starting configuration in: ${targetDir}`);

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip hidden directories and node_modules
      if (!item.startsWith('.') && item !== 'node_modules') {
        processDirectory(itemPath);
      }
    } else {
      const ext = path.extname(item).toLowerCase();
      // Only process text configuration files and html templates
      if (['.html', '.txt', '.xml', '_headers', '_redirects'].includes(ext) || item === '_headers' || item === '_redirects') {
        if (item === 'configure.js') return;
        
        let content = fs.readFileSync(itemPath, 'utf8');
        let modified = false;
        
        if (domain) {
          // Replace domain references
          const domainRegex = /https:\/\/your-domain\.com/g;
          if (domainRegex.test(content)) {
            content = content.replace(domainRegex, `https://${domain}`);
            modified = true;
          }
          // Also match canonical tags or urls without protocol if needed, but the checklist specifies https://your-domain.com
        }
        
        if (email) {
          // Replace support email references
          const emailRegex = /techknogeeks@zohomail\.in/g;
          if (emailRegex.test(content)) {
            content = content.replace(emailRegex, email);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(itemPath, content, 'utf8');
          console.log(`Updated: ${path.relative(targetDir, itemPath)}`);
        }
      }
    }
  });
}

processDirectory(targetDir);
console.log('Configuration complete!');
