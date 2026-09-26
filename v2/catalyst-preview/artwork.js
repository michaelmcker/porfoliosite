// Original AI Catalyst shader, retained as a still composition for portfolio display.
(()=>{const $=s=>document.querySelector(s);const paused=true;const coarse={matches:false};
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const renders=[];let queued=false;
function wake(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renders.forEach(draw=>draw(0,0,true))})}
function addAnimation(el,draw){renders.push(draw);new ResizeObserver(wake).observe(el);wake()}
const vertex='attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const fragment=`precision highp float;
varying vec2 uv;
uniform sampler2D tex; uniform sampler2D trail;
uniform vec2 res; uniform vec2 imgSize;
uniform float clock; uniform float coverX; uniform float baseBlend; uniform float motion;
float order2(vec2 v){vec2 a=mod(floor(v),2.);return 2.*a.x+3.*a.y-4.*a.x*a.y;}
float order4(vec2 v){return (4.*order2(v)+order2(v/2.)+.5)/16.;}
float order8(vec2 v){return (16.*order2(v)+4.*order2(v/2.)+order2(v/4.)+.5)/64.;}
void main(){
 vec2 v=vec2(uv.x,1.-uv.y);
 float scale=max(res.x/imgSize.x,res.y/imgSize.y);
 vec2 drawSize=imgSize*scale;
 vec2 crop=(drawSize-res)*vec2(coverX,.5);
 vec2 sampleUV=(v*res+crop)/drawSize;
 vec3 base=texture2D(tex,sampleUV).rgb;
 float field=texture2D(trail,v).r*motion;
 // Coarse source sampling appears within the wake, with a stable image underneath.
 float cell=1.+step(.68,field);
 vec2 stepped=(floor(v*res/cell)+.5)*cell;
 vec3 sampled=texture2D(tex,(stepped+crop)/drawSize).rgb;
 float lum=dot(sampled,vec3(.299,.587,.114));
 float light=clamp((lum-.10)/.85,0.,1.);
 // Quiet tonal weather continues without a pointer. No coordinate displacement.
 float slow=clock*.32;
 float ambient=(sin(v.x*6.+v.y*2.+slow)+.5*sin(v.y*8.-v.x*3.-slow*.7))*.095*motion;
 float local=floor(field*5.)/5.;
 float threshold=mix(order4(v*res),order8(v*res),step(.4,local)*.35);
 // The small cursor disturbance interrupts the ambient threshold field.
 float bias=ambient*(1.-local*.7)+local*.038;
 vec3 paper=vec3(.9294118,.9686275,1.);
 vec3 navy=vec3(.035,.16,.49);
 vec3 ink=mix(navy,paper,step(threshold+bias,light));
 float imageMask=1.-smoothstep(.90,.975,dot(base,vec3(.299,.587,.114)));
 vec3 col=mix(base,ink,clamp(baseBlend*imageMask+local*.23,0.,1.));
 // Make the untouched image paper continuous with the page background.
 float whiteArea=smoothstep(.85,.985,lum)*(1.-field);
 float paleDot=1.-step(order4(v*res),.82+ambient*.8);
 vec3 livingPaper=mix(paper,vec3(.65,.78,.94),paleDot*.24);
 col=mix(col,livingPaper,whiteArea);
 gl_FragColor=vec4(col,1.);
}`;
function setupArt(el){
 const canvas=el.querySelector('canvas'),img=el.querySelector('img');
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
 try{
  const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Artwork shader link failed');gl.useProgram(program);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
  const u={};['res','imgSize','clock','coverX','baseBlend','motion','tex','trail'].forEach(n=>u[n]=gl.getUniformLocation(program,n));
  const makeTexture=unit=>{gl.activeTexture(unit);const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);return texture};
  const sourceTexture=makeTexture(gl.TEXTURE0),trailTexture=makeTexture(gl.TEXTURE1);
  const field=document.createElement('canvas');field.width=256;field.height=160;const ctx=field.getContext('2d',{alpha:false});ctx.fillStyle='#000';ctx.fillRect(0,0,256,160);
  gl.uniform1i(u.tex,0);gl.uniform1i(u.trail,1);
  let ready=false,previous=null,pending=[],lastScroll=scrollY,fieldTick=-1;
  const area=el.classList.contains('hero-art')?el.parentElement:el;
  area.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused)return;const r=canvas.getBoundingClientRect();const next={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height};if(previous){const distance=Math.hypot((next.x-previous.x)*r.width,(next.y-previous.y)*r.height);if(distance>.3){pending.push({from:previous,to:next,speed:Math.min(distance/60,1)});if(pending.length>24)pending.shift()}}previous=next;wake()});
  area.addEventListener('pointerleave',()=>previous=null);
  function upload(){if(!img.naturalWidth)return;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sourceTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);ready=true;el.classList.add('ready');wake()}
  if(img.complete)upload();else img.addEventListener('load',upload,{once:true});
  canvas.addEventListener('webglcontextlost',()=>{ready=false;el.classList.remove('ready')});
  function stamp(x,y,radius){const gx=x*256,gy=y*160;const g=ctx.createRadialGradient(gx,gy,0,gx,gy,radius);g.addColorStop(0,'rgba(255,255,255,.70)');g.addColorStop(.35,'rgba(255,255,255,.50)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(gx-radius,gy-radius,radius*2,radius*2)}
  addAnimation(el,(t,dt,staticMode)=>{
   if(!ready)return;const r=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
   const stepTick=Math.floor(t*18);const updateField=staticMode||stepTick!==fieldTick;fieldTick=stepTick;
   if(updateField){ctx.globalCompositeOperation='source-over';ctx.fillStyle=`rgba(0,0,0,${staticMode?1:1-Math.exp(-5.8/18)})`;ctx.fillRect(0,0,256,160);
   if(coarse.matches&&Math.abs(scrollY-lastScroll)>1&&!staticMode){const y=clamp((innerHeight*.6-r.top)/r.height);stamp(.60,y,9)}lastScroll=scrollY;
   if(!staticMode){ctx.globalCompositeOperation='lighten';for(const p of pending){const steps=Math.max(1,Math.ceil(Math.hypot((p.to.x-p.from.x)*256,(p.to.y-p.from.y)*160)/5));for(let i=0;i<=steps;i++){const a=i/steps;stamp(p.from.x+(p.to.x-p.from.x)*a,p.from.y+(p.to.y-p.from.y)*a,8+p.speed*3)}}}pending=[];}
   gl.useProgram(program);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,trailTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,field);
   gl.uniform2f(u.res,w,h);gl.uniform2f(u.imgSize,img.naturalWidth,img.naturalHeight);gl.uniform1f(u.clock,t);gl.uniform1f(u.motion,staticMode?0:1);
   gl.uniform1f(u.coverX,el.dataset.art==='hero'?(innerWidth<=700?.65:.85):.5);gl.uniform1f(u.baseBlend,el.dataset.art==='hero'?.72:.20);gl.drawArrays(gl.TRIANGLES,0,6);
  },0,{continuous:el.dataset.art==='hero'});
 }catch(error){el.classList.remove('ready');console.warn('Artwork uses static fallback:',error.message)}
}
function setupPaperAtmosphere(){
 const scene=$('.hero-scene'),header=$('.masthead');
 const fitMasthead=()=>scene.style.setProperty('--masthead-height',`${parseFloat(getComputedStyle($('#main')).paddingTop)}px`);
 new ResizeObserver(fitMasthead).observe(header);fitMasthead();
 const canvas=$('.paper-atmosphere'),gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
 // Moving contour regions are printed as changing dot densities on pale paper.
 const frag=`precision highp float;
 varying vec2 uv;uniform vec2 size;uniform float time;uniform vec3 pointer;
 float b2(vec2 p){vec2 a=mod(floor(p),2.);return 2.*a.x+3.*a.y-4.*a.x*a.y;}
 void main(){
  vec2 p=gl_FragCoord.xy;
  float threshold=(16.*b2(p)+4.*b2(p/2.)+b2(p/4.)+.5)/64.;
  vec2 q=vec2(uv.x,1.-uv.y);
  float t=time*.19;
  vec2 world=vec2(p.x,size.y-p.y)/1100.;
  float bend=.22*sin(world.x*4.8+t*.7)+.10*sin(world.x*9.-t*.5);
  float field=.50+.26*sin((world.y+bend)*9.2+t)+.17*sin(world.x*5.4-world.y*3.2-t*.65);
  vec2 delta=(q-pointer.xy)*vec2(size.x/size.y,1.);
  field+=exp(-dot(delta,delta)/.006)*pointer.z*.11;
  // Dither the whole colour region, not just its boundary. Paper remains
  // visible between fixed pixels while slow contours change their density.
  float level=clamp(field,0.,.999)*3.;
  float base=floor(level),fraction=fract(level);
  float band=(base+smoothstep(.38,.62,fraction))/3.;
  float density=.025+band*.275;
  float dotInk=step(threshold,density);
  vec3 paper=vec3(.9294,.9686,1.);
  vec3 ink=vec3(.58,.74,.94);
  vec3 tone=mix(paper,ink,dotInk);
  float fade=smoothstep(0.,.14,uv.y);
  gl_FragColor=vec4(mix(paper,tone,fade),1.);
 }`;
 try{
  const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
  const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Paper shader failed');gl.useProgram(program);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const time=gl.getUniformLocation(program,'time'),size=gl.getUniformLocation(program,'size'),pointer=gl.getUniformLocation(program,'pointer');
  let cursor={x:-1,y:-1,strength:0};
  const disturb=e=>{if(paused||e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();cursor={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height,strength:1};wake()};
  scene.addEventListener('pointermove',disturb);header.addEventListener('pointermove',disturb);
  addAnimation(canvas,(t,dt,staticMode)=>{
   const r=canvas.getBoundingClientRect(),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
   cursor.strength=staticMode?0:cursor.strength*Math.exp(-dt*3.2);
   gl.useProgram(program);gl.uniform1f(time,t);gl.uniform2f(size,w,h);gl.uniform3f(pointer,cursor.x,cursor.y,cursor.strength);gl.drawArrays(gl.TRIANGLES,0,6);
  },0,{continuous:true});
 }catch(e){console.warn('Paper texture uses static background:',e.message)}
}

setupPaperAtmosphere();document.querySelectorAll('.interactive-art').forEach(setupArt);wake();})();
