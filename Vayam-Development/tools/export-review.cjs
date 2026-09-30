// Export the current review as static publishing input; keep the working repo intact.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const source = path.resolve(__dirname, '..');
const repository = path.resolve(source, '..');
const destination = process.argv[2] && path.resolve(process.argv[2]);
if (!destination || destination === repository || destination.startsWith(repository + path.sep)
    || repository.startsWith(destination + path.sep)) {
  throw new Error('Pass an absolute publishing-cache directory outside the working repository.');
}
const publicRoot = path.join(destination, 'dist');
const extensions = new Set(['.html','.css','.js','.json','.jpg','.jpeg','.webp','.png','.svg','.ttf','.txt']);
let count = 0;
function copy(from, to) {
  const info = fs.lstatSync(from);
  if (info.isSymbolicLink()) throw new Error('Publishing input must not contain symbolic links.');
  if (info.isDirectory()) {
    fs.mkdirSync(to, {recursive: true});
    for (const name of fs.readdirSync(from)) if (!name.startsWith('.')) copy(path.join(from,name),path.join(to,name));
  } else if (info.isFile() && extensions.has(path.extname(from).toLowerCase())) {
    fs.mkdirSync(path.dirname(to), {recursive: true});
    fs.copyFileSync(from,to);
    count++;
  }
}
fs.mkdirSync(publicRoot, {recursive: true});
for (const name of ['index.html','responsive.html','privacy.html','credits.html','image-review.html',
  'classic','refined','signature','trade','baseline','shared']) copy(path.join(source,name),path.join(publicRoot,name));
const dashboard = path.join(repository,'Vayam-Analytics-Dashboard');
for (const name of ['index.html','style.css','dashboard.js','sample-data.js','assets'])
  copy(path.join(dashboard,name),path.join(publicRoot,'dashboard',name));
const studio = path.join(publicRoot,'index.html');
fs.writeFileSync(studio,fs.readFileSync(studio,'utf8').replace('Local development collection','Shared design review'),'utf8');
fs.writeFileSync(path.join(publicRoot,'robots.txt'),'User-agent: *\nDisallow: /\n','utf8');
fs.mkdirSync(path.join(destination,'.openai'), {recursive: true});
const manifestFile = path.join(destination,'.openai','hosting.json');
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile,'utf8')) : {};
manifest.static = {directory: 'dist'};
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n','utf8');
const commit = execFileSync('git',['rev-parse','HEAD'],{cwd:repository,encoding:'utf8'}).trim();
fs.writeFileSync(path.join(destination,'README.md'),
  '# Vayam shared design review\n\nGenerated from the single working repository at '+repository+
  ', source commit '+commit+'.\n\nThis is a publishing snapshot, not an additional development checkout. '+
  'Only the review pages, four candidates, baseline, shared public assets and fictional dashboard are included. '+
  'Analytics remains disabled. No GitHub push or production website change is made by the exporter.\n','utf8');
console.log(JSON.stringify({publishing_cache:destination,static_directory:publicRoot,files:count,source_commit:commit}));
