const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'backend', 'Services', 'ghanaRegions.js');
let src = fs.readFileSync(filePath, 'utf8');
// Replace export with module.exports to evaluate
const transformed = src.replace(/export\s+const\s+ghanaRegions\s*=\s*/, 'module.exports = ');
let ghanaRegions;
try {
  ghanaRegions = eval(transformed);
} catch (e) {
  console.error('Failed to parse ghanaRegions.js:', e);
  process.exit(1);
}

function normalize(name) {
  if (!name || typeof name !== 'string') return name;
  // replace slashes with hyphens, collapse whitespace, remove spaces around hyphens
  let n = name.replace(/\//g, '-');
  n = n.replace(/\s*-\s*/g, '-');
  n = n.replace(/\s+/g, ' ').trim();
  return n;
}

let totalBefore = 0;
let totalAfter = 0;
ghanaRegions.forEach(r => {
  totalBefore += (r.districts || []).length;
  // normalize and dedupe while preserving order
  const seen = new Set();
  const cleaned = [];
  (r.districts || []).forEach(d => {
    const c = normalize(d);
    if (!seen.has(c)) {
      seen.add(c);
      cleaned.push(c);
    }
  });
  r.districts = cleaned;
  totalAfter += cleaned.length;
});

// write back with same formatting
const out = 'export const ghanaRegions = ' + JSON.stringify(ghanaRegions, null, 2) + ";\n";
// Convert JSON object keys to unquoted region/districts style? Keep as valid JS export
fs.writeFileSync(filePath, out, 'utf8');
console.log('Updated', filePath);
console.log('Total before:', totalBefore, 'Total after:', totalAfter);
