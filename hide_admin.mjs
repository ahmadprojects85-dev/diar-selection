import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToHide = [
  { path: 'src/app/admin', hidden: 'src/app/_admin' },
  { path: 'src/app/api/admin', hidden: 'src/app/api/_admin' },
  { path: 'src/app/api/upload', hidden: 'src/app/api/_upload' }
];

// Clean build cache directories to avoid stale type validation
const cacheDirs = ['.next', '.open-next'];
for (const cacheDir of cacheDirs) {
  const fullCachePath = path.join(__dirname, cacheDir);
  if (fs.existsSync(fullCachePath)) {
    fs.rmSync(fullCachePath, { recursive: true, force: true });
    console.log(`Cleaned cache directory: ${cacheDir}`);
  }
}

for (const dir of dirsToHide) {
  const fullPath = path.join(__dirname, dir.path);
  const hiddenPath = path.join(__dirname, dir.hidden);
  
  if (fs.existsSync(fullPath)) {
    fs.renameSync(fullPath, hiddenPath);
    console.log(`Hidden: ${dir.path} -> ${dir.hidden}`);
  }
}
