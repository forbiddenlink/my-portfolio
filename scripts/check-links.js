#!/usr/bin/env node

/**
 * Link Checker for Portfolio Projects
 * Verifies all live links and GitHub repos are accessible
 */

const https = require('https');
const http = require('http');

// Import project data (simulate ESM import)
const fs = require('fs');
const path = require('path');

// Read galaxyData.ts and extract links
const galaxyDataPath = path.join(__dirname, '../src/lib/galaxyData.ts');
const content = fs.readFileSync(galaxyDataPath, 'utf-8');

// Simple regex to extract links (good enough for verification)
const liveLinks = [...content.matchAll(/live:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const githubLinks = [...content.matchAll(/github:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

console.log('🔗 Checking Portfolio Links...\n');
console.log(`Found ${liveLinks.length} live links and ${githubLinks.length} GitHub links\n`);

function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        ok: false,
        error: err.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        ok: false,
        error: 'Timeout'
      });
    });
  });
}

async function main() {
  const allLinks = [...new Set([...liveLinks, ...githubLinks])];
  
  console.log('Testing links...\n');
  
  const results = await Promise.all(allLinks.map(checkUrl));
  
  const working = results.filter(r => r.ok);
  const broken = results.filter(r => !r.ok);
  
  console.log('✅ Working links:');
  working.forEach(r => {
    console.log(`  ${r.url} (${r.status})`);
  });
  
  if (broken.length > 0) {
    console.log('\n❌ Broken/Inaccessible links:');
    broken.forEach(r => {
      console.log(`  ${r.url}`);
      if (r.error) console.log(`    Error: ${r.error}`);
      else console.log(`    Status: ${r.status}`);
    });
  }
  
  console.log(`\n📊 Summary: ${working.length}/${allLinks.length} links working`);
  
  if (broken.length > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
