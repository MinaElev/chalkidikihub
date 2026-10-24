/* eslint-disable @typescript-eslint/no-require-imports -- Passenger loads the startup file as CommonJS. */
// Startup file for Plesk's Node.js extension (Phusion Passenger).
// Loads the server-side settings from .env.production (kept next to this file, outside the public document root),
// then starts Next.js' standalone server. Passenger takes over the port, so PORT is only a fallback.
const fs = require('node:fs');
const path = require('node:path');

const envFile = path.join(__dirname, '.env.production');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
process.env.NODE_ENV = 'production';
// Linux sets HOSTNAME to the machine name; Next would try to bind to it. Passenger intercepts listen() anyway.
process.env.HOSTNAME = '0.0.0.0';
process.chdir(__dirname);

require('./server.js');
