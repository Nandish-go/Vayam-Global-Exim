// Deterministic compression of the existing live-site photographs. No generated imagery.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../..');
const destination = path.join(root, 'assets/images');
const images = [
  ['spices','1596040033229-a9821ebd058d',[640,1280]],
  ['rice','1586201375761-83865001e31c',[640,960]],
  ['grocery','1604719312566-8912e9227c6a',[640,960]],
  ['warehouse','1553413077-190dd305871c',[640,960]],
  ['packing','1586528116311-ad8dd3c8310d',[640,960]]
];
(async () => {
  const manifest = [];
  for (const [name,id,widths] of images) {
    const local = path.join(root,'Vayam-Development/shared/images/main-'+name+'.jpg');
    const source = 'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w=1400&q=88';
    let input;
    if (fs.existsSync(local)) input = fs.readFileSync(local);
    else {
      const response = await fetch(source);
      if (!response.ok) throw Error('Could not retrieve existing '+name+' photograph: '+response.status);
      input = Buffer.from(await response.arrayBuffer());
    }
    const files = [];
    for (const width of widths) {
      const file = name+'-'+width+'.webp';
      const info = await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:82}).toFile(path.join(destination,file));
      files.push({file,width:info.width,height:info.height,bytes:info.size});
    }
    manifest.push({name,source,description:'Same photograph as the existing live site, resized and compressed without generative editing.',files});
  }
  fs.writeFileSync(path.join(destination,'SOURCES.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify(manifest));
})().catch(error => {console.error(error.message);process.exitCode=1;});
