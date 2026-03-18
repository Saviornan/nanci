let app=document.getElementById("app");
let currentPage=showHome;
let currentCategory=null;
let inDetailView=false;
let lang="en";

/* Header按钮 */
document.getElementById("btn-about").onclick=()=>{
  if(currentPage===showAbout){ showHome(); }
  else{ showAbout(); }
};
document.getElementById("btn-lang").onclick=()=>{
  lang=(lang==="en")?"cn":"en";
  document.getElementById("btn-lang").innerText=lang.toUpperCase();
  document.getElementById("btn-about").innerText=(lang==="cn")?"关于我":"About";
  if(currentPage) currentPage();
};

/* 打字机效果 */
function typeWriter(el,text,speed,callback){
  el.innerHTML=""; let i=0;
  let timer=setInterval(()=>{
    el.innerHTML+=text[i]; i++;
    if(i>=text.length){ clearInterval(timer); if(callback) callback(); }
  },speed);
}

/* 返回按钮 */
function createBackButton(){
  let b=document.createElement("button");
  b.className="back-btn"; b.innerText="←";
  b.onclick=()=>{
    if(currentPage===showCreations){
      if(inDetailView){ showCreations(); inDetailView=false; } else{ showHome(); }
    }else if(currentPage===showProjects){
      if(inDetailView){ showProjects(); inDetailView=false; } else{ showHome(); }
    }
  };
  document.body.appendChild(b);
}

/* 爆炸动画 */
function expandFromButton(btn,callback){
  let rect=btn.getBoundingClientRect();
  let o=document.createElement("div"); o.className="expand-overlay";
  o.style.left=rect.left+rect.width/2+"px";
  o.style.top=rect.top+rect.height/2+"px";
  document.body.appendChild(o);
  setTimeout(()=>o.classList.add("active"),10);
  setTimeout(()=>{ o.remove(); callback(); },500);
}

/* 元素滑入动画 */
function animateItems(m){
  let items=m.querySelectorAll(".item");
  items.forEach((el,i)=>{ setTimeout(()=>{ el.style.opacity="1"; el.style.transform="translateY(0)"; }, i*60); });
}

/* 首页 */
function showHome(){
  currentPage=showHome; app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  let m=createModule(); let h=document.createElement("h1");
  let box=document.createElement("div"); box.className="home-actions";
  let b1=document.createElement("button"); b1.innerText=(lang==="cn")?"个人创作":"Creations"; b1.onclick=(e)=>expandFromButton(e.currentTarget,showCreations);
  let b2=document.createElement("button"); b2.innerText=(lang==="cn")?"项目":"Projects"; b2.onclick=(e)=>expandFromButton(e.currentTarget,showProjects);
  box.appendChild(b1); box.appendChild(b2);
  m.appendChild(h); m.appendChild(box); app.appendChild(m);
  typeWriter(h,(lang==="cn")?"欢迎来到楠茜的作品集":"Welcome to Nancy's Portfolio",60,()=>{box.style.opacity="1";});
}

/* Creations */
function showCreations(){
  currentPage=showCreations; app.innerHTML=""; inDetailView=false;
  document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  let m=createModule();
  let tabs=document.createElement("div"); tabs.className="tabs";
  ["2d","3d","ai"].forEach(cat=>{
    let b=document.createElement("button"); b.innerText=(lang==="cn")?cat:cat;
    b.onclick=()=>openCategoryPage(cat); tabs.appendChild(b);
  });
  m.appendChild(tabs); app.appendChild(m);
}

/* Creations 子分类页 */
function openCategoryPage(cat){
  currentCategory=cat; inDetailView=true; app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  let m=createModule();
  let title=document.createElement("h1"); title.innerText=(lang==="cn")?cat:cat; m.appendChild(title); app.appendChild(m);
  loadFolderAssets(`assets/creations/${cat}`, m);
  animateItems(m);
}

/* About */
function showAbout(){
  currentPage=showAbout; app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  let m=createModule(); let t=document.createElement("p");
  t.innerText=(lang==="cn")?"这里是楠茜的个人介绍，可以写你的经历、风格、联系方式。":"This is Nancy's introduction. You can write your background, style and contact here.";
  m.appendChild(t); app.appendChild(m);
}

/* Projects */
function showProjects(){
  currentPage=showProjects; app.innerHTML=""; inDetailView=false;
  document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  let m=createModule(); let tabs=document.createElement("div"); tabs.className="tabs";
  ["projectA"].forEach(p=>{
    let b=document.createElement("button"); b.innerText=p; b.onclick=()=>openProjectPage(p); tabs.appendChild(b);
  });
  m.appendChild(tabs); app.appendChild(m);
}

/* Projects 详情页 */
function openProjectPage(p){
  inDetailView=true; app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove()); createBackButton();
  let m=createModule(); let title=document.createElement("h1"); title.innerText=p; m.appendChild(title); app.appendChild(m);
  loadFolderAssets(`assets/projects/${p}`, m);
  animateItems(m);
}

/* 模块 */
function createModule(){
  let d=document.createElement("div"); d.className="module"; setTimeout(()=>d.classList.add("show"),10); return d;
}

/* 自动读取文件夹资源 */
function loadFolderAssets(folderPath, container){
  for(let i=1;i<=20;i++){
    ["jpg","png","gif","mp4"].forEach(ext=>{
      let el; let file=`${folderPath}/${i}.${ext}`;
      if(ext==="mp4"){ el=document.createElement("video"); el.src=file; el.controls=true; el.muted=true; el.playsInline=true; el.onloadeddata=()=>addItem(container,el);}
      else{ el=new Image(); el.src=file; imgLoad(el,container);}
    });
  }
}
function imgLoad(img,container){ img.onload=()=>addItem(container,img); }
function addItem(container,el){ let d=document.createElement("div"); d.className="item"; d.appendChild(el); container.appendChild(d); }

/* 鼠标光圈互动 */
document.addEventListener("mousemove",e=>{ document.body.style.setProperty("--x",e.clientX+"px"); document.body.style.setProperty("--y",e.clientY+"px"); });

/* 初始化 */
window.onload=()=>{
  document.getElementById("btn-lang").innerText="EN";
  document.getElementById("btn-about").innerText="About";
  showHome();
};
