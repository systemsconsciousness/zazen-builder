const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ZAZEN_DIR = path.join(ROOT_DIR, '.zazen');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const status = execSync('git status --porcelain', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return { isGit: true, branch, clean: status.length === 0 };
  } catch (_) {
    return { isGit: false, branch: null, clean: true };
  }
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Endpoint: GET /api/health
  if (req.method === 'GET' && pathname === '/api/health') {
    const gitInfo = getGitInfo();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      bridge: 'zazen-local',
      version: '3.1.0',
      rootDir: ROOT_DIR,
      git: gitInfo
    }));
    return;
  }

  // Endpoint: POST /api/save (Auto-Save State & HTML to Disk)
  if (req.method === 'POST' && pathname === '/api/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { data, html } = payload;

        // 1. Sync zazen.config.json
        if (data) {
          const configPath = path.join(ROOT_DIR, 'zazen.config.json');
          fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
        }

        // 2. Sync index.html if provided
        if (html) {
          const indexPath = path.join(ROOT_DIR, 'index.html');
          fs.writeFileSync(indexPath, html, 'utf8');
        } else if (data) {
          // Update __ZAZEN_DATA inside index.html
          const indexPath = path.join(ROOT_DIR, 'index.html');
          if (fs.existsSync(indexPath)) {
            let currentHtml = fs.readFileSync(indexPath, 'utf8');
            const dataRegex = /<script id="__ZAZEN_DATA" type="application\/json">([\s\S]*?)<\/script>/;
            if (dataRegex.test(currentHtml)) {
              currentHtml = currentHtml.replace(dataRegex, `<script id="__ZAZEN_DATA" type="application/json">\n${JSON.stringify(data, null, 2)}\n  </script>`);
              fs.writeFileSync(indexPath, currentHtml, 'utf8');
            }
          }
        }

        console.log(`[ZAZEN BRIDGE] Auto-saved updated state to disk (${new Date().toLocaleTimeString()})`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', message: 'Saved to disk successfully' }));
      } catch (err) {
        console.error('[ZAZEN BRIDGE] Save error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
    return;
  }

  // Endpoint: POST /api/git (Tier 2: 1-Click Commit & Push)
  if (req.method === 'POST' && pathname === '/api/git') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const message = payload.message || `feat: update site via Zazen Builder (${new Date().toLocaleTimeString()})`;
        const doPush = Boolean(payload.push);

        // Stage all changes
        execSync('git add -A', { cwd: ROOT_DIR, encoding: 'utf8' });

        // Check if there is anything to commit
        const status = execSync('git status --porcelain', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
        let commitOut = 'Working tree already clean, nothing new to commit.';
        
        if (status.length > 0) {
          commitOut = execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
        }

        let pushOut = null;
        if (doPush) {
          try {
            pushOut = execSync('git push', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
          } catch (pushErr) {
            pushOut = `Push skipped/unconfigured: ${pushErr.message}`;
          }
        }

        const gitInfo = getGitInfo();
        console.log(`[ZAZEN BRIDGE] Git commit executed: ${message}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          commit: commitOut,
          push: pushOut,
          branch: gitInfo.branch
        }));
      } catch (err) {
        console.error('[ZAZEN BRIDGE] Git error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
    return;
  }

  // Endpoint: POST /api/deploy (Tier 3: Export Clean Build & Write Deploy Intent)
  if (req.method === 'POST' && pathname === '/api/deploy') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { provider = 'universal', project = 'zazen-site', files = {} } = payload;

        // 1. Write clean files to ./dist
        if (!fs.existsSync(DIST_DIR)) {
          fs.mkdirSync(DIST_DIR, { recursive: true });
        }

        const savedFiles = [];
        for (const [filename, content] of Object.entries(files)) {
          const filePath = path.join(DIST_DIR, filename);
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(filePath, content, 'utf8');
          savedFiles.push(filename);
        }

        // 2. Write deploy intent manifest in .zazen/deploy-intent.json
        if (!fs.existsSync(ZAZEN_DIR)) {
          fs.mkdirSync(ZAZEN_DIR, { recursive: true });
        }

        const intent = {
          provider,
          project,
          timestamp: new Date().toISOString(),
          outputDir: 'dist',
          files: savedFiles,
          agentCommand: `deploy to ${provider}`
        };

        fs.writeFileSync(path.join(ZAZEN_DIR, 'deploy-intent.json'), JSON.stringify(intent, null, 2), 'utf8');

        console.log(`[ZAZEN BRIDGE] Exported ${savedFiles.length} clean files to ./dist for ${provider.toUpperCase()}`);
        console.log(`[ZAZEN BRIDGE] Deploy intent written to .zazen/deploy-intent.json`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          provider,
          project,
          outputDir: DIST_DIR,
          files: savedFiles,
          intentFile: '.zazen/deploy-intent.json',
          instructions: `Production build exported to ./dist. Switch to your AI agent and type: "deploy to ${provider}"`
        }));
      } catch (err) {
        console.error('[ZAZEN BRIDGE] Deploy error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const git = getGitInfo();
  console.log(`\n======================================================`);
  console.log(`  ZAZEN BUILDER LOCAL BRIDGE v3.1.0 ACTIVE`);
  console.log(`  URL:         http://localhost:${PORT}`);
  console.log(`  Health API:  http://localhost:${PORT}/api/health`);
  console.log(`  Auto-Save:   http://localhost:${PORT}/api/save`);
  console.log(`  1-Click Git: http://localhost:${PORT}/api/git (Branch: ${git.branch || 'none'})`);
  console.log(`  Deploy API:  http://localhost:${PORT}/api/deploy`);
  console.log(`  Export Dir:  ${DIST_DIR}`);
  console.log(`======================================================\n`);
});
