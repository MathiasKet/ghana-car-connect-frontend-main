const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if server directory exists
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found!');
  console.log('Please make sure the server directory exists with all required files.');
  process.exit(1);
}

// Check if node_modules exists in server directory
const nodeModulesDir = path.join(serverDir, 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  console.log('📦 Installing server dependencies...');
  const npmInstall = spawn('npm', ['install'], {
    cwd: serverDir,
    stdio: 'inherit'
  });

  npmInstall.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Failed to install server dependencies');
      process.exit(1);
    }
    console.log('✅ Dependencies installed successfully');
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('🚀 Starting CarConnect Backend Server...');
  
  const server = spawn('npm', ['run', 'dev'], {
    cwd: serverDir,
    stdio: 'inherit'
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
  });
}
