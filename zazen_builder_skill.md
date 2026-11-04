---
name: zazen-builder
description: Spin up exemplary, agency-grade websites for any hosting platform (Vercel, Contentstack Launch, Netlify, Cloudflare Pages, S3, FTP). Supports single-page and multi-page architectures, dynamic content feeds, client-side ZIP bundle download, state export/import synchronization, 1-click clipboard prompt generation for MCP host agents, and direct MCP triggers in local/CLI harnesses.
version: 3.1.0
author: Dean Haddock for Zazen Labs, LLC
license: CC-BY-NC-4.0
---

# Zazen Builder: A simpler way to build and deploy sites, from Zazen Labs, LLC (v3.1.0)

Build self-contained, AI-first websites and multi-page web applications that run anywhere without Node.js, package managers, or external build pipelines. Designed to work universally with **any hosting platform** (Vercel, Contentstack Launch, Netlify, Cloudflare Pages, AWS Amplify/S3, GitHub Pages, FTP, etc.).

---

## 1. Core Architecture Mandates

1. **Flexible Static Architecture (Single or Multi-Page):** Sites may be architected as an immersive single-page experience or as structured multi-page static builds (`index.html`, `about.html`, `journal/index.html`, etc.) depending on content volume, narrative flow, and information hierarchy.

2. **Double-Clickable Portability:** The resulting files must be 100% functional when loaded via `file://` locally, served via static buckets, run in an in-canvas preview, or hosted on any edge CDN/server. External dependencies (Tailwind CDN, Lucide, JSZip, Google Fonts) load strictly via reliable public CDNs.

3. **Decentralized State Store:** All content copy, navigation, tokens, feeds, and metadata live inside `<script id="__ZAZEN_DATA" type="application/json">[...]</script>`. The DOM is a dynamic, reactive projection of this JSON state.

4. **Strict Separation of Authoring vs. Production (Clean Export Mandate):**
   - The interactive site builder interface (fixed top edit bar, typography and palette pickers, export modals, live preview helpers, and builder runtime scripts) is strictly an *authoring overlay*.
   - **All generated exports (ZIP archives, exported raw HTML, and MCP deployment payloads) MUST be 100% pure production code.**
   - All builder UI elements (`#zazen-builder-bar`, `.zazen-builder-ui`, modal dialogs) and builder control scripts (`script[data-zazen-builder]`) must be scrubbed from the DOM tree before packaging or deploying. The exported site retains only pure semantic markup, typography, layout styling, clean state (`__ZAZEN_DATA`), and client interactivity.

5. **Environment-Aware Deployment Pipeline:** 
   - **In Web/Browser-Based AI Harnesses (e.g., Web Gemini, Claude.ai, ChatGPT Web):** The harness cannot access the local filesystem or localhost. The UI provides:
     - **Pure Production ZIP Export:** Download complete production bundle (all pure HTML files + `zazen.config.json`) free of any builder UI code.
     - **Copy MCP Agent Deployment Prompt:** 1-click clipboard copy containing a clean, structured JSON and markdown prompt ready to paste directly into any host agent (Cursor, Claude Desktop, gemini-cli) or hosting MCP server to deploy immediately.
     - **Export/Import Site State:** 1-click JSON snapshot export/import (`zazen-state.json`) so users can transfer exact site configuration between browser canvas and local CLI/IDE harnesses.
   - **In Local / Desktop / CLI Harnesses (e.g., Claude Desktop, Cursor, gemini-cli, Antigravity):**
     - **Automatic Local Bridge Daemon:** The agent automatically creates and runs the zero-dependency Node bridge (`node bridge.js`) in the background on `http://localhost:3000`.
     - **Live Local Authoring:** The user visualizes and edits the site at `http://localhost:3000` with the active bridge status (`● MCP Bridge Ready`).
     - **Direct Clean Export & MCP Handoff:** Deployments write scrubbed, production-pure HTML and configs directly to `./dist/` via `POST /api/deploy` and can trigger active hosting MCP tools directly.

---

## 2. Interaction & Scoping Workflow

When the user initializes the skill, the agent prioritizes swift execution while guaranteeing the build matches the user's specific expectations:

- **Optional Scoping Questions (0 to 3 Max):** The agent may ask **up to 3 concise questions** to clarify key preferences before or during generation:
  1. *Structure:* "Would you prefer an elegant, unified single-page layout or a multi-page structure with dedicated sections?"
  2. *Content Feeds:* "Do you need a dynamic feed (e.g., a blog, case study journal, news feed, or changelog), or curated static sections?"
  3. *Aesthetic Mood:* "Do you have a preferred aesthetic direction (e.g., Warm Linen & Amber, Architect White, Editorial Sand, Obsidian Darkroom), or should I pick the best fit for your domain?"
