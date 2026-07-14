import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToRestore = [
  { path: 'src/app/admin', hidden: 'src/app/_admin' },
  { path: 'src/app/api/admin', hidden: 'src/app/api/_admin' },
  { path: 'src/app/api/upload', hidden: 'src/app/api/_upload' }
];

for (const dir of dirsToRestore) {
  const fullPath = path.join(__dirname, dir.path);
  const hiddenPath = path.join(__dirname, dir.hidden);
  
  if (fs.existsSync(hiddenPath)) {
    fs.renameSync(hiddenPath, fullPath);
    console.log(`Restored: ${dir.hidden} -> ${dir.path}`);
  }
}
