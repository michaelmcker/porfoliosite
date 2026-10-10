import {trades} from './industry-content-trades.mjs';
import {professional} from './industry-content-professional.mjs';
import {places} from './industry-content-places.mjs';

const industries={...trades,...professional,...places};

// A resource has one primary commercial destination; supporting links are secondary.
export function resourceService(article){
 const href=article.primaryMoneyPage||'/web-design/';
 if(href==='/ai-implementation/')return {
  href,label:'AI implementation and custom workflows',website:false,
  heading:'Put the workflow into practice.',
  copy:'I build custom workflows, reusable AI skills and agents around the work your team actually does, with tool implementation, training and ongoing maintenance scoped to the business.'
 };
 if(href==='/marketing-branding/')return {
  href,label:'marketing and branding services',website:false,
  heading:'Give the work a clear direction.',
  copy:'I bring positioning, brand development, websites, social content and video together around the customers you want to reach and the action you want them to take.'
 };
 if(href==='/web-design/')return {
  href,label:'web design and development in Kelowna and the Okanagan',website:true,
  heading:'Build a website around the business.',
  copy:'I can turn the page plan, content and customer journey into a considered website, including mobile design, search foundations and a working enquiry route.'
 };
 const slug=href.match(/^\/web-design\/([^/]+)\/$/)?.[1];
 if(!industries[slug])throw new Error(`Unknown resource money page: ${href}`);
 const industry=industries[slug];
 return {
  href,label:`website design for ${industry.label.toLowerCase()}`,website:true,
  heading:industry.focus,
  copy:industry.decisionIntro
 };
}
