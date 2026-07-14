import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '.open-next/assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Copy worker.js to assets/_worker.js
const workerSrc = path.join(__dirname, '.open-next/worker.js');
const workerDest = path.join(assetsDir, '_worker.js');

if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log('Copied worker.js to assets/_worker.js');
} else {
  console.warn('worker.js not found');
}

// 1.5 Copy Prisma WASM files to the flattened paths expected by wrangler's esbuild
const baseDir = path.resolve(__dirname, '.open-next/server-functions/default');
const noDrive = baseDir.replace(/^[A-Za-z]:/, '');
const folderName = noDrive.replace(/[\\/]/g, '');

const chunksDir = path.join(baseDir, '.next/server/chunks');
const destNormal = path.join(chunksDir, folderName);
const destSsr = path.join(chunksDir, `ssr/${folderName}`);

const prismaClientWasm = path.join(__dirname, 'node_modules/.prisma/client/query_engine_bg.wasm');
const runtimeWasmDir = path.join(__dirname, 'node_modules/@prisma/client/runtime');

// Only copy mysql.wasm, we exclude postgresql and sqlite to stay under the 3MB size limit
const runtimeFiles = [
  'query_engine_bg.mysql.wasm'
];

function copyWasmToDest(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy query_engine_bg.wasm
  if (fs.existsSync(prismaClientWasm)) {
    const destFile = path.join(targetDir, 'node_modules.prismaclientquery_engine_bg.wasm');
    fs.copyFileSync(prismaClientWasm, destFile);
    console.log(`Copied query_engine_bg.wasm to ${path.relative(__dirname, destFile)}`);
  }

  // Copy runtime engines
  const runtimeDestDir = path.join(targetDir, 'node_modules@prismaclient');
  if (!fs.existsSync(runtimeDestDir)) {
    fs.mkdirSync(runtimeDestDir, { recursive: true });
  }
  for (const file of runtimeFiles) {
    const srcFile = path.join(runtimeWasmDir, file);
    if (fs.existsSync(srcFile)) {
      const destFile = path.join(runtimeDestDir, `runtime${file}`);
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file} to ${path.relative(__dirname, destFile)}`);
    }
  }
}

if (fs.existsSync(chunksDir)) {
  copyWasmToDest(destNormal);
  copyWasmToDest(destSsr);
}

// 1.7 Post-process handler.mjs to fix mixed slash paths and remove unused DB engines for WASM files
const handlerPath = path.join(baseDir, 'handler.mjs');
if (fs.existsSync(handlerPath)) {
  let content = fs.readFileSync(handlerPath, 'utf8');
  
  // Replace absolute project path with relative path (.)
  const projectBaseUrl = baseDir.replace(/\\/g, '/');
  const escapedBaseUrl = projectBaseUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regexBase = new RegExp(escapedBaseUrl, 'g');
  content = content.replace(regexBase, '.');

  const escapedFolderName = folderName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  // Match the chunk paths starting with folderName and ending with .wasm
  const regex = new RegExp('(' + escapedFolderName + '[^"\\)]+\\.wasm)', 'g');
  content = content.replace(regex, (match) => {
    // Replace all backslashes with forward slashes
    return match.replace(/\\/g, '/');
  });

  // Replace unused WASM imports (postgresql, sqlite) with null shims to exclude them from the bundle
  content = content.replace(/(import\("[^"]+postgresql\.wasm"\))/g, 'Promise.resolve({default: null})');
  content = content.replace(/(import\("[^"]+sqlite\.wasm"\))/g, 'Promise.resolve({default: null})');
  
  // Mock getCurrentBinaryTarget to skip Node.js fs.readdir scans on Cloudflare Workers
  content = content.replace(/async getCurrentBinaryTarget\(\)\{/g, 'async getCurrentBinaryTarget(){return "native";');

  fs.writeFileSync(handlerPath, content, 'utf8');
  console.log('Fixed absolute paths, mixed slashes, mocked binary target, and removed unused DB engines in handler.mjs');
}



// 2. Copy directories to assets
const dirsToCopy = [
  'cloudflare',
  'middleware',
  '.build',
  'server-functions'
];

for (const dir of dirsToCopy) {
  const srcDir = path.join(__dirname, '.open-next', dir);
  const destDir = path.join(assetsDir, dir);
  
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`Copied ${dir} directory to assets/${dir}`);
  } else {
    console.warn(`Directory not found: ${dir}`);
  }
}

// 3. Generate _routes.json to control routing for static assets
const routesJsonPath = path.join(assetsDir, '_routes.json');
const routesConfig = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/_next/static/*",
    "/categories/*",
    "/uploads/*",
    "/*.png",
    "/*.ico",
    "/*.svg",
    "/*.webp",
    "/*.txt",
    "/sitemap.xml"
  ]
};
fs.writeFileSync(routesJsonPath, JSON.stringify(routesConfig, null, 2), 'utf8');
console.log('Generated _routes.json in assets directory');

