let app = document.getElementById("app");
let currentPage = showHome;
let currentCategory = null;
let inDetailView = false;
let lang = "en";

/* 文本 */
let text = {
  home: { cn:"欢迎来到楠茜的作品集", en:"Welcome to Nancy's Portfolio" },
  about:{ cn:"关于我", en:"About" },
  creations:{ cn:"个人创作", en:"Creations" },
  projects:{ cn:"项目", en:"Projects" },
  category:{ "2d":{cn:"二维",en:"2D"}, "3d":{cn:"三维",en:"3D"}, "ai":{cn:"AI生成",en:"AI"} }
};

/* Header 按钮 */
document.getElementById("btn-about").onclick = () => {
  if(currentPage === showAbout) showHome();
  else showAbout();
};

document.getElementById("btn-lang").onclick = () => {
  lang = lang === "en" ? "cn" : "en";
  document.getElementById("btn-lang").innerText = lang.toUpperCase();
  document.getElementById("btn-about").innerText = text.about[lang];
  if(currentPage) currentPage();
};

/* 打字机 */
function typeWriter(el,text,speed,callback){
  el.innerHTML="";
  let i=0;
  let timer=setInterval(()=>{
    el.innerHTML+=text[i++];
    if(i>=text.length){ clearInterval(timer); if(callback) callback(); }
  },speed);
}

/* 返回按钮 */
function createBackButton(){
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  let b=document.createElement("button");
  b.className="back-btn";
  b.innerText="←";
  b.onclick = () => {
    if(currentPage===showCreations || currentPage===showProjects){
      if(inDetailView){ currentPage(); inDetailView=false; }
      else showHome();
    }
  };
  document.body.appendChild(b);
}

/* 按钮扩散动画 */
function expandFromButton(btn,callback){
  let rect=btn.getBoundingClientRect();
  let o=document.createElement("div");
  o.className="expand-overlay";
  o.style.left=rect.left+rect.width/2+"px";
  o.style.top=rect.top+rect.height/2+"px";
  document.body.appendChild(o);
  setTimeout(()=>o.classList.add("active"),10);
  setTimeout(()=>{ o.remove(); callback(); },500);
}

/* 动画 */
function animateItems(m){
  let items=m.querySelectorAll(".item");
  items.forEach((el,i)=>setTimeout(()=>{ el.style.opacity="1"; el.style.transform="translateY(0)"; },i*60));
}

/* 首页 */
function showHome(){
  currentPage = showHome;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  let m=createModule();
  let h=document.createElement("h1");
  let box=document.createElement("div"); box.className="home-actions";
  let b1=document.createElement("button"); b1.innerText=text.creations[lang]; b1.onclick=(e)=>expandFromButton(e.currentTarget,showCreations);
  let b2=document.createElement("button"); b2.innerText=text.projects[lang]; b2.onclick=(e)=>expandFromButton(e.currentTarget,showProjects);
  box.appendChild(b1); box.appendChild(b2);
  m.appendChild(h); m.appendChild(box); app.appendChild(m);
  typeWriter(h,text.home[lang],60,()=>{ box.style.opacity="1"; });
}

/* Creations */
function showCreations(){
  currentPage = showCreations;
  app.innerHTML="";
  inDetailView=false;
  createBackButton();
  let m=createModule();
  let tabs=document.createElement("div"); tabs.className="tabs";
  ["2d","3d","ai"].forEach(cat=>{
    let b=document.createElement("button"); b.innerText=text.category[cat][lang]; b.onclick=()=>openCategoryPage(cat);
    tabs.appendChild(b);
  });
  m.appendChild(tabs); app.appendChild(m);
}

/* 分类页 */
function openCategoryPage(cat){
  currentCategory=cat; inDetailView=true;
  app.innerHTML="";
  createBackButton();
  let m=createModule();
  let title=document.createElement("h1"); title.innerText=text.category[cat][lang];
  m.appendChild(title); app.appendChild(m);
  renderAssets(`assets/creations/${cat}`,m);
  animateItems(m);
}

/* About */
function showAbout(){
  currentPage = showAbout;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  let m=createModule();
  let t=document.createElement("p");
  t.innerText = lang==="cn" ? "这里是楠茜的个人介绍，可以写你的经历、风格、联系方式。" : "This is Nancy's introduction. You can write your background, style and contact here.";
  m.appendChild(t); app.appendChild(m);
}

/* Projects */
function showProjects(){
  currentPage = showProjects; app.innerHTML=""; inDetailView=false;
  createBackButton();
  let m=createModule();
  let tabs=document.createElement("div"); tabs.className="tabs";
  ["projectA"].forEach(p=>{
    let b=document.createElement("button"); b.innerText=p; b.onclick=()=>openProjectPage(p);
    tabs.appendChild(b);
  });
  m.appendChild(tabs); app.appendChild(m);
}

/* 项目详情 */
function openProjectPage(p){
  inDetailView=true; app.innerHTML="";
  createBackButton();
  let m=createModule();
  let title=document.createElement("h1"); title.innerText=p;
  m.appendChild(title); app.appendChild(m);
  renderAssets(`assets/projects/${p}`,m);
  animateItems(m);
}

/* 模块 */
function createModule(){
  let d=document.createElement("div");
  d.className="module";
  setTimeout(()=>d.classList.add("show"),10);
  return d;
}

/* 资源加载 & Lightbox */
function renderAssets(path,m){
  m.querySelectorAll(".item").forEach(i=>i.remove());
  let grid=document.createElement("div"); grid.className="grid"; m.appendChild(grid);
  for(let i=1;i<=50;i++){
    ["jpg","png","gif","mp4"].forEach(ext=>{
      let file=`${path}/${i}.${ext}`;
      let el = ext==="mp4"? document.createElement("video") : new Image();
      if(ext==="mp4"){ el.src=file; el.controls=false; el.muted=true; el.playsInline=true; }
      else el.src=file;
      el.onload = () => {
        let d=document.createElement("div"); d.className="item"; d.appendChild(el); grid.appendChild(d);
        d.onclick = () => openLightbox(el.cloneNode());
      };
      el.onerror=()=>el.remove();
    });
  }
}

/* Lightbox */
function openLightbox(media){
  let overlay=document.createElement("div"); overlay.className="lightbox-overlay";
  overlay.appendChild(media); document.body.appendChild(overlay);
  overlay.onclick=()=>overlay.remove();
}

/* 初始化 */
window.onload=()=>{
  document.getElementById("btn-lang").innerText="EN";
  document.getElementById("btn-about").innerText=text.about[lang];
  showHome();
};
