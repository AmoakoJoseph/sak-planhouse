import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building client for Vercel...');

try {
  const rootPath = __dirname;
  
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync('node_modules')) {
    console.log('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Change to client directory and install its dependencies
  process.chdir('client');
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
  const rootDistPath = path.join(rootPath, 'dist');
  
  // Create root dist directory
  if (fs.existsSync(rootDistPath)) {
    fs.rmSync(rootDistPath, { recursive: true, force: true });
  }
  fs.mkdirSync(rootDistPath, { recursive: true });
  
  // Copy dist contents to root dist
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
      const sourcePath = path.join(distPath, file);
      const destPath = path.join(rootDistPath, file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
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
