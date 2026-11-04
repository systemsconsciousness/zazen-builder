# Salt Pier Surf Supply — Jacksonville Beach, FL
**Built with Zazen Builder v3.2.0 from Zazen Labs, LLC**

An agency-grade, AI-first website for **Salt Pier Surf Supply**, an oceanfront surf shop, custom boardworks, and surf academy located at 412 1st Street North in Jacksonville Beach, Florida (`30.2886° N, 81.3931° W`).

---

## Features & Highlights

- **Live Jacksonville Beach Conditions Desk:** Daily break reports for Jax Beach Pier (North & South Peaks), wave heights, tide forecasts, water temperatures, and shaper swell analyses.
- **Handcrafted First Coast Quivers:** Authentic surfboard catalog featuring custom shapes from local shapers (fishes, classic single-fin logs, mid-lengths, and hurricane step-ups) with full dimensional specs, fin configurations, and pricing.
- **First Coast Surf Academy & Beach Outpost:** Programs for private surf coaching, youth ocean academy summer camps, rental gear, and in-house ding hospital repairs.
- **Coastal Provisions:** Locally printed heavyweight tees, reef-safe mineral sunscreen, polarized eyewear, and hand-poured surf wax.
- **First Coast Heritage & Break Directory:** Authentic storytelling highlighting four decades of Atlantic swell culture, from the Pier to the Poles at Hanna Park and 16th Ave South.

---

## Zazen Builder In-Browser Authoring Overlay

This site includes the Zazen Builder v3.2.0 interactive visual builder:
- **Instant In-Browser Editing:** Click any heading, badge, price, or description to edit inline.
- **Drag-and-Drop Organization:** Reorder quiver boards, academy programs, provisions, and metrics dynamically.
- **Dynamic Studio Palettes:** Switch between *Warm Linen*, *Editorial Sand*, *Architect White*, and *Obsidian Darkroom*.
- **Subtle Studio Ambient Aura:** Pure CSS ambient illumination field that binds dynamically to the active palette.
- **Decentralized JSON Data Store:** State is persisted in `<script id="__ZAZEN_DATA">` and mirrored in `zazen.config.json`.

---

## Local Development & Authoring Bridge

To launch the local bridge for real-time auto-saving and 1-click git sync:

```bash
# Start the zero-dependency bridge helper on port 3000
npm start
# or
node bridge.js
```

Open `http://localhost:3000` in your browser. The Zazen Builder top bar will automatically detect the local bridge and display `● Bridge (jax-beach-surf-shop)`.

---

## Universal 3-Tier Deployment

1. **Tier 1 (Pure ZIP):** Click **[Pure ZIP]** in the builder bar to download a scrubbed, production-ready bundle (`index.html` + `zazen.config.json`) ready for drag-and-drop hosting.
2. **Tier 2 (1-Click Git Sync):** Click **[Commit & Push]** to automatically stage all visual edits, commit to `jax-beach-surf-shop`, and push to GitHub.
3. **Tier 3 (AI Agent & MCP Deploy):** Click **[Deploy Host]** &rarr; **[Prepare ./dist]**. Return to your AI agent and type `"deploy"` to trigger Vercel, Contentstack Launch, Netlify, or Cloudflare Pages MCP deployments.
