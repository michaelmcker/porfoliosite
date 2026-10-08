import json
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
items=json.loads((root/'docs/industry-variety-2026-10-07/image-manifest.json').read_text())
art={}
for item in items:
 slug=item['slug']; image=Image.open(item['source']).convert('RGB'); image.thumbnail((1536,1536),Image.Resampling.LANCZOS)
 width,height=image.size
 target=root/f'v2/industries/assets/{slug}-design-2.webp'
 image.save(target,'WEBP',quality=84,method=6)
 if target.stat().st_size>290000: image.save(target,'WEBP',quality=77,method=6)
 small=image.resize((768,round(height*768/width)),Image.Resampling.LANCZOS)
 smallpath=root/f'v2/industries/assets/{slug}-design-2-small.webp'; small.save(smallpath,'WEBP',quality=82,method=6)
 art[slug]={'src':'/'+str(target.relative_to(root)),'small':'/'+str(smallpath.relative_to(root)),'width':width,'height':height,'alt':slug.replace('-',' ').capitalize()+' website design','format':'device' if slug=='plumbers' else 'page'}
(root/'v2/industries/artwork.json').write_text(json.dumps(art,indent=2)+'\n')
print('Imported',len(art),'designs; largest',max((root/x['src'][1:]).stat().st_size for x in art.values()),'bytes')
