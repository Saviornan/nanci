const app=document.getElementById("app");
let currentPage, currentCategory=null, inDetailView=false;
let lang="en";

const GITHUB_REPO="Saviornan/nanci";
const BRANCH="main";

// 文本
const text={
  home:{cn:"欢迎来到楠茜的作品集", en:"Welcome to Nancy's Portfolio"},
  about:{cn:"关于我", en:"About"},
  creations:{cn:"个人创作", en:"Creations"},
  projects:{cn:"项目", en:"Projects"},
  category:{
    "2d":{cn:"二维",en:"2D"},
    "3d":{cn:"三维",en:"3D"},
    "ai":{cn:"AI生成",en:"AI"}
  }
};

/* Header 按钮 */
document.getElementById("btn-about").onclick=()=>{
  if(currentPage===showAbout) showHome();
  else showAbout();
};
document.getElementById("btn-lang").onclick=()=>{
  lang=lang==="en"?"cn":"en";
  document.getElementById("btn-lang").innerText=lang.toUpperCase();
  document.getElementById("btn-about").innerText=text.about[lang];
  if(currentPage) currentPage();
};

/* 打字机 */
function typeWriter(el,str,speed,cb){
  el.innerHTML="";
  let i=0;
  let t=setInterval(()=>{
    el.innerHTML+=str[i++];
    if(i>=str.length){clearInterval(t); cb&&cb();}
  },speed);
}

/* 返回按钮 */
function createBackButton(){
  const b=document.createElement("button");
  b.className="back-btn"; b.innerText="←";
  b.onclick=()=>{
    if(currentPage===showCreations){
      if(inDetailView){ showCreations(); inDetailView=false; }
      else showHome();
    } else if(currentPage===showProjects){
      if(inDetailView){ showProjects(); inDetailView=false; }
      else showHome();
    }
  };
  document.body.appendChild(b);
}

/* 爆炸效果 */
function expandFromButton(btn,cb){
  const rect=btn.getBoundingClientRect();
  const o=document.createElement("div");
  o.className="expand-overlay";
  o.style.left=rect.left+rect.width/2+"px";
  o.style.top=rect.top+rect.height/2+"px";
  document.body.appendChild(o);
  setTimeout(()=>o.classList.add("active"),10);
  setTimeout(()=>{ o.remove(); cb(); },500);
}

/* 模块动画 */
function animateItems(m){
  const items=m.querySelectorAll(".item");
  items.forEach((el,i)=>setTimeout(()=>{el.style.opacity="1"; el.style.transform="translateY(0)";}, i*60));
}
function createModule(){
  const d=document.createElement("div"); d.className="module";
  setTimeout(()=>d.classList.add("show"),10);
  return d;
}

/* Home */
function showHome(){
  currentPage=showHome; app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  const m=createModule();
  const h=document.createElement("h1");
  const box=document.createElement("div"); box.className="home-actions";

  const b1=document.createElement("button"); b1.innerText=text.creations[lang];
  b1.onclick=(e)=>expandFromButton(e.currentTarget,showCreations);
  const b2=document.createElement("button"); b2.innerText=text.projects[lang];
  b2.onclick=(e)=>expandFromButton(e.currentTarget,showProjects);

  box.appendChild(b1); box.appendChild(b2);
  m.appendChild(h); m.appendChild(box); app.appendChild(m);

  typeWriter(h,text.home[lang],60,()=>{ box.style.opacity="1"; });
}

/* About */
function showAbout(){
  currentPage=showAbout; app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  const m=createModule();
  const t=document.createElement("p");
  t.innerText=lang==="cn"
    ?"这里是楠茜的个人介绍，可以写你的经历、风格、联系方式。"
    :"This is Nancy's introduction. You can write your background, style and contact here.";
  m.appendChild(t); app.appendChild(m);
}

