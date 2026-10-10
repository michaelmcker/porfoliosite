"""Validate private manuscripts, source links and separation from the release queue."""
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict
import argparse, json, re, html

ROOT=Path(__file__).resolve().parents[1]
DOC=ROOT/'docs/draft-library-2026-10-08'
DATA=ROOT/'content/resources/draft-library'
BRIEFS=json.loads((DOC/'briefs.json').read_text())
class Content(HTMLParser):
    allowed={'p','h3','ul','ol','li','strong','em','a','table','caption','thead','tbody','tr','th','td','blockquote','br'}
    def __init__(self):super().__init__();self.errors=[];self.links=[];self.tags=[];self.stack=[]
    def handle_starttag(self,tag,attrs):
        self.tags.append(tag)
        if tag!='br':self.stack.append(tag)
        if tag not in self.allowed:self.errors.append('Unexpected HTML tag: '+tag)
        for k,v in attrs:
            if k.startswith('on') or k in ['style','src']:self.errors.append('Unexpected active attribute: '+k)
            if k=='href':self.links.append(v)
        if tag=='a' and not dict(attrs).get('href'):self.errors.append('Link without destination')
    def handle_endtag(self,tag):
        if not self.stack or self.stack[-1]!=tag:self.errors.append('Unbalanced tag: '+tag)
        else:self.stack.pop()
HARD=r'(?i)\b(?:delve|delving|delved|tapestry|myriad|plethora|embark|endeavor|realm of|dive into|in conclusion|in essence|in today.s world|in today.s digital age|it.s worth noting|it is worth noting)\b|—'
SOFT=r'(?i)\b(?:robust|seamless|streamline|optimize|enhance|elevate|transform|unlock|unleash|empower|fundamentally|cutting-edge|game-changing|revolutionary|synergy|paradigm|ecosystem|testament|landscape)\b'
LEAK=r'(?i)source packet|factual boundaries|approved proof|brief says|I don.t just want to swap out|as an AI|TODO|TBD|lorem ipsum'
def plain(a):return html.unescape(re.sub('<[^>]+>',' ',' '.join([a['title'],a['description'],a['summary'],*a['takeaways']]+[s['title']+' '+s['body'] for s in a['sections']]+[' '.join(x) for x in a['faqs']])))

def check(partial=False):
    errs=[];warnings=[];articles=[];paragraphs=defaultdict(list)
    known={b['slug'] for b in BRIEFS}
    public=json.loads((ROOT/'content/resources/publishing.json').read_text())['articles']
    public_slugs={p.stem for p in (ROOT/'content/resources/articles').glob('*.json')}|set(public)
    source_urls=set()
    for p in (DOC/'research').glob('primary-*.json'):
        a=json.loads(p.read_text())
        if a.get('markdown'):source_urls.add(a['url'])
    for b in BRIEFS:
        p=DATA/(b['slug']+'.json')
        if not p.exists():
            if not partial:errs.append({'slug':b['slug'],'issues':['Missing full article']})
            continue
        a=json.loads(p.read_text());issues=[];warn=[];text=plain(a)
        if a['title']!=b['title'] or a['slug']!=b['slug']:issues.append('Title/slug differs from brief')
        if a['plannedPublishOn']!=b['publishOn']:issues.append('Calendar date differs')
        if a['status']!='draft' or a.get('datePublished'):issues.append('Private draft has public status/date')
        if a['slug'] in public or a['slug'] in public_slugs:issues.append('Draft is in public article source/queue')
        if not 6<=len(a['sections'])<=10:issues.append('Incomplete section structure')
        if len(a['faqs'])!=5 or not 3<=len(a['takeaways'])<=4:issues.append('Expected five specific FAQs and 3-4 useful takeaways')
        if a['wordCount']<950:issues.append('Incomplete manuscript length')
        ids=[s['id'] for s in a['sections']]
        if len(ids)!=len(set(ids)):issues.append('Duplicate section IDs')
        if re.search(HARD,text):issues.append('Hard language match: '+', '.join(set(re.findall(HARD,text))))
        if re.search(LEAK,text):issues.append('Prompt or placeholder language: '+re.search(LEAK,text).group())
        for m in re.finditer(SOFT,text):warn.append(text[max(0,m.start()-70):m.end()+95])
        if '–' in text:warn.append('Check prose en dash')
        parsed=Content()
        for s in a['sections']:
            parsed.feed(s['body'])
            for paragraph in re.findall('<p>(.*?)</p>',s['body'],re.S):
                normalized=re.sub(r'\s+',' ',re.sub('<[^>]+>','',paragraph)).strip()
                if len(normalized.split())>=22:paragraphs[normalized].append(a['slug'])
        issues.extend(parsed.errors)
        if parsed.stack:issues.append('Unclosed HTML: '+str(parsed.stack))
        if 'table' not in parsed.tags:issues.append('Missing comparison/worksheet table')
        for tag in ['caption','thead','tbody','th']:
            if tag not in parsed.tags:warn.append('Table missing '+tag)
        if b['primaryMoneyPage'] not in parsed.links:issues.append('Missing primary service link')
        if parsed.links.count('/contact/')!=1:issues.append('Expected one contact invitation')
        for link in set(parsed.links):
            if link.startswith('/'):
                route=link.split('#')[0]
                slug=route.strip('/').split('/')[-1]
                local=(ROOT/route.lstrip('/')) if route.startswith('/v2/') else ROOT/'v2'/route.lstrip('/')
                if not (local.is_file() or (local/'index.html').exists() or (route.startswith('/blog/') and slug in known|public_slugs)):
                    issues.append('Unknown internal link: '+link)
            elif link not in source_urls:issues.append('External link lacks retrieved source: '+link)
        for s in a['sources']:
            if s['url'] not in source_urls:issues.append('Source lacks retrieved text: '+s['url'])
        review=a.get('editorialReview',{})
        if review.get('state')!='pass-for-draft-review':
            if not partial or review:issues.append('Editorial pass incomplete: '+review.get('state','pending'))
        if review.get('publicationApproved'):issues.append('Draft marked approved for publication')
        if issues:errs.append({'slug':a['slug'],'issues':issues})
        if warn:warnings.append({'slug':a['slug'],'contexts':warn})
        articles.append({'slug':a['slug'],'words':a['wordCount'],'sections':len(a['sections']),'links':len(parsed.links),'editorial':review.get('state','pending')})
    repeats=[{'paragraph':p,'articles':v} for p,v in paragraphs.items() if len(set(v))>1]
    result={'mode':'partial' if partial else 'complete','gate':'FAIL' if errs else 'PASS','articles':len(articles),'words':sum(x['words'] for x in articles),'errors':errs,'languageContextsForReview':warnings,'repeatedParagraphs':repeats,'checks':articles}
    (DOC/'quality-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k not in ['checks','languageContextsForReview','repeatedParagraphs']},ensure_ascii=False,indent=2))
    print('Language contexts:',len(warnings),'Repeated paragraphs:',len(repeats))
    return not errs
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--partial',action='store_true');args=parser.parse_args()
    raise SystemExit(0 if check(args.partial) else 1)
