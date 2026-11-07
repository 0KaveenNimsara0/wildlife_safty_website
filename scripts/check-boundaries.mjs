import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const roots=['apps/main-frontend/src','apps/admin-frontend/src','packages/shared/src'];
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
for(const root of roots) for(const file of files(root).filter(f=>/\.[jt]sx?$/.test(f))){
 const text=fs.readFileSync(file,'utf8');
 for(const match of text.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)['"]([^'"]+)['"]/g)){
  if(!match[1].startsWith('.'))continue;
  const target=path.resolve(path.dirname(file),match[1]).replaceAll('\\','/');
  if(root.startsWith('packages'))assert.ok(!target.includes('/apps/'),`${file} imports application internals`);
  if(root.includes('main-frontend'))assert.ok(!target.includes('/admin-frontend/'),`${file} imports admin code`);
  if(root.includes('admin-frontend'))assert.ok(!target.includes('/main-frontend/'),`${file} imports main code`);
 }
}
const manifest=fs.readFileSync('apps/main-frontend/dist/.vite/manifest.json','utf8');
assert.ok(!/AdminLoginPage|AdminRegisterPage|features\/admin|admin-frontend/.test(manifest),'Main build contains admin application modules');
console.log('PASS: package/app boundaries and main build admin exclusion');
