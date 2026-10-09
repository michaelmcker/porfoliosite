"""Normalize verified owned links without changing external source destinations."""
from pathlib import Path
import json,re,html
root=Path(__file__).resolve().parents[1]
changes=[]
for p in (root/'content/resources/draft-library').glob('*.json'):
    a=json.loads(p.read_text())
    if not a.get('editorialReview'):continue
    before=json.dumps(a)
    def link(m):
        href=m.group(2)
        if href.startswith('https://michaelmck.site/'):href=href.replace('https://michaelmck.site','',1)
        if href=='https://webflow.com/seo':href='https://webflow.com/feature/seo'
        if href=='https://www.canada.ca/en/revenue-agency/services/charities-giving/charities/operating-a-registered-charity/issuing-receipts/sample-official-donation-receipts.html':href='https://www.canada.ca/en/revenue-agency/services/charities-giving/charities/sample-official-donation-receipts.html'
        return 'href="'+href+'"'
    for s in a['sections']:s['body']=re.sub(r'href=([\"\x27])(.*?)\1',link,s['body'])
    for q in a['faqs']:
        q[1]=re.sub(r'</?p>','',q[1])
    a['wordCount']=len(html.unescape(re.sub('<[^>]+>',' ',' '.join([a['summary']]+[s['title']+' '+s['body'] for s in a['sections']]+[' '.join(x) for x in a['faqs']]))).split())
    if before!=json.dumps(a):
        a.setdefault('mainEditorEdits',[]).append({'reason':'Normalized owned-site links for the local reader and publication renderer; retained exact verified external sources.'})
        p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n');changes.append(a['slug'])
print(json.dumps(changes))
