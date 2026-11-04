---
name: zazen-builder
description: Spin up exemplary, agency-grade websites for any hosting platform (Vercel, Contentstack Launch, Netlify, Cloudflare Pages, S3, FTP, GitHub Pages). Supports single-page and multi-page architectures, dynamic content feeds, client-side ZIP bundle download, state export/import synchronization, zero-dependency local bridge daemon, 1-click git commits, and agent-assisted MCP deployment handshakes across any harness.
version: 3.2.0
author: Dean Haddock for Zazen Labs, LLC
license: CC-BY-NC-4.0
---

# Zazen Builder: Skills-Based Universal Site Builder (v3.2.0)
**From Zazen Labs, LLC • Canonical Skill Specification**

Build self-contained, AI-first websites and multi-page web applications that run anywhere without Node.js, package managers, or external build pipelines. Designed to work universally with **any hosting platform** (Vercel, Contentstack Launch, Netlify, Cloudflare Pages, AWS Amplify/S3, GitHub Pages, FTP, etc.) and **any AI harness** (Web Gemini, Claude.ai, ChatGPT, Antigravity, Cursor, Claude Desktop, gemini-cli).

---

## 1. Core Architecture Mandates

1. **Flexible Static Architecture (Single or Multi-Page):** Sites may be architected as an immersive single-page experience or as structured multi-page static builds (`index.html`, `about.html`, `journal/index.html`, etc.) depending on content volume, narrative flow, and information hierarchy.

2. **Double-Clickable Portability:** The resulting files must be 100% functional when loaded via `file://` locally, served via static buckets, run in an in-canvas preview, or hosted on any edge CDN/server. External dependencies (Tailwind CDN, Lucide, JSZip, Google Fonts) load strictly via reliable public CDNs.

3. **Decentralized State Store:** All content copy, navigation, tokens, feeds, and metadata live inside `<script id="__ZAZEN_DATA" type="application/json">[...]</script>` and are mirrored in `zazen.config.json`. The DOM is a dynamic, reactive projection of this JSON state.

4. **Strict Separation of Authoring vs. Production (Clean Export Mandate):**
   - The interactive site builder interface (fixed top edit bar, typography and palette pickers, export modals, live preview helpers, and builder runtime scripts) is strictly an *authoring overlay*.
   - **All generated exports (ZIP archives, exported raw HTML, and MCP deployment payloads) MUST be 100% pure production code.**
   - All builder UI elements (`#zazen-builder-bar`, `.zazen-builder-ui`, modal dialogs) and builder control scripts (`script[data-zazen-builder]`) must be scrubbed from the DOM tree before packaging or deploying. The exported site retains only pure semantic markup, typography, layout styling, clean state (`__ZAZEN_DATA`), and client interactivity.

5. **Universal Bi-Directional State Synchronization:**
   - Edits made visually in the builder must never be trapped in transient browser memory.
   - In local harnesses with an active bridge, changes debounced at 600ms automatically persist to disk (`zazen.config.json` and `index.html`) via `POST /api/save`.
   - In web canvas harnesses, changes persist to browser `localStorage` with a 1-click clipboard state sync back to chat.

---

## 2. Universal 3-Tier Deployment Architecture

To guarantee effortless deployments across both Web Harnesses and Local Harnesses, Zazen Builder codifies a strict 3-tier deployment matrix:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ZAZEN BUILDER TOP BAR                           │
│  [Pure ZIP]              [Commit to Git]              [Deploy Host]    │
└────────┬────────────────────────┬───────────────────────────┬──────────┘
         │                        │                           │
         ▼                        ▼                           ▼
  TIER 1: UNIVERSAL         TIER 2: GIT REPO            TIER 3: HOST MCP
  (Web & Local)             (Local Clones)              (Local & Web)
  • 1-Click JSZip           • POST /api/git             • POST /api/deploy
  • Pure production code    • Direct git commit/push    • Writes ./dist & intent
  • Drag & drop anywhere    • Zero copy-paste           • Agent 1-word execution:
                                                          "deploy to vercel"
```

### Tier 1: Instant Pure Production ZIP (Universal Zero-Config)
- **Engine:** Client-side JSZip using DOM cloning and cleaning (`getCleanHtml`).
- **Scrubbing:** Automatically strips `#zazen-builder-bar`, `.zazen-builder-ui`, modal backdrops, and `script[data-zazen-builder]`.
- **Bundle Output:** Packages clean `index.html` + `zazen.config.json` into `<project>-production.zip`.
- **Target Providers:** Universal. Instant drag-and-drop into Vercel Drop, Netlify Drop, Cloudflare Pages, S3, or FTP.

