# Zazen Builder

A skills-based, AI-first site builder from **Zazen Labs, LLC** that spins up agency-grade websites and deploys anywhere via MCP and modern web protocols.

## Repository Structure

- **`main` Branch (Canonical Skill):** Houses the canonical Zazen Builder skill definitions (`SKILL.md` and `zazen_builder_skill.md`) and the reference zero-dependency bridge daemon (`scripts/bridge.js`).
- **`sample-site` Branch (Live Implementation):** Contains the sample personal portfolio site implementation (`index.html`, `zazen.config.json`, `bridge.js`) showcasing the full authoring overlay, auto-save engine, and 3-tier deployment workflow.

## The Universal 3-Tier Deployment Architecture

1. **Tier 1: Pure ZIP Download (Universal Zero-Setup):** Client-side JSZip cleans the DOM, strips builder UI controls, and bundles pure production HTML and configurations for instant drag-and-drop into any hosting provider.
2. **Tier 2: 1-Click Git & GitHub Sync (Local Repos):** Automatically commits visual edits to the active repository branch directly from the builder bar via `POST /api/git`.
3. **Tier 3: Agent & MCP Deployment Handshake:** Clean exports are written to `./dist/` alongside `.zazen/deploy-intent.json`, allowing the user to simply switch to their AI agent and type `"deploy"` to trigger Vercel, Contentstack Launch, Netlify, Cloudflare, S3, or FTP MCP tools.

## Using the Skill

To use this skill in Antigravity or any agent harness, reference `SKILL.md` or `zazen_builder_skill.md`.