- **Zero-Question Autonomy:** If the user's initial prompt already contains sufficient content, structure, or aesthetic direction, **no questions are required**—the agent should begin building immediately.
- **Local Harness Execution Protocol:** When running in a local environment (CLI, Desktop IDE, Antigravity, Cursor), the agent must:
  1. Generate `index.html` (with decentralized store `__ZAZEN_DATA`), `zazen.config.json`, and the zero-dependency `bridge.js`.
  2. Launch `bridge.js` in the background (as a daemon process) on port 3000.
  3. Direct the user to open `http://localhost:3000` to interact with the live builder bar and edit overlay.

---

## 3. Agency-Grade Aesthetic Standards

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

## 4. Universal 3-Tier Deployment Architecture

To guarantee effortless deployments across both Web Harnesses (Gemini Web, Claude Canvas) and Local Harnesses (Antigravity, Cursor, CLI), Zazen Builder codifies a 3-tier deployment matrix:

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
  4. The builder top bar displays confirmation: `✓ Committed to branch sample-site`.

### Tier 3: Host Agent & MCP Deployment Handshake
Bridging browser-side visual editing with host-side agent tools (Vercel, Contentstack Launch, Netlify, Cloudflare, S3, FTP):
- **In Local Harnesses (Antigravity, Cursor):**
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

### The Auto-Save Engine (`POST /api/save`)
Whenever the user changes palettes, edits content, or reorders sections:
1. The client debounces 600ms and issues `POST /api/save` with `{ data: this.data }`.
2. In local environments, `bridge.js` immediately overwrites `zazen.config.json` and re-injects the updated store into `index.html`.
3. In web canvas environments, the client writes a backup to browser `localStorage`.

---

### Reference Zero-Dependency Local Bridge (`bridge.js`)

```javascript
const http = require('http'), fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const PORT = process.env.PORT || 3000, ROOT = process.cwd(), DIST = path.join(ROOT, 'dist'), ZAZEN = path.join(ROOT, '.zazen');
const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css' };

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Health Check
  if (req.method === 'GET' && parsed.pathname === '/api/health') {
    let branch = 'main';
    try { branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(); } catch (_) {}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', bridge: 'zazen-local', git: { branch } }));
  }

  // Auto-Save
  if (req.method === 'POST' && parsed.pathname === '/api/save') {
    let body = ''; req.on('data', c => body += c);
    return req.on('end', () => {
      const { data } = JSON.parse(body);
      if (data) fs.writeFileSync(path.join(ROOT, 'zazen.config.json'), JSON.stringify(data, null, 2), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success' }));
    });
  }

  // 1-Click Git Commit
  if (req.method === 'POST' && parsed.pathname === '/api/git') {
    let body = ''; req.on('data', c => body += c);
    return req.on('end', () => {
      const { message = 'feat: update site via Zazen Builder' } = JSON.parse(body || '{}');
      execSync('git add -A', { cwd: ROOT });
      const out = execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd: ROOT, encoding: 'utf8' });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', commit: out }));
    });
  }

  // Tier 3 Clean Deploy Export & Intent Manifest
  if (req.method === 'POST' && parsed.pathname === '/api/deploy') {
    let body = ''; req.on('data', c => body += c);
    return req.on('end', () => {
      const { provider = 'universal', project = 'zazen-site', files = {} } = JSON.parse(body);
      if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
      if (!fs.existsSync(ZAZEN)) fs.mkdirSync(ZAZEN, { recursive: true });
      for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(DIST, name), content, 'utf8');
      }
      fs.writeFileSync(path.join(ZAZEN, 'deploy-intent.json'), JSON.stringify({ provider, project, timestamp: new Date().toISOString(), outputDir: 'dist' }, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', outputDir: DIST }));
    });
  }

  // Static File Serving
  let file = path.join(ROOT, parsed.pathname === '/' ? 'index.html' : parsed.pathname);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('Not Found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'text/plain' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT);
```

---

## 5. Fixed Edit Bar & Runtime Implementation

The top navigation bar provides unobtrusive, studio-grade controls:
- **Palette & Typography Selectors:** Instant real-time design token swapping.
- **Page / View Switcher:** Seamless toggling between main pages or feed items.
- **Undo / Redo:** In-memory document revision tracking.
- **State Sync:** Quick export and import of site data.
- **Download Pure ZIP:** In-browser bundling of clean production files without builder UI.
- **Copy MCP Prompt / Deploy:** Universal hosting selector with direct MCP execution or 1-click clipboard prompt handoff.

