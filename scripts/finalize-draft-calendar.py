"""Point the editable release calendar at complete private manuscripts."""
from pathlib import Path
import json,re,shutil
ROOT=Path(__file__).resolve().parents[1];DOC=ROOT/'docs/draft-library-2026-10-08';DATA=ROOT/'content/resources/draft-library'
briefs=json.loads((DOC/'briefs.json').read_text());assert len(briefs)==60
quality=json.loads((DOC/'quality-check.json').read_text());assert quality['mode']=='complete' and quality['gate']=='PASS' and quality['articles']==60
calendars={2026:[],2027:[]}
for b in briefs:
    a=json.loads((DATA/(b['slug']+'.json')).read_text());body=' '.join(s['body'] for s in a['sections'])
    work=[x for x in ['ABC Appliance','Cool Runnings','Okanagan Treehouse','RCCV','St James','Upon This Rock','Vertical Impression','AI Catalyst'] if x in body]
    row={'id':b['id'],'slug':a['slug'],'publishOn':a['plannedPublishOn'],'timezone':'America/Vancouver','status':'drafted','title':a['title'],'format':a['type'],'city':b.get('city','Okanagan'),'pillar':a['pillar'],'primaryQuery':b['primaryQuery'],'queryVariants':[b['primaryQuery']]+[x[0] for x in a['faqs'][:2]],'buyerDecision':a['editorial']['distinctContribution'],'primaryMoneyPage':a['primaryMoneyPage'],'parentMoneyPage':'/web-design/' if a['primaryMoneyPage'].startswith('/web-design/') else a['primaryMoneyPage'],'proof':', '.join(work) if work else 'Practical recommendations and linked primary documentation; no invented client result.','draftPath':'content/resources/draft-library/'+a['slug']+'.json','wordCount':a['wordCount'],'researchAsOf':a['researchAsOf'],'researchStatus':'Full draft and source research saved. Refresh time-sensitive facts near release.','researchChecklist':['Read the existing full draft and saved topic-specific query, competitor coverage and primary sources.','Refresh current platform, provider, professional-rule and link facts before publication.','Retain distinct owner advice, accurate proof and relevant internal links; do not regenerate from scratch.'],'outline':[s['title'] for s in a['sections']],'faqs':[q[0] for q in a['faqs']],'internalLinks':{'primary':{'href':a['primaryMoneyPage'],'placement':'Contextual service link'},'secondary':{'href':'/contact/','placement':'Closing contact invitation'},'siblings':list(dict.fromkeys(re.findall(r'href="(/blog/[^\"]+)"',body)))},'aeo':{'summary':a['summary'],'faqCount':3,'schema':'Article and BreadcrumbList; FAQ only for matching visible answers, without a promised rich result'},'releaseGate':['current sources and links rechecked','draft edits reviewed','public preview checked on mobile and desktop','publication date reached'],'publicationApproved':False}
    calendars[int(a['plannedPublishOn'][:4])].append(row)
for year,rows in calendars.items():
    assert len(rows)==(8 if year==2026 else 52)
    (ROOT/f'content/resources/editorial-calendar-{year}.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print('Calendar points to 60 complete drafts; approved public queue unchanged.')
