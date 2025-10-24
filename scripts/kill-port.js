#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const os = require('os');

const port = process.argv[2] || '3000';

function killPort(port) {
  const platform = os.platform();
  
  console.log(`🔍 Checking for processes on port ${port}...`);
  
  if (platform === 'win32') {
    // Windows approach
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`✅ No process found running on port ${port}`);
        return;
      }

      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      });

      if (pids.size > 0) {
        console.log(`🔪 Killing processes on port ${port}: ${Array.from(pids).join(', ')}`);
        Array.from(pids).forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, (error) => {
            if (error) {
              console.error(`❌ Failed to kill process ${pid}:`, error.message);
            } else {
              console.log(`✅ Successfully killed process ${pid}`);
            }
          });
        });
      } else {
        console.log(`✅ No process found running on port ${port}`);
      }
    });
  } else {
    // macOS/Linux approach
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`✅ No process found running on port ${port}`);
        return;
      }

      const pids = stdout.trim().split('\n').filter(pid => pid && !isNaN(pid));
      
      if (pids.length > 0) {
        console.log(`🔪 Killing processes on port ${port}: ${pids.join(', ')}`);
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, (error) => {
            if (error) {
              console.error(`❌ Failed to kill process ${pid}:`, error.message);
            } else {
              console.log(`✅ Successfully killed process ${pid}`);
            }
          });
        });
      } else {
        console.log(`✅ No process found running on port ${port}`);
      }
    });
  }
}

// Add a small delay to ensure processes are fully killed
killPort(port);
setTimeout(() => {
  console.log(`🚀 Port ${port} is now available for use`);
}, 1000);
