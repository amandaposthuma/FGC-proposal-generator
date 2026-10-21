// Local preview server for the proposal generator (used by .claude/launch.json).
// Serves the project folder; POST /__save writes the posted HTML to .claude/print.html
// for headless-Chrome PDF checks.
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const OUT=path.join(__dirname,'print.html');
http.createServer((req,res)=>{
  if(req.method==='POST'&&req.url==='/__save'){
    let b='';req.on('data',c=>b+=c);req.on('end',()=>{fs.writeFileSync(OUT,b);res.writeHead(200,{'Access-Control-Allow-Origin':'*'});res.end('saved '+b.length);});
    return;
  }
  let f=decodeURIComponent(req.url.split('?')[0]);
  if(f.endsWith('/'))f+='index.html';
  const p=path.join(ROOT,f);
  fs.readFile(p,(e,d)=>{
    if(e){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'Content-Type':p.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream'});res.end(d);
  });
}).listen(process.env.PORT||4173,()=>console.log('serving on '+(process.env.PORT||4173)));
