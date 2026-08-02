import fs from 'fs';
import { execSync } from 'child_process';

const env = fs.readFileSync('.env', 'utf8');
const lines = env.split('\n');

for (const line of lines) {
  if (line.trim() && !line.trim().startsWith('#')) {
    const idx = line.indexOf('=');
    if(idx > 0) {
      const key = line.substring(0, idx).trim();
      let value = line.substring(idx + 1).trim();
      if(value.startsWith('"')) value = value.substring(1, value.length - 1);
      if(value.startsWith("'")) value = value.substring(1, value.length - 1);
      
      console.log(`Setting ${key}...`);
      try {
        execSync(`npx wrangler pages secret put ${key} --project-name diar-selection`, { input: value.trim() });
      } catch (e) {
        console.error(`Failed to set ${key}: ${e.message}`);
      }
    }
  }
}