### Tier 2: 1-Click Git & GitHub Repository Sync (Local Harnesses)
- **Prerequisite:** Running in a local environment where `bridge.js` is active inside a git repository.
- **Workflow:**
  1. The user clicks **"Commit to Git"** in the builder bar.
  2. The browser automatically calls `POST /api/save` to persist latest state, then calls `POST /api/git` with an optional commit message.
  3. `bridge.js` runs `git add -A` and `git commit -m "[message]"`, optionally pushing to the active branch (`git push`).
  4. The builder top bar displays confirmation: `✓ Committed to branch [branch-name]`.

### Tier 3: Host Agent & MCP Deployment Handshake
Bridging browser-side visual editing with host-side agent tools (Vercel, Contentstack Launch, Netlify, Cloudflare, S3, FTP):
- **In Local Harnesses (Antigravity, Cursor, CLI):**
  1. User selects target provider (e.g. Vercel, Launch, Netlify) and clicks **"Export & Prepare"**.
  2. Client sends clean files to `POST /api/deploy`.
  3. `bridge.js` writes production files into `./dist/` and writes a deployment manifest to `.zazen/deploy-intent.json`:
     ```json
     {
       "provider": "vercel",
       "project": "my-project",
       "timestamp": "2026-11-03T21:40:00Z",
       "outputDir": "dist",
       "files": ["index.html"],
       "agentCommand": "deploy to vercel"
     }
     ```
  4. The browser informs the user: `Build ready in ./dist. Switch to Antigravity and say: "deploy to vercel"`.
  5. The host agent inspects `.zazen/deploy-intent.json` and immediately executes the provider MCP tool or CLI.
- **In Web Canvas Harnesses (Web Gemini, Claude):**
  1. The UI provides a 1-click **"Copy Update for Chat"** button.
  2. Copies a clean 1-line prompt for the adjacent chat: `"Deploy my site to [provider]. (State attached)"`.

---

## 3. Agent Execution Protocols (Harness-Specific)

### Protocol A: In Local / Desktop / CLI Harnesses (Antigravity, Cursor, Claude Desktop)

When the user asks the agent to build, update, or deploy a site:

#### Phase 1: Site Generation & Server Startup
1. **Generate Files:** Write `index.html` (with decentralized store `<script id="__ZAZEN_DATA">`), `zazen.config.json`, and the zero-dependency `bridge.js`.
2. **Start Daemon Server:** Launch `bridge.js` in the background as a daemon process:
   ```bash
   node bridge.js
   ```
   (Wait 1000ms, ensure port 3000 is listening).
3. **Notify User:** Inform the user with a direct clickable link:
   > *"Your live visual site builder is ready at **http://localhost:3000** with the green `● Bridge Active` status indicator."*

#### Phase 2: Handling Deployment Requests in Chat
When the user says **"deploy"**, **"deploy to vercel"**, **"publish"**, or similar in chat:
1. **Read Intent Manifest:** Inspect `.zazen/deploy-intent.json` to identify target provider and project name.
2. **Verify Clean Production Bundle:** Confirm `./dist/index.html` exists and is scrubbed of all builder overlay elements.
3. **Execute Provider Tool or CLI:**
   - **Vercel:** Run `vercel --prod ./dist` or invoke Vercel MCP `deploy`.
   - **Contentstack Launch:** Run `csdx launch:deploy` or Launch MCP tool.
   - **Netlify:** Run `netlify deploy --prod --dir=./dist` or Netlify MCP tool.
   - **Cloudflare Pages:** Run `wrangler pages deploy ./dist` or Cloudflare MCP.
   - **AWS S3:** Run `aws s3 sync ./dist s3://<bucket> --delete`.
   - **GitHub Pages:** Commit `./dist` contents to branch `gh-pages` and push.
   - **FTP / SFTP:** Run upload script or FTP MCP tool.
4. **Report Verified URL:** Return the live production URL to the user.

---

### Protocol B: In Web / Canvas / Sandboxed Harnesses (Web Gemini, Claude.ai, ChatGPT)

