"""Build a private, searchable reader and editable manuscript from full draft JSON."""
from pathlib import Path
from html.parser import HTMLParser
import html, json, re, csv, shutil

ROOT=Path(__file__).resolve().parents[1]
DOC=ROOT/'docs/draft-library-2026-10-08'
DATA=ROOT/'content/resources/draft-library'
DEST=Path('/Users/michaelmckerracher/Business Research/website-market-2026-10-07/docs/2026-10-08-complete-draft-library')

class Markdown(HTMLParser):
    def __init__(self):super().__init__();self.out=[];self.hrefs=[];self.inrow=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ['p','ul','ol','table','blockquote']:self.out.append('\n\n')
        elif tag=='li':self.out.append('\n- ')
        elif tag=='h3':self.out.append('\n\n### ')
        elif tag in ['strong','em']:self.out.append('**' if tag=='strong' else '*')
        elif tag=='a':self.out.append('[');self.hrefs.append(a.get('href',''))
        elif tag=='tr':self.out.append('\n| ');self.inrow=True
        elif tag=='br':self.out.append('\n')
    def handle_endtag(self,tag):
        if tag in ['p','h3','ul','ol','table','blockquote']:self.out.append('\n\n')
        elif tag in ['strong','em']:self.out.append('**' if tag=='strong' else '*')
        elif tag=='a':self.out.append(']('+self.hrefs.pop()+')')
        elif tag in ['td','th']:self.out.append(' | ')
        elif tag=='tr':self.inrow=False
    def handle_data(self,data):self.out.append(data)
def md(body):
    # Preserve well-formed tables as HTML in Markdown; avoid lossy table conversion.
    saved=[]
    body=re.sub(r'<table[\s\S]*?</table>',lambda m:(saved.append(m.group(0)) or f'\n\nTABLETOKEN{len(saved)-1}\n\n'),body)
    p=Markdown();p.feed(body);text=re.sub(r'\n{3,}','\n\n',''.join(p.out)).strip()
    for i,table in enumerate(saved):text=text.replace(f'TABLETOKEN{i}',table)
    return text
def esc(x):return html.escape(str(x),quote=True)
def read_copy(a):return a['summary']+' '+''.join(s['title']+' '+s['body'] for s in a['sections'])+' '+' '.join(' '.join(q) for q in a['faqs'])
CSS='''@font-face{font-family:DM;src:url(fonts/dm-sans-latin-variable.woff2)}@font-face{font-family:Fraunces;src:url(fonts/fraunces-latin-variable.woff2)}*{box-sizing:border-box}body{margin:0;background:#faf9f6;color:#19251e;font-family:DM,Arial,sans-serif;line-height:1.65}a{color:inherit;text-underline-offset:4px}header,main,footer{max-width:1200px;margin:auto;padding:32px}header{border-bottom:1px solid #d8ddd5}h1,h2,h3{line-height:1.14;letter-spacing:-.035em}h1{font-size:clamp(36px,6vw,72px);max-width:1050px;margin:28px 0}h1 em{font-family:Fraunces,Georgia,serif;font-weight:400}h2{font-size:30px;margin:42px 0 20px}h3{font-size:21px}.intro{font-size:21px;max-width:800px}.meta{font-size:14px;color:#526458}.controls{display:flex;flex-wrap:wrap;gap:12px;margin:28px 0}input,select{font:inherit;padding:12px 16px;border:1px solid #9aa69a;background:white;border-radius:6px;max-width:100%}input{flex:1;min-width:240px}select{min-width:180px}.list{display:grid;grid-template-columns:1fr 1fr;gap:0 40px}.card{border-top:1px solid #c9d1c8;padding:24px 0}.card h2{font-size:25px;margin:10px 0}.card p{margin:8px 0}.pill{display:inline-block;font-size:13px;background:#e3a916;padding:4px 10px;border-radius:20px}.count{font-size:15px}nav{display:flex;gap:20px;flex-wrap:wrap}.reading{max-width:840px;padding-top:10px}.reading p,.reading li{font-size:18px}.reading .summary{font-size:23px;line-height:1.5}.reading ul,.reading ol{padding-left:24px}.table-wrap{overflow-x:auto;margin:24px 0;border:1px solid #ccd4cb}table{border-collapse:collapse;width:100%;font-size:16px}td,th{border:1px solid #d6dbd3;padding:12px;vertical-align:top;text-align:left}th{background:#203c30;color:white}caption{text-align:left;padding:14px;font-weight:600}.sources{font-size:14px;overflow-wrap:anywhere}.sources li{font-size:15px}.private{background:#203c30;color:white;padding:12px 22px;font-size:14px}.private a{color:white}.check{padding:24px;background:#f1eee5;border-radius:8px}details{margin-top:30px;padding-top:20px;border-top:1px solid #cbd4ca}summary{cursor:pointer;font-weight:600}.provenance{overflow-wrap:anywhere}footer{border-top:1px solid #d8ddd5}.empty{display:none}@media(max-width:700px){header,main,footer{padding:22px}.list{grid-template-columns:1fr}h1{margin:22px 0}.reading p,.reading li{font-size:17px}.reading .summary{font-size:20px}h2{font-size:26px}.controls{display:block}.controls>*{width:100%;margin-bottom:10px}input{min-width:0}th,td{min-width:150px}.meta{font-size:13px}}@media print{.private,.controls,details,nav{display:none}body{background:white}.reading{max-width:none}.card{break-inside:avoid}a{text-decoration:none}}'''

