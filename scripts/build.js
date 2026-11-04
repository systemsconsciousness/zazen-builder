#!/usr/bin/env node
/**
 * Zazen Builder Cloud Host Build Script
 * 
 * Automatically executed by cloud hosting providers (Vercel, Netlify, Cloudflare Pages, Render)
 * during deployment builds.
 * 
 * Inspects cloud environment variables (zazen-edit, ZAZEN_EDIT, zazen_edit) and stamps the
 * secure authorization meta tag into index.html so authoring mode is appropriately enabled or
 * suppressed on the cloud host.
 */

const fs = require('fs');
const path = require('path');

function isTruthy(val) {
  if (val === true || val === 1) return true;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'on' || s === 'enabled';
  }
  return false;
}

// Check all common environment variable naming conventions
const rawEnv = process.env['zazen-edit'] ||
               process.env.ZAZEN_EDIT ||
               process.env.zazen_edit ||
               process.env.NEXT_PUBLIC_ZAZEN_EDIT ||
               process.env.VITE_ZAZEN_EDIT ||
               process.env.PUBLIC_ZAZEN_EDIT || '';

const isAuthoringActive = isTruthy(rawEnv);

console.log(`[Zazen Build] Cloud environment check: zazen-edit="${rawEnv}" => Authoring Mode: ${isAuthoringActive ? 'ENABLED' : 'DISABLED'}`);

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const envJsonPath = path.join(rootDir, 'zazen-env.json');
const distDir = path.join(rootDir, 'dist');
const distIndexPath = path.join(distDir, 'index.html');
const distEnvJsonPath = path.join(distDir, 'zazen-env.json');

const envPayload = JSON.stringify({ edit: isAuthoringActive, isEdit: isAuthoringActive, timestamp: Date.now() }, null, 2);

// Write static fallback JSON endpoint
fs.writeFileSync(envJsonPath, envPayload, 'utf8');

function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Look for existing zazen-edit meta tag
  const metaRegex = /<meta\s+name=["']zazen-edit["']\s+content=["'][^"']*["']\s*\/?>/i;
  const newMeta = `<meta name="zazen-edit" content="${isAuthoringActive ? 'true' : 'false'}">`;

  if (metaRegex.test(html)) {
    html = html.replace(metaRegex, () => newMeta);
  } else {
    // Insert right after <head> or charset
    html = html.replace(/(<head[^>]*>)/i, `$1\n  ${newMeta}`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[Zazen Build] Stamped ${filePath} with meta zazen-edit="${isAuthoringActive ? 'true' : 'false'}"`);
}

updateHtmlFile(indexPath);

if (fs.existsSync(distDir)) {
  updateHtmlFile(distIndexPath);
  fs.writeFileSync(distEnvJsonPath, envPayload, 'utf8');
}