/* Creations */
function showCreations(){
  currentPage=showCreations; app.innerHTML=""; inDetailView=false;
  document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  const m=createModule(); const tabs=document.createElement("div"); tabs.className="tabs";
  ["2d","3d","ai"].forEach(cat=>{
    const b=document.createElement("button"); b.innerText=text.category[cat][lang];
    b.onclick=()=>openCategoryPage(cat);
    tabs.appendChild(b);
  });
  m.appendChild(tabs); app.appendChild(m);
}

/* Projects */
function showProjects(){
  currentPage=showProjects; app.innerHTML=""; inDetailView=false;
  document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  const m=createModule(); const tabs=document.createElement("div"); tabs.className="tabs";
  ["projectA"].forEach(p=>{
    const b=document.createElement("button"); b.innerText=p; b.onclick=()=>openProjectPage(p); tabs.appendChild(b);
  });
  m.appendChild(tabs); app.appendChild(m);
}

/* Category 页面 */
async function openCategoryPage(cat){
  currentCategory=cat; inDetailView=true;
  app.innerHTML=""; document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  const m=createModule(); const title=document.createElement("h1"); title.innerText=text.category[cat][lang];
  m.appendChild(title); app.appendChild(m);
  await renderAssetsFromGitHub(`assets/creations/${cat}`, m);
  animateItems(m);
}

/* Project 页面 */
async function openProjectPage(p){
  inDetailView=true;
  app.innerHTML=""; document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  const m=createModule(); const title=document.createElement("h1"); title.innerText=p;
  m.appendChild(title); app.appendChild(m);
  await renderAssetsFromGitHub(`assets/projects/${p}`, m);
  animateItems(m);
}

/* GitHub API 自动抓取资源 */
async function renderAssetsFromGitHub(folder,m){
  m.querySelectorAll(".item").forEach(i=>i.remove());
  const api=`https://api.github.com/repos/${GITHUB_REPO}/contents/${folder}?ref=${BRANCH}`;
  try{
    const res=await fetch(api);
    if(!res.ok) return;
    const data=await res.json();
    for(const f of data){
      if(f.type==="file" && /\.(png|jpe?g|gif|mp4)$/i.test(f.name)){
        let el;
        if(/\.mp4$/i.test(f.name)){
          el=document.createElement("video"); el.src=f.download_url; el.controls=true; el.muted=true; el.playsInline=true;
        } else {
          el=document.createElement("img"); el.src=f.download_url;
        }
        const d=document.createElement("div"); d.className="item"; d.appendChild(el); m.appendChild(d);
      }
    }
  }catch(e){console.error(e);}
}

/* Canvas 粒子背景 */
const canvas=document.getElementById("bg-canvas"); const ctx=canvas.getContext("2d");
let w=canvas.width=window.innerWidth, h=canvas.height=window.innerHeight;
window.onresize=()=>{ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; initParticles(); };
let particles=[];
function initParticles(){
  particles=[]; for(let i=0;i<400;i++){
    particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+0.5});
  }
}
function drawParticles(e){
  ctx.clearRect(0,0,w,h);
  for(const p of particles){
    let dx=0, dy=0, dist=0;
    if(e){
      dx=p.x-e.clientX; dy=p.y-e.clientY; dist=Math.sqrt(dx*dx+dy*dy);
    }
    let r=p.r; let alpha=0;
    if(dist<100){ alpha=(1-(dist/100))*0.8; r*=1+(1-(dist/100))*1.5; }
    ctx.fillStyle=`rgba(255,255,255,${alpha})`; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
  }
}
initParticles();
function animate(){
  drawParticles(mousePos); requestAnimationFrame(animate);
}
let mousePos=null;
window.addEventListener("mousemove",e=>{ mousePos=e; });
animate();

/* 打字机初始化 + 首页 */
window.onload=()=>{
  document.getElementById("btn-lang").innerText="EN";
  document.getElementById("btn-about").innerText=text.about[lang];
  showHome();
};