```javascript
const Zazen = {
  data: null,
  pages: {},
  bridgeActive: false,

  async init() {
    this.data = JSON.parse(document.getElementById('__ZAZEN_DATA').textContent);
    this.render();
    this.bindEvents();
    await this.checkMcpBridge();
  },

  // Strips all builder toolbars, modals, and management scripts from document markup
  getCleanHtml(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString || document.documentElement.outerHTML, 'text/html');

    // Remove the builder toolbar, modals, and builder-specific runtime scripts
    doc.querySelectorAll('#zazen-builder-bar, .zazen-builder-ui, script[data-zazen-builder]').forEach(el => el.remove());

    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
  },

  async checkMcpBridge() {
    try {
      const res = await fetch('http://localhost:3000/api/health', { method: 'GET' });
      if (res.ok) {
        this.bridgeActive = true;
        const pill = document.getElementById('zazen-bridge-status');
        if (pill) {
          pill.textContent = '● MCP Bridge Ready';
          pill.className = 'text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        }
      }
    } catch (_) {
      this.bridgeActive = false;
    }
  },

  async buildPureZip() {
    const zip = new JSZip();
    const cleanIndexHtml = this.getCleanHtml();
    zip.file("index.html", cleanIndexHtml);

    // Bundle any secondary pages or feed templates (ensuring clean DOM output)
    if (this.pages && Object.keys(this.pages).length > 0) {
      for (const [path, content] of Object.entries(this.pages)) {
        zip.file(path, this.getCleanHtml(content));
      }
    }

    zip.file("zazen.config.json", JSON.stringify(this.data, null, 2));
    return await zip.generateAsync({ type: "blob" });
  },

  downloadZip() {
    this.buildPureZip().then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const name = this.data.meta?.title?.toLowerCase().replace(/\s+/g, '-') || 'zazen-site';
      a.download = `${name}-production.zip`;
      a.click();
    });
  },

  exportState() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'zazen-state.json';
    a.click();
  },

  importState(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this.data = JSON.parse(e.target.result);
        document.getElementById('__ZAZEN_DATA').textContent = JSON.stringify(this.data, null, 2);
        this.render();
      } catch (err) {
        alert('Invalid state JSON file');
      }
    };
    reader.readAsText(file);
  },

  openDeployModal() {
    document.getElementById('zazen-deploy-modal')?.classList.remove('hidden');
  },

  closeDeployModal() {
    document.getElementById('zazen-deploy-modal')?.classList.add('hidden');
  },

  generateMcpPrompt(provider = 'universal') {
    const project = this.data.meta?.title || 'zazen-site';
    const env = this.data.meta?.environment || 'production';
    const cleanIndexHtml = this.getCleanHtml();

    const files = {
      'index.html': cleanIndexHtml,
      'zazen.config.json': JSON.stringify(this.data, null, 2)
    };

    if (this.pages) {
      for (const [path, content] of Object.entries(this.pages)) {
        files[path] = this.getCleanHtml(content);
      }
    }

    return `Deploy this static site to ${provider.toUpperCase()} using your active hosting MCP tool.

Project: "${project}"
Environment: "${env}"
Framework: "static"
Output Directory: "."

Payload Files:
\`\`\`json
${JSON.stringify(files, null, 2)}
\`\`\`

Instructions for Agent:
1. Initialize or connect to the target project "${project}".
2. Write or deploy the supplied production files.
3. Return the verified live deployment URL.`;
  },

  async handleMcpDeploy(provider = 'universal') {
    const project = this.data.meta?.title || 'zazen-site';
    const env = this.data.meta?.environment || 'production';
    const cleanIndexHtml = this.getCleanHtml();

    const files = {
      'index.html': cleanIndexHtml,
      'zazen.config.json': JSON.stringify(this.data, null, 2)
    };

    if (this.pages) {
      for (const [path, content] of Object.entries(this.pages)) {
        files[path] = this.getCleanHtml(content);
      }
    }

    // Option A: Localhost MCP Bridge is active
    if (this.bridgeActive) {
      try {
        const res = await fetch('http://localhost:3000/api/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            project,
            environment: env,
            files
          })
        });
        const result = await res.json();
        alert(result.url ? `Deployed successfully: ${result.url}` : `Deployment triggered: ${result.status}`);
        this.closeDeployModal();
        return;
      } catch (err) {
        console.warn('Bridge request failed, falling back to prompt copy', err);
      }
    }

    // Option B: Canvas / Sandboxed Fallback (Copy formatted prompt for host agent)
    const prompt = this.generateMcpPrompt(provider);

    try {
      await navigator.clipboard.writeText(prompt);
      alert('MCP Deployment prompt copied to clipboard! Paste it into your agent to deploy.');
    } catch (_) {}

    const panel = document.getElementById('mcp-prompt-panel');
    const textarea = document.getElementById('mcp-prompt-textarea');
    if (panel && textarea) {
      textarea.value = prompt;
      panel.classList.remove('hidden');
    }
  }
};
```