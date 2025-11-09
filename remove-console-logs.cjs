const fs = require('fs');
const path = require('path');

function removeConsoleLogs(dir) {
  const folders = ['components', 'hooks', 'lib', 'pages'];
  let totalRemoved = 0;
  let filesModified = 0;

  function processDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Remove console.log statements
        const lines = content.split('\n');
        const filteredLines = lines.filter(line => {
          const trimmed = line.trim();
          return !trimmed.startsWith('console.log(');
        });
        
        content = filteredLines.join('\n');
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          const removed = lines.length - filteredLines.length;
          totalRemoved += removed;
          filesModified++;
          console.log(`✓ ${file}: removed ${removed} console.log(s)`);
        }
      }
    });
  }

  folders.forEach(folder => {
    const folderPath = path.join(dir, 'src', folder);
    if (fs.existsSync(folderPath)) {
      console.log(`\nProcessing ${folder}/...`);
      processDirectory(folderPath);
    }
  });

  console.log(`\n=== Summary ===`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total console.log removed: ${totalRemoved}`);
}

removeConsoleLogs(__dirname);
