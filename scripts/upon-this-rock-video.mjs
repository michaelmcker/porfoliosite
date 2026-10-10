// Michael's explicitly selected Drive export. Preserve the original media bytes.
export const uponThisRockVideo = {
  src:'/assets/selected-work/upon-this-rock/trailer-approved.mp4',
  poster:'/assets/selected-work/upon-this-rock/trailer-approved-poster.jpg',
  width:576,
  height:720,
  duration:'PT68.607S',
  sha256:'c8bdfabceb0c1a12881dd2f2feeab7c319e691f382a15edd8aa6d824474522c9',
  source:'https://drive.google.com/file/d/1uodC0rF_PZ1mxnIcNmHSvhph8kepMB6b/view'
};
export const uponThisRockPlayer = () => `<video controls playsinline preload="none" width="${uponThisRockVideo.width}" height="${uponThisRockVideo.height}" poster="${uponThisRockVideo.poster}" aria-label="Upon This Rock trailer"><source src="${uponThisRockVideo.src}" type="video/mp4"></video>`;
export const uponThisRockVideoSchema = () => ({
  '@type':'VideoObject',
  '@id':'https://michaelmck.site/work/upon-this-rock/#trailer-video',
  name:'Upon This Rock trailer',
  description:'A narrated trailer for Upon This Rock, bringing together motion design, imagery, music and the podcast’s identity.',
  thumbnailUrl:'https://michaelmck.site'+uponThisRockVideo.poster,
  contentUrl:'https://michaelmck.site'+uponThisRockVideo.src,
  uploadDate:'2026-10-10',
  duration:uponThisRockVideo.duration,
  creator:{'@id':'https://michaelmck.site/#person'}
});
