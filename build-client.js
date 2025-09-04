import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building client for Vercel...');

try {
  // Change to client directory
  process.chdir('client');
  
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync('node_modules')) {
    console.log('Installing client dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Build the client
  console.log('Building client with Vite...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Copy the built files to the root for Vercel
  console.log('Copying built files to root...');
  const distPath = path.join(process.cwd(), 'dist');
  const rootPath = path.join(process.cwd(), '..');
  
  // Copy dist contents to root
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
      const sourcePath = path.join(distPath, file);
      const destPath = path.join(rootPath, file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        if (fs.existsSync(destPath)) {
          fs.rmSync(destPath, { recursive: true, force: true });
        }
        fs.cpSync(sourcePath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    });
    console.log('Client build completed successfully!');
  } else {
    throw new Error('Client build failed - dist directory not found');
  }
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
