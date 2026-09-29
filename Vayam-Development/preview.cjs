// Dependency-free local preview. Only public assets in this collection are served.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,dashboardRoot=path.resolve(root,'..','Vayam-Analytics-Dashboard'),port=8770;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(pathname==='/dashboard'){res.writeHead(302,{Location:'/dashboard/'});return res.end();}
  const dashboard=pathname.startsWith('/dashboard/');
  const base=dashboard?dashboardRoot:root;
  const localPath=dashboard?pathname.slice('/dashboard'.length):pathname;
  const file=path.resolve(base,'.'+localPath+(localPath.endsWith('/')?'index.html':''));
  if(!file.startsWith(base+path.sep)||pathname.split('/').some(x=>x.startsWith('.'))||!types[path.extname(file)]||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found');}
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
  if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`Vayam development: http://127.0.0.1:${port}/ — Ctrl+C to stop`)).on('error',e=>{console.error(e.message);process.exitCode=1;});