1. **Render in Canvas:** Output the self-contained `index.html` directly into the canvas/artifact window.
2. **Enable Tier 1 ZIP:** User can download the pure production ZIP in 1 click.
3. **Handle State Updates:** When the user asks to update the site or deploy from chat, read the latest canvas state, apply updates, and re-render.

---

## 4. Agency-Grade Aesthetic Standards

Every generated site must achieve the standard of work featured in the portfolios of top global design studios (Pentagram, Area 17, Bureau Oberman, Collins, Fantasy, Apple Design Award winners):

- **Refined Editorial Typography:** 
  - Headlines: Newsreader or Cormorant Garamond (`--font-heading`).
  - Functional Body: Inter or Plus Jakarta Sans (`--font-body`).
  - Metadata, Badges & Coordinates: JetBrains Mono (`--font-mono`).
- **Intentional Geometry & Negative Space:** Hairline architectural gridlines (`border-[var(--border-color)]`), generous vertical rhythm, deliberate asymmetric balance, and breathing room.
- **Palette Presets:**
  - **Warm Linen & Amber:** `--bg: #FAF8F5`, `--surface: #F3EFEA`, `--elevated: #FFFFFF`, `--text: #1C1A17`, `--muted: #6B665E`, `--border: rgba(28, 26, 23, 0.12)`, `--accent: #8C3A27`.
  - **Architect White:** `--bg: #FFFFFF`, `--surface: #F8F9FA`, `--elevated: #FFFFFF`, `--text: #111111`, `--muted: #555555`, `--border: #E5E7EB`, `--accent: #0F52BA`.
  - **Editorial Sand & Ink:** `--bg: #F4EFE6`, `--surface: #ECE4D7`, `--elevated: #FCFAF6`, `--text: #211E1B`, `--muted: #73695E`, `--border: rgba(33, 30, 27, 0.14)`, `--accent: #A35C24`.
  - **Obsidian Darkroom:** `--bg: #0D0E11`, `--surface: #14171C`, `--elevated: #1C2026`, `--text: #EAEBED`, `--muted: #8E929B`, `--border: rgba(234, 235, 237, 0.12)`, `--accent: #D97706`.

---

## 5. Canonical Zero-Dependency Local Bridge (`bridge.js`)

The bridge script requires **zero external npm dependencies** and uses only Node.js native standard libraries (`http`, `fs`, `path`, `child_process`):

```javascript
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
  '.ico': 'image/x-icon'
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
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Endpoint: GET /api/health
  if (req.method === 'GET' && pathname === '/api/health') {
    const gitInfo = getGitInfo();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      bridge: 'zazen-local',
      version: '3.2.0',
      rootDir: ROOT_DIR,
      git: gitInfo
    }));
  }

  // Endpoint: POST /api/save (Auto-Save State & HTML to Disk)
  if (req.method === 'POST' && pathname === '/api/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    return req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { data, html } = payload;

        if (data) {
          fs.writeFileSync(path.join(ROOT_DIR, 'zazen.config.json'), JSON.stringify(data, null, 2), 'utf8');
        }

        if (html) {
          fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html, 'utf8');
        } else if (data) {
          const indexPath = path.join(ROOT_DIR, 'index.html');
          if (fs.existsSync(indexPath)) {
            let current = fs.readFileSync(indexPath, 'utf8');
            const regex = /<script id="__ZAZEN_DATA" type="application\/json">([\s\S]*?)<\/script>/;
            if (regex.test(current)) {
              current = current.replace(regex, `<script id="__ZAZEN_DATA" type="application/json">\n${JSON.stringify(data, null, 2)}\n  </script>`);
              fs.writeFileSync(indexPath, current, 'utf8');
            }
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
  }

  // Endpoint: POST /api/git (Tier 2: 1-Click Commit & Push)
  if (req.method === 'POST' && pathname === '/api/git') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    return req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const message = payload.message || `feat: update site via Zazen Builder (${new Date().toLocaleTimeString()})`;
        const doPush = Boolean(payload.push);

        execSync('git add -A', { cwd: ROOT_DIR, encoding: 'utf8' });
        const status = execSync('git status --porcelain', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
        let commitOut = 'Working tree clean, nothing new to commit.';
        if (status.length > 0) {
          commitOut = execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
        }

        let pushOut = null;
        if (doPush) {
          try {
            pushOut = execSync('git push', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
          } catch (e) {
            pushOut = `Push skipped: ${e.message}`;
          }
        }

        const gitInfo = getGitInfo();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', commit: commitOut, push: pushOut, branch: gitInfo.branch }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
  }

  // Endpoint: POST /api/deploy (Tier 3: Export Clean Build & Write Deploy Intent)
  if (req.method === 'POST' && pathname === '/api/deploy') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    return req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { provider = 'universal', project = 'zazen-site', files = {} } = payload;

        if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
        if (!fs.existsSync(ZAZEN_DIR)) fs.mkdirSync(ZAZEN_DIR, { recursive: true });

        const savedFiles = [];
        for (const [filename, content] of Object.entries(files)) {
          const filePath = path.join(DIST_DIR, filename);
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(filePath, content, 'utf8');
          savedFiles.push(filename);
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

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          provider,
          project,
          outputDir: DIST_DIR,
          files: savedFiles,
          intentFile: '.zazen/deploy-intent.json'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: err.message }));
      }
    });
  }

  // Static File Serving
  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) filePath = path.join(filePath, 'index.html');

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('500 Internal Server Error');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT);
```

