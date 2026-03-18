// ==== 全局 ====
let app=document.getElementById("app");
let canvas=document.getElementById("bg-canvas");
let ctx=canvas.getContext("2d");

let currentPage, currentCategory=null, inDetailView=false, lang="en";
let particles=[];

// ==== 粒子设置 ====
const particleCount=300;
const maxRadius=3;
function initParticles(){
  particles=[];
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  for(let i=0;i<particleCount;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      baseRadius:Math.random()*maxRadius,
      radius:0
    });
  }
}
window.addEventListener("resize",initParticles);
initParticles();

// ==== 粒子渲染 ====
function drawParticles(mouse){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    let dx=p.x-mouse.x;
    let dy=p.y-mouse.y;
    let dist=Math.sqrt(dx*dx+dy*dy);
    let influence=Math.max(0,1-dist/150); // 150像素半径
    p.radius=p.baseRadius*influence;
    if(p.radius>0){
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${0.6*influence})`;
      ctx.fill();
    }
  });
}

// 鼠标跟随
let mouse={x:-1000,y:-1000};
window.addEventListener("mousemove",e=>{
  mouse.x=e.clientX;
  mouse.y=e.clientY;
});
function loop(){
  drawParticles(mouse);
  requestAnimationFrame(loop);
}
loop();

// ==== JSON ====
let content;
fetch('content.json')
  .then(r=>r.json())
  .then(j=>{
    content=j;
    document.getElementById("btn-lang").innerText=content.header.lang[lang].toUpperCase();
    document.getElementById("btn-about").innerText=content.header.about ? content.header.about[lang] : 'About';
    showHome();
  });

// ==== 打字机 ====
function typeWriter(el,text,speed,callback){
  el.innerHTML="";
  let i=0;
  let timer=setInterval(()=>{
    el.innerHTML+=text[i++];
    if(i>=text.length){clearInterval(timer);if(callback)callback();}
  },speed);
}

// ==== 返回按钮 ====
function createBackButton(){
  let b=document.createElement("button");
  b.className="back-btn";
  b.innerText="←";
  b.onclick=()=>{
    if(currentPage===showCreations && inDetailView){showCreations();inDetailView=false;}
    else if(currentPage===showProjects && inDetailView){showProjects();inDetailView=false;}
    else showHome();
  };
  document.body.appendChild(b);
}

// ==== 爆炸动画 ====
function expandFromButton(btn,callback){
  let rect=btn.getBoundingClientRect();
  let o=document.createElement("div");
  o.className="expand-overlay";
  o.style.left=rect.left+rect.width/2+"px";
  o.style.top=rect.top+rect.height/2+"px";
  document.body.appendChild(o);
  setTimeout(()=>o.classList.add("active"),10);
  setTimeout(()=>{o.remove();callback();},500);
}

// ==== 动画 ====
function animateItems(m){
  let items=m.querySelectorAll(".item");
  items.forEach((el,i)=>{
    setTimeout(()=>{el.style.opacity="1";el.style.transform="translateY(0)";},i*60);
  });
}

// ==== 模块 ====
function createModule(){
  let d=document.createElement("div");
  d.className="module";
  setTimeout(()=>d.classList.add("show"),10);
  return d;
}

// ==== 首页 ====
function showHome(){
  currentPage=showHome;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());

  let m=createModule();
  let h=document.createElement("h1");

  let box=document.createElement("div");
  box.className="home-actions";

  let b1=document.createElement("button");
  b1.innerText=content.header.creations[lang];
  b1.onclick=(e)=>expandFromButton(e.currentTarget,showCreations);

  let b2=document.createElement("button");
  b2.innerText=content.header.projects[lang];
  b2.onclick=(e)=>expandFromButton(e.currentTarget,showProjects);

  box.appendChild(b1);
  box.appendChild(b2);
  m.appendChild(h);
  m.appendChild(box);
  app.appendChild(m);

  typeWriter(h,lang==="cn"?"欢迎来到楠茜的作品集":"Welcome to Nancy's Portfolio",60,()=>{
    box.style.opacity="1";
  });
}

// ==== About ====
document.getElementById("btn-about").onclick=()=>{
  if(currentPage===showAbout) showHome();
  else showAbout();
};
function showAbout(){
  currentPage=showAbout;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());

  let m=createModule();
  let p=document.createElement("p");
  p.innerText=lang==="cn"
    ?"这里是楠茜的个人介绍，可以写你的经历、风格、联系方式。"
    :"This is Nancy's introduction. You can write your background, style and contact here.";
  m.appendChild(p);
  app.appendChild(m);
}

// ==== Creations ====
function showCreations(){
  currentPage=showCreations;
  inDetailView=false;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  createBackButton();

  let m=createModule();
  let tabs=document.createElement("div"); tabs.className="tabs";

  content.creations.forEach((c,idx)=>{
    let b=document.createElement("button");
    b.innerText=c.title[lang];
    b.onclick=()=>openCategoryPage(c.folder);
    tabs.appendChild(b);
  });

  m.appendChild(tabs); app.appendChild(m);
}

function openCategoryPage(folder){
  inDetailView=true;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  createBackButton();

  let m=createModule();
  renderAssets(folder,m);
  app.appendChild(m);
  animateItems(m);
}

// ==== Projects ====
function showProjects(){
  currentPage=showProjects;
  inDetailView=false;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  createBackButton();

  let m=createModule();
  let tabs=document.createElement("div"); tabs.className="tabs";

  content.projects.forEach(p=>{
    let b=document.createElement("button");
    b.innerText=p.title[lang];
    b.onclick=()=>openCategoryPage(p.folder);
    tabs.appendChild(b);
  });

  m.appendChild(tabs); app.appendChild(m);
}

// ==== 资源加载 ====
function renderAssets(path,m){
  m.querySelectorAll(".item").forEach(i=>i.remove());
  fetch(path).then(_=>{}); // 占位，文件夹直接引用 URL 即可
  for(let i=1;i<=20;i++){
    ["jpg","png","gif","mp4"].forEach(ext=>{
      let url=`${path}/${i}.${ext}`;
      let el;
      if(ext==="mp4"){
        el=document.createElement("video");
        el.src=url; el.controls=true;
      }else{
        el=document.createElement("img"); el.src=url;
      }
      el.onerror=()=>el.remove();
      el.onload=()=>{
        let d=document.createElement("div");
        d.className="item";
        d.appendChild(el);
        m.appendChild(d);
      };
    });
  }
}

// ==== 语言切换 ====
document.getElementById("btn-lang").onclick=()=>{
  lang=lang==="en"?"cn":"en";
  document.getElementById("btn-lang").innerText=content.header.lang[lang].toUpperCase();
  document.getElementById("btn-about").innerText=content.header.about ? content.header.about[lang] : 'About';
  if(currentPage) currentPage();
};
