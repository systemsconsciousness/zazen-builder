---
name: zazen-builder
description: Spin up exemplary, agency-grade websites for any hosting platform (Vercel, Contentstack Launch, Netlify, Cloudflare Pages, S3, FTP). Supports single-page and multi-page architectures, dynamic content feeds, client-side ZIP bundle download, state export/import synchronization, and 1-click MCP triggers in local/CLI harnesses.
version: 3.0.0
author: Dean Haddock for Zazen Labs, LLC
license: CC-BY-NC-4.0
---

# Zazen Builder: A simpler way to build and deploy sites, from Zazen Labs, LLC (v3.0.0)

Build self-contained, AI-first websites and multi-page web applications that run anywhere without Node.js, package managers, or external build pipelines. Designed to work universally with **any hosting platform** (Vercel, Contentstack Launch, Netlify, Cloudflare Pages, AWS Amplify/S3, GitHub Pages, FTP, etc.).

---

## 1. Core Architecture Mandates

1. **Flexible Static Architecture (Single or Multi-Page):** Sites may be architected as an immersive single-page experience or as structured multi-page static builds (`index.html`, `about.html`, `journal/index.html`, etc.) depending on content volume, narrative flow, and information hierarchy.
2. **Double-Clickable Portability:** The resulting files must be 100% functional when loaded via `file://` locally, served via static buckets, run in an in-canvas preview, or hosted on any edge CDN/server. External dependencies (Tailwind CDN, Lucide, JSZip, Google Fonts) load strictly via reliable public CDNs.
3. **Decentralized State Store:** All content copy, navigation, tokens, feeds, and metadata live inside `<script id="__ZAZEN_DATA" type="application/json">[...]</script>`. The DOM is a dynamic, reactive projection of this JSON state.
4. **Environment-Aware Deployment Pipeline:** 
   - **In Web/Browser-Based AI Harnesses (e.g., Web Gemini, Claude.ai, ChatGPT Web):** The harness cannot access the local filesystem or localhost. The UI provides:
     - **Full ZIP Export:** Download complete production bundle (all HTML files + `zazen.config.json`).
     - **Export/Import Site State:** 1-click JSON snapshot export/import so users can transfer exact site configuration between browser canvas and local CLI/IDE harnesses.
   - **In Local / Desktop / CLI Harnesses (e.g., Claude Desktop, Cursor, gemini-cli):** The agent can directly invoke whatever hosting MCP the user has configured (Vercel, Launch, Netlify, Cloudflare, AWS, FTP) via 1-click trigger or direct MCP call.

---

## 2. Interaction & Scoping Workflow

When the user initializes the skill, the agent prioritizes swift execution while guaranteeing the build matches the user's specific expectations:

* **Optional Scoping Questions (0 to 3 Max):** The agent may ask **up to 3 concise questions** to clarify key preferences before or during generation:
  1. *Structure:* "Would you prefer an elegant, unified single-page layout or a multi-page structure with dedicated sections?"
  2. *Content Feeds:* "Do you need a dynamic feed (e.g., a blog, case study journal, news feed, or changelog), or curated static sections?"
  3. *Aesthetic Mood:* "Do you have a preferred aesthetic direction (e.g., Warm Linen & Amber, Architect White, Editorial Sand, Obsidian Darkroom), or should I pick the best fit for your domain?"
* **Zero-Question Autonomy:** If the user's initial prompt already contains sufficient content, structure, or aesthetic direction, **no questions are required**—the agent should begin building immediately.

---

## 3. Agency-Grade Aesthetic Standards

Every generated site must achieve the standard of work featured in the portfolios of top global design studios (Pentagram, Area 17, Bureau Oberman, Collins, Fantasy, Apple Design Award winners):

* **Refined Editorial Typography:** 
  - Headlines: Newsreader or Cormorant Garamond (`--font-heading`).
  - Functional Body: Inter or Plus Jakarta Sans (`--font-body`).
  - Metadata, Badges & Coordinates: JetBrains Mono (`--font-mono`).
