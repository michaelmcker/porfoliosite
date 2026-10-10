"""Render the owned three-per-week calendar from canonical records, without rescheduling."""
from pathlib import Path
import json,csv,html
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/editorial-2026-10-08'
OUT.mkdir(parents=True,exist_ok=True)
publishing=json.loads((ROOT/'content/resources/publishing.json').read_text())
items=[]
for slug,row in publishing['articles'].items():
 if row['publishOn']>'2026-10-10':items.append({**row,'slug':slug,'title':slug.replace('-',' ').capitalize(),'format':'resource','city':'Okanagan','primaryMoneyPage':'/web-design/','buyerDecision':'Existing queued article; retain saved editorial research.','draftPath':'Existing approved article source'})
for year in (2026,2027):items+=json.loads((ROOT/f'content/resources/editorial-calendar-{year}.json').read_text())
items.sort(key=lambda a:a['publishOn'])
with (OUT/'calendar-2027.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,lineterminator='\n',fieldnames=['publishOn','title','format','city','primaryMoneyPage','buyerDecision','status']);w.writeheader();w.writerows({k:a.get(k,'') for k in w.fieldnames} for a in items)
cards=''.join(f'<article><time>{a["publishOn"]}</time><div><h2>{html.escape(a["title"])}</h2><p>{html.escape(a["buyerDecision"])}</p><a href="https://michaelmck.site{a["primaryMoneyPage"]}">{a["primaryMoneyPage"]}</a><p>{html.escape(a.get("draftPath",""))}</p></div></article>' for a in items)
(OUT/'calendar-2027.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Resource publishing calendar</title><style>body{font:17px/1.65 system-ui;max-width:1100px;margin:auto;padding:40px 24px}h1{font-size:clamp(40px,7vw,72px);line-height:1.05}h2{font-size:24px;line-height:1.3}article{display:grid;grid-template-columns:140px 1fr;gap:30px;padding:30px 0;border-top:1px solid #ddd}p{max-width:80ch}a{color:#284d39}time{font-weight:600}@media(max-width:600px){article{grid-template-columns:1fr;gap:10px}}</style><h1>Three useful articles.<br>Every week.</h1><p>Monday, Wednesday and Friday at 9 a.m. Vancouver time. The existing 69 queued manuscripts fill October 12, 2026–March 19, 2027. Facts, links and layouts are checked before each release. Drafts remain private until their scheduled dates.</p>'+cards+'</html>')
print('Rendered',len(items),'scheduled resources.')