def build():
    DEST.mkdir(parents=True,exist_ok=True);(DEST/'articles').mkdir(exist_ok=True);(DEST/'json').mkdir(exist_ok=True);(DEST/'markdown').mkdir(exist_ok=True);(DEST/'fonts').mkdir(exist_ok=True)
    for name in ['dm-sans-latin-variable.woff2','fraunces-latin-variable.woff2']:
        p=ROOT/'v2/assets/fonts'/name
        if p.exists():shutil.copy2(p,DEST/'fonts'/name)
    (DEST/'reader.css').write_text(CSS)
    briefs=json.loads((DOC/'briefs.json').read_text());by={x['slug']:x for x in briefs}
    data=[json.loads(p.read_text()) for p in DATA.glob('*.json')];data.sort(key=lambda x:x['plannedPublishOn']);slugs={a['slug'] for a in data}
    references=json.loads((DOC/'existing-articles.json').read_text()) if (DOC/'existing-articles.json').exists() else []
    reference_slugs={a['slug'] for a in references}
    (DEST/'references').mkdir(exist_ok=True)
    def link_html(body):
        def repl(m):
            path=m.group(1)
            if path.startswith('/blog/') and path.strip('/').split('/')[-1] in slugs:return 'href="'+path.strip('/').split('/')[-1]+'.html"'
            if path.startswith('/blog/') and path.strip('/').split('/')[-1] in reference_slugs:return 'href="../references/'+path.strip('/').split('/')[-1]+'.html"'
            return 'href="https://michaelmck.site'+path+'"'
        return re.sub(r'href="(/[^\"]*)"',repl,body)
    for a in references:
        body=''.join('<section><h2>'+esc(s['title'])+'</h2>'+s['body']+'</section>' for s in a['sections'])
        body=re.sub(r'href="(/[^\"]*)"',lambda m:'href="'+(m.group(1).strip('/').split('/')[-1]+'.html' if m.group(1).startswith('/blog/') and m.group(1).strip('/').split('/')[-1] in reference_slugs else 'https://michaelmck.site'+m.group(1))+'"',body)
        body=body.replace('<table>','<div class="table-wrap"><table>').replace('</table>','</table></div>')
        faq=''.join('<h3>'+esc(q)+'</h3><p>'+esc(ans)+'</p>' for q,ans in a['faqs'])
        page='<!doctype html><html lang="en-CA"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+esc(a['title'])+'</title><link rel="stylesheet" href="../reader.css"><div class="private">Existing resource · Local reference copy · Release slot '+a['publication']['publishOn']+'</div><header><a href="../index.html">Back to the 60 new drafts</a><h1>'+esc(a['title'])+'</h1></header><main class="reading"><p class="summary">'+esc(a['summary'])+'</p>'+body+'<h2>Questions, answered</h2>'+faq+'</main></html>'
        (DEST/'references'/(a['slug']+'.html')).write_text(page)
    book=['# Small-business website resource library\n\nBy Michael McKerracher. Private drafts prepared October 8, 2026. Planned release dates are editorial slots, not publication claims.\n']
    cards=[];manifest=[]
    for a in data:
        blocks=[f'# {a["title"]}',f'By Michael McKerracher · Draft prepared October 8, 2026 · Planned release {a["plannedPublishOn"]}',a['summary'],'\n'.join('- '+t for t in a['takeaways'])]
        blocks += ['## '+s['title']+'\n\n'+md(s['body']) for s in a['sections']]
        blocks += ['## Questions, answered']+['### '+q+'\n\n'+ans for q,ans in a['faqs']]
        blocks += ['## Sources and further reading\n\n'+'\n'.join('- ['+s['name']+']('+s['url']+')' for s in a['sources'])]
        manuscript='\n\n'.join(blocks)+'\n';(DEST/'markdown'/f'{a["slug"]}.md').write_text(manuscript);shutil.copy2(DATA/f'{a["slug"]}.json',DEST/'json'/f'{a["slug"]}.json');book.append(manuscript+'\n---\n')
        body=''.join('<section><h2>'+esc(s['title'])+'</h2>'+link_html(s['body'])+'</section>' for s in a['sections'])
        body=body.replace('<table>','<div class="table-wrap"><table>').replace('</table>','</table></div>')
        faqs=''.join('<h3>'+esc(q)+'</h3><p>'+esc(ans)+'</p>' for q,ans in a['faqs'])
        sources=''.join('<li><a href="'+esc(s['url'])+'">'+esc(s['name'])+'</a></li>' for s in a['sources'])
        review=a.get('editorialReview',{}).get('state','Awaiting editorial pass')
        detail='<details><summary>Editorial notes and release checks</summary><p>Research checked October 8, 2026. Recheck time-sensitive facts before publication.</p><p>'+esc(a['editorial'].get('distinctContribution',''))+'</p><ul>'+''.join('<li>'+esc(x)+'</li>' for x in a['editorial'].get('claimsToRecheckBeforeRelease',[]))+'</ul><p>Editorial pass: '+esc(review)+'. Public release remains scheduled separately.</p><p>Service destination: <a href="https://michaelmck.site'+esc(a['primaryMoneyPage'])+'">'+esc(a['primaryMoneyPage'])+'</a></p></details>'
        page=f'''<!doctype html><html lang="en-CA"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{esc(a['title'])} · Private draft</title><link rel="stylesheet" href="../reader.css"><div class="private">Private editorial draft · Not published</div><header><nav><a href="../index.html">All 60 articles</a><a href="../markdown/{a['slug']}.md">Editable Markdown</a></nav><p class="meta">{esc(a['pillar'])} · Planned {a['plannedPublishOn']} · {a['wordCount']:,} words</p><h1>{esc(a['title'])}</h1><p class="meta">Michael McKerracher</p></header><main class="reading"><p class="summary">{esc(a['summary'])}</p><div class="check"><ul>{''.join('<li>'+esc(t)+'</li>' for t in a['takeaways'])}</ul></div>{body}<section><h2>Questions, answered</h2>{faqs}</section><section class="sources"><h2>Sources and further reading</h2><ul>{sources}</ul></section>{detail}</main><footer><a href="../index.html">Back to the full draft library</a></footer></html>'''
        (DEST/'articles'/f'{a["slug"]}.html').write_text(page)
        search=' '.join([a['title'],a['pillar'],a['summary']]).lower()
        cards.append(f'<article class="card" data-pillar="{esc(a["pillar"])}" data-search="{esc(search)}"><p class="meta">{a["plannedPublishOn"]} · {a["wordCount"]:,} words</p><span class="pill">{esc(a["pillar"])}</span><h2><a href="articles/{a["slug"]}.html">{esc(a["title"])}</a></h2><p>{esc(a["summary"])}</p><a href="markdown/{a["slug"]}.md">Markdown</a></article>')
        manifest.append({k:a[k] for k in ['slug','title','pillar','plannedPublishOn','wordCount','primaryMoneyPage','status']})
    total=sum(a['wordCount'] for a in data);pillars=sorted({a['pillar'] for a in data})
    index=f'''<!doctype html><html lang="en-CA"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Small-business website draft library · Michael McKerracher</title><link rel="stylesheet" href="reader.css"><div class="private">Private editorial library · None of these drafts has been published</div><header><p>Michael McKerracher</p><h1>A year's worth of<br><em>better website decisions.</em></h1><p class="intro">Complete articles for small-business owners: what works for their industry, which platform fits, what good design does and how a website earns the next enquiry.</p><p class="meta">{len(data)} articles · {total:,} words · Three releases a week: Monday, Wednesday and Friday · Research prepared October 8, 2026</p><nav><a href="all-articles.md">Complete manuscript</a><a href="calendar.csv">Calendar spreadsheet</a><a href="STRATEGY.md">Editorial direction</a></nav></header><main><div class="controls"><label for="search" class="meta">Find an article</label><input id="search" type="search" placeholder="Plumbers, Framer, lawyers, design…"><label for="pillar" class="meta">Topic</label><select id="pillar"><option value="">All topics</option>{''.join('<option>'+esc(p)+'</option>' for p in pillars)}</select></div><p class="count" aria-live="polite">Showing {len(data)} articles</p><div class="list">{''.join(cards)}</div><p class="empty">No articles match. Try another topic.</p></main><footer>Planned dates can move. Drafts remain outside the public website, sitemap and AI discovery files.</footer><script>const search=document.querySelector('#search'),pillar=document.querySelector('#pillar'),cards=[...document.querySelectorAll('.card')];function filter(){{let n=0;for(const card of cards){{const show=(!pillar.value||card.dataset.pillar===pillar.value)&&card.dataset.search.includes(search.value.toLowerCase());card.hidden=!show;if(show)n++}}document.querySelector('.count').textContent=`Showing ${{n}} article${{n===1?'':'s'}}`;document.querySelector('.empty').style.display=n?'none':'block'}}search.addEventListener('input',filter);pillar.addEventListener('change',filter);</script></html>'''
    (DEST/'index.html').write_text(index);(DEST/'all-articles.md').write_text('\n\n'.join(book));(DEST/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    with (DEST/'calendar.csv').open('w',newline='') as f:
        wr=csv.DictWriter(f,fieldnames=['plannedPublishOn','title','pillar','primaryMoneyPage','wordCount','slug','status']);wr.writeheader();wr.writerows(manifest)
    (DOC/'draft-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'articles':len(data),'words':total,'reader':str(DEST/'index.html')}))
if __name__=='__main__':build()