* **Intentional Geometry & Negative Space:** Hairline architectural gridlines (`border-[var(--border-color)]`), generous vertical rhythm, deliberate asymmetric balance, and breathing room.
* **Palette Presets:**
  - **Warm Linen & Amber:** `--bg: #FAF8F5`, `--surface: #F3EFEA`, `--elevated: #FFFFFF`, `--text: #1C1A17`, `--muted: #6B665E`, `--border: rgba(28, 26, 23, 0.12)`, `--accent: #8C3A27`.
  - **Architect White:** `--bg: #FFFFFF`, `--surface: #F8F9FA`, `--elevated: #FFFFFF`, `--text: #111111`, `--muted: #555555`, `--border: #E5E7EB`, `--accent: #0F52BA`.
  - **Editorial Sand & Ink:** `--bg: #F4EFE6`, `--surface: #ECE4D7`, `--elevated: #FCFAF6`, `--text: #211E1B`, `--muted: #73695E`, `--border: rgba(33, 30, 27, 0.14)`, `--accent: #A35C24`.
  - **Obsidian Darkroom:** `--bg: #0D0E11`, `--surface: #14171C`, `--elevated: #1C2026`, `--text: #EAEBED`, `--muted: #8E929B`, `--border: rgba(234, 235, 237, 0.12)`, `--accent: #D97706`.

---

## 4. Universal Deployment & Export Architecture

```
                            [ Click "Deploy" in Edit Bar ]
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │    Unified Deployment Modal     │
                         └────────────────┬────────────────┘
                                          │
          ┌───────────────────────────────┼───────────────────────────────┐
          │                               │                               │
          ▼                               ▼                               ▼
    [ Download ZIP ]             [ State JSON Sync ]             [ Deploy via MCP ]
          │                               │                               │
    JSZip in-memory               Export / Import                  Is Bridge active?
    bundle download              site config state                        │
                                                               ┌──────────┴──────────┐
                                                               │                     │
                                                            [ YES ]               [ NO ]
                                                               │                     │
                                                         POST /api/deploy      Copy structured
                                                         Trigger host MCP      prompt for chat
```

### Mode 1: Production ZIP Download (Universal)
- In-memory archive creation via JSZip.
- Bundles all generated HTML files (`index.html`, `pages/*.html`) and `zazen.config.json`.
- Ready to upload or drag-and-drop into any provider dashboard (Vercel, Netlify Drop, Cloudflare Pages, S3, FTP).

### Mode 2: Site Configuration State Export / Import (Portability Bridge)
- **Export Config:** Exports the complete active `__ZAZEN_DATA` JSON payload as `zazen-state.json`.
- **Import Config:** Imports a previously saved `zazen-state.json` file to immediately rehydrate DOM and editorial state.
- Bridges browser-based sandboxes with local agent tools.

### Mode 3: Universal MCP Trigger (Local & CLI Harnesses)
- Directly communicates with whichever hosting MCP is installed in the local environment (Vercel, Contentstack Launch, Netlify, Cloudflare, S3, FTP).
- In sandboxed browser environments, generates a formatted, ready-to-run prompt with the complete payload for chat handoff.

---

## 5. Fixed Edit Bar & Runtime Implementation

The top navigation bar provides unobtrusive, studio-grade controls:
* **Palette & Typography Selectors:** Instant real-time design token swapping.
* **Page / View Switcher:** Allows seamless toggling between main pages or feed items.
* **Undo / Redo:** In-memory document revision tracking.
* **State Sync:** Quick export and import of site data.
* **Download ZIP:** In-browser bundling of all static production files.
* **Deploy Modal:** Universal hosting selector with 1-click execution or chat handoff.

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

  async buildZip() {
    const zip = new JSZip();
    const primaryHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    zip.file("index.html", primaryHtml);

    // Bundle any secondary pages or feed templates
    if (this.pages && Object.keys(this.pages).length > 0) {
      for (const [path, content] of Object.entries(this.pages)) {
        zip.file(path, content);
      }
    }

    zip.file("zazen.config.json", JSON.stringify(this.data, null, 2));
    return await zip.generateAsync({ type: "blob" });
  },

  downloadZip() {
    this.buildZip().then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const name = this.data.meta?.title?.toLowerCase().replace(/\s+/g, '-') || 'zazen-site';
      a.download = `${name}-bundle.zip`;
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

  async handleMcpDeploy() {
    const project = this.data.meta?.title || 'zazen-site';
    const env = this.data.meta?.environment || 'production';
    const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

    // Option A: Localhost MCP Bridge is active
    if (this.bridgeActive) {
      try {
        const res = await fetch('http://localhost:3000/api/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project,
            environment: env,
            files: {
              'index.html': fullHtml,
              'zazen.config.json': JSON.stringify(this.data, null, 2)
            }
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

    // Option B: Canvas / Sandboxed Fallback (Copy prompt for host agent)
    const prompt = `Deploy the latest Zazen Builder site using the active hosting MCP tool.
Project: "${project}"
Environment: "${env}"

Site Payload:
\`\`\`html
${fullHtml}
\`\`\`
Execute the deployment tool immediately and return the live URL.`;

    try {
      await navigator.clipboard.writeText(prompt);
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