---

## 6. Canonical Client-Side Builder Overlay (`data-zazen-builder`)

The following client-side controller script is embedded in `index.html` with attribute `data-zazen-builder` so that `getCleanHtml()` automatically strips it during all exports:

```javascript
const Zazen = {
  data: null,
  bridgeActive: false,
  gitBranch: null,
  saveTimer: null,

  async init() {
    this.data = JSON.parse(document.getElementById('__ZAZEN_DATA').textContent);
    this.render();
    await this.checkMcpBridge();
  },

  // Mandate 4: Pure Clean HTML Extraction (Scrubbing Engine)
  getCleanHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString || document.documentElement.outerHTML, 'text/html');
    doc.querySelectorAll('#zazen-builder-bar, .zazen-builder-ui, script[data-zazen-builder]').forEach(el => el.remove());
    const body = doc.querySelector('body');
    if (body) body.classList.remove('pt-14');
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  },

  async checkMcpBridge() {
    try {
      const res = await fetch('http://localhost:3000/api/health', { method: 'GET' });
      if (res.ok) {
        const info = await res.json();
        this.bridgeActive = true;
        this.gitBranch = info.git?.branch || 'main';
        const pill = document.getElementById('zazen-bridge-status');
        if (pill) {
          pill.textContent = `● Bridge (${this.gitBranch})`;
          pill.className = 'text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        }
      }
    } catch (_) {
      this.bridgeActive = false;
    }
  },

  // Bi-Directional Auto-Save
  scheduleAutoSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.autoSave(), 600);
  },

  async autoSave() {
    if (this.bridgeActive) {
      await fetch('http://localhost:3000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: this.data })
      });
    } else {
      localStorage.setItem('zazen_state_backup', JSON.stringify(this.data));
    }
  },

  // Tier 1: Pure ZIP Download
  async downloadZip() {
    const zip = new JSZip();
    zip.file("index.html", this.getCleanHtml());
    zip.file("zazen.config.json", JSON.stringify(this.data, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(this.data.meta?.title || 'site').toLowerCase().replace(/\s+/g, '-')}-production.zip`;
    a.click();
  },

  // Tier 2: 1-Click Git Commit
  async commitToGit() {
    if (!this.bridgeActive) return alert('Bridge server inactive.');
    const msg = prompt('Commit message:', `feat: update site via Zazen Builder (${new Date().toLocaleTimeString()})`);
    if (!msg) return;
    await this.autoSave();
    const res = await fetch('http://localhost:3000/api/git', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, push: false })
    });
    const result = await res.json();
    alert(result.status === 'success' ? `✓ Committed to ${result.branch}` : `Git error: ${result.error}`);
  },

  // Tier 3: Host Agent Deploy Handshake
  async handleMcpDeploy(provider = 'universal') {
    const project = (this.data.meta?.title || 'site').toLowerCase().replace(/\s+/g, '-');
    const files = {
      'index.html': this.getCleanHtml(),
      'zazen.config.json': JSON.stringify(this.data, null, 2)
    };

    if (this.bridgeActive) {
      await fetch('http://localhost:3000/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, project, files })
      });
      alert(`Clean build exported to ./dist! Switch to your agent and say: "deploy to ${provider}"`);
    } else {
      await navigator.clipboard.writeText(`Deploy my Zazen site to ${provider}. State: ${JSON.stringify(this.data)}`);
      alert(`Copied deployment command to clipboard! Paste it into your AI chat.`);
    }
  }
};
```

