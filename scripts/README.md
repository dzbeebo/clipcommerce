# Scripts Directory

This directory contains utility scripts for the Clip & Earn project.

## Port Management Scripts

### kill-port.js
Node.js script to kill processes running on a specific port. Works on Windows, macOS, and Linux.

**Usage:**
```bash
node scripts/kill-port.js [port]
# Default port: 3000
```

### kill-port.sh
Bash script to kill processes running on a specific port. Works on macOS and Linux.

**Usage:**
```bash
./scripts/kill-port.sh [port]
# Default port: 3000
```

## NPM Scripts

The following npm scripts are available for port management:

- `npm run kill-port` - Kill processes on port 3000 using Node.js script
- `npm run kill-port:sh` - Kill processes on port 3000 using bash script
- `npm run dev` - Kill processes on port 3000, then start dev server on port 3000
- `npm run dev:clean` - Same as `npm run dev`
- `npm run dev:force` - Kill processes on port 3000, then start dev server with force flag

## Port Configuration

The project is configured to always use port 3000 for consistency:

- Development server: `http://localhost:3000`
- Production server: `http://localhost:3000`
- All scripts default to port 3000

This ensures a consistent development experience and prevents port conflicts.
