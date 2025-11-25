const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = ['png','jpg','jpeg','svg','webp','gif'];
const filePatterns = ['**/*.html','**/*.htm','**/*.css','**/*.js'];

const walk = (dir, files=[]) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) {
      // skip node_modules or .git
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(res, files);
    } else {
      files.push(res);
    }
  }
  return files;
};

const files = walk(root);
const targetFiles = files.filter(f => /\.(html|htm|css|js)$/.test(f));

const imgRegex = /(?:src=\"([^\"]+\.(?:png|jpg|jpeg|svg|webp|gif))\")|(?:url\((?:'|\")?([^'\")]+\.(?:png|jpg|jpeg|svg|webp|gif))(?:'|\")?\))/gi;

const missing = [];

for (const file of targetFiles) {
  const txt = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = imgRegex.exec(txt)) !== null) {
    const rel = m[1] || m[2];
    if (!rel) continue;
    // ignore absolute URLs
    if (/^https?:\/\//i.test(rel) || rel.startsWith('data:')) continue;
    // resolve relative to the file location
    const basedir = path.dirname(file);
    // handle leading ./ or / or ..
    const candidate = path.resolve(basedir, rel);
    if (!fs.existsSync(candidate)) {
      missing.push({file: path.relative(root, file), reference: rel, resolved: path.relative(root, candidate)});
    }
  }
}

if (missing.length === 0) {
  console.log('OK: no missing image references found');
  process.exit(0);
}

console.log('Missing image references:');
for (const m of missing) {
  console.log(`- In file: ${m.file}\n    reference: ${m.reference}\n    resolved path (expected): ${m.resolved}\n`);
}
process.exit(1);
