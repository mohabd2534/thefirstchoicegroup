#!/usr/bin/env node
/* Runs inside GitHub Actions (which CAN reach Vercel). Reads ./site and
   deploys it as a static PRODUCTION deployment to the thefirstchoicegroup
   project via the Vercel API. Token comes from the VERCEL_TOKEN repo secret. */
const fs = require('fs');
const path = require('path');

const TEAM = 'team_pRPEJWqWQ9MaIdGB954rzwGt';
const PROJECT = 'thefirstchoicegroup';
const SRC = path.join(process.cwd(), 'site');
const TOKEN = (process.env.VERCEL_TOKEN || '').trim();
if (!TOKEN) { console.error('NO VERCEL_TOKEN secret set'); process.exit(2); }

function walk(dir, base) {
  let out = [];
  for (const n of fs.readdirSync(dir)) {
    if (n.startsWith('.')) continue;
    const full = path.join(dir, n), rel = base ? base + '/' + n : n, st = fs.statSync(full);
    if (st.isDirectory()) out = out.concat(walk(full, rel));
    else out.push({ rel, full });
  }
  return out;
}
const SKIP = new Set(['README.md']);
const files = walk(SRC, '')
  .filter(f => !SKIP.has(f.rel))
  .filter(f => f.rel.endsWith('.html') || f.rel.startsWith('assets/') || f.rel === 'vercel.json')
  .map(f => ({ file: f.rel, data: fs.readFileSync(f.full, 'utf8'), encoding: 'utf-8' }));

(async () => {
  console.log('Deploying ' + files.length + ' files to Vercel production...');
  const body = {
    name: PROJECT, project: PROJECT, target: 'production', files,
    projectSettings: { framework: null, buildCommand: null, installCommand: null, outputDirectory: null }
  };
  const res = await fetch('https://api.vercel.com/v13/deployments?teamId=' + TEAM + '&forceNew=1', {
    method: 'POST', headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const j = await res.json();
  if (!res.ok) { console.error('DEPLOY_ERROR', res.status, JSON.stringify(j).slice(0, 1000)); process.exit(1); }
  const id = j.id || j.uid;
  console.log('Deployment created:', id, j.url || '');
  for (let i = 0; i < 100; i++) {
    await new Promise(r => setTimeout(r, 2500));
    const s = await fetch('https://api.vercel.com/v13/deployments/' + id + '?teamId=' + TEAM, { headers: { Authorization: 'Bearer ' + TOKEN } });
    const sj = await s.json();
    const st = sj.readyState || sj.status;
    if (st === 'READY') { console.log('READY: https://' + (sj.url || j.url)); return; }
    if (st === 'ERROR' || st === 'CANCELED') { console.error('BUILD_' + st, JSON.stringify(sj).slice(0, 700)); process.exit(1); }
  }
  console.error('Timed out waiting for READY'); process.exit(1);
})().catch(e => { console.error('EXC', e.message); process.exit(1); });
