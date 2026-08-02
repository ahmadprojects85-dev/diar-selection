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

const renameWithRetry = (src, dest, retries = 10, delay = 300) => {
  for (let i = 0; i < retries; i++) {
    try {
      fs.renameSync(src, dest);
      return;
    } catch (err) {
      if ((err.code === 'EPERM' || err.code === 'EBUSY') && i < retries - 1) {
        // Synchronous sleep block
        const start = Date.now();
        while (Date.now() - start < delay) {}
        continue;
      }
      throw err;
    }
  }
};

for (const dir of dirsToHide) {
  const fullPath = path.join(__dirname, dir.path);
  const hiddenPath = path.join(__dirname, dir.hidden);
  
  if (fs.existsSync(fullPath)) {
    renameWithRetry(fullPath, hiddenPath);
    console.log(`Hidden: ${dir.path} -> ${dir.hidden}`);
  }
}
