import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

const isGhPages = process.env.GITHUB_PAGES === 'true';
const basePath = '/alaya-realty';

// Helper to recursively find all HTML and CSS files
function getFiles(dir, extensions = ['.html', '.css', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

// 1. If building for GitHub Pages, prefix root-relative paths with /alaya-realty
if (isGhPages) {
  console.log('Prefixing static asset paths for GitHub Pages subpath (/alaya-realty)...');
  const files = getFiles(distDir);
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace src="/images/ with src="/alaya-realty/images/
    content = content.replace(/(src|href)=["']\/images\//g, `$1="${basePath}/images/`);
    content = content.replace(/url\(["']?\/images\//g, `url('${basePath}/images/`);
    
    // Replace href="/..." internal links (excluding /alaya-realty, http, //, mailto, tel, #)
    content = content.replace(/href=["']\/(?!\/|alaya-realty|#|http|api|mailto|tel)([a-zA-Z0-9_\-\/]*?)["']/g, `href="${basePath}/$1"`);

    fs.writeFileSync(file, content, 'utf8');
  }
}

// 2. Map all pages to clean directory/index.html for serverless static hosting
const pages = [
  'veda-park',
  'veda-commune',
  'urban-shivashish',
  'advisory',
  'insights',
  'about',
  'contact',
  'properties',
  'article-industrial'
];

for (const page of pages) {
  const htmlFile = path.join(distDir, `${page}.html`);
  if (fs.existsSync(htmlFile)) {
    const pageDir = path.join(distDir, page);
    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
    fs.copyFileSync(htmlFile, path.join(pageDir, 'index.html'));
  }
}

// Map /projects subroutes as well
const projects = ['veda-park', 'veda-commune', 'urban-shivashish'];
for (const p of projects) {
  const htmlFile = path.join(distDir, `${p}.html`);
  if (fs.existsSync(htmlFile)) {
    const projDir = path.join(distDir, 'projects', p);
    if (!fs.existsSync(projDir)) fs.mkdirSync(projDir, { recursive: true });
    fs.copyFileSync(htmlFile, path.join(projDir, 'index.html'));
  }
}

// 3. Create 404.html fallback
const indexHtml = path.join(distDir, 'index.html');
const fourOhFour = path.join(distDir, '404.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, fourOhFour);
}

// 4. Create .nojekyll so GitHub Pages does not ignore files starting with _
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');

console.log('✓ Distribution static directories and fallback routes prepared successfully.');
