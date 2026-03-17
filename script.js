let lang = "en";
let app = document.getElementById("app");

/* ===== 数据 ===== */
let text = {
  home: {en:"Welcome to my portfolio", cn:"欢迎来到我的作品集"},
  creations: {en:"Creations", cn:"个人创作"},
  projects: {en:"Projects", cn:"项目"}
};

/* ===== 头部按钮 ===== */
document.getElementById("btn-home").onclick = showHome;
document.getElementById("btn-creations").onclick = showCreations;
document.getElementById("btn-projects").onclick = showProjects;
document.getElementById("btn-about").onclick = showAbout;

document.getElementById("btn-lang").onclick = () => {
  lang = lang==="en"?"cn":"en";
  initHeader();
  showHome();
};

function initHeader(){
  document.getElementById("btn-creations").innerText = text.creations[lang];
  document.getElementById("btn-projects").innerText = text.projects[lang];
  document.getElementById("btn-lang").innerText = lang.toUpperCase();
}

/* ===== 打字机效果 ===== */
let typingTimer;
function typeText(el, str){
  clearInterval(typingTimer);
  el.innerText="";
  let i=0;
  typingTimer = setInterval(()=>{
    if(i<str.length){
      el.innerText += str[i];
      i++;
    }else{
      clearInterval(typingTimer);
    }
  },50);
}

/* ===== 背景 ===== */
let hue=200;
document.addEventListener("mousemove",e=>{
  let x=e.clientX/window.innerWidth;
  let y=e.clientY/window.innerHeight;

  document.body.style.background=
  `linear-gradient(${120+x*30}deg,
  hsl(${hue+y*20},60%,70%),
  hsl(${hue+40+y*20},60%,75%))`;
});

function animate(){
  hue+=0.05;
  requestAnimationFrame(animate);
}
animate();

/* ===== 页面切换 ===== */
function showHome(){
  app.innerHTML="";
  let m=createModule();

  let title=document.createElement("h1");
  title.innerText="NANCI";

  let sub=document.createElement("div");
  sub.className="subtitle";
  typeText(sub, text.home[lang]);

  m.appendChild(title);
  m.appendChild(sub);
  app.appendChild(m);
}

/* ===== Creations ===== */
function showCreations(){
  app.innerHTML="";
  let m=createModule();

  let tabs=document.createElement("div");
  tabs.className="tabs";

  ["2d","ai","3d"].forEach(cat=>{
    let b=document.createElement("button");
    b.innerText=cat.toUpperCase();
    b.onclick=()=>renderAssets(`assets/creations/${cat}`,m);
    tabs.appendChild(b);
  });

  m.appendChild(tabs);
  app.appendChild(m);

  renderAssets("assets/creations/2d",m);
}

/* ===== Projects ===== */
function showProjects(){
  app.innerHTML="";
  let m=createModule();

  let tabs=document.createElement("div");
  tabs.className="tabs";

  ["projectA"].forEach(p=>{
    let b=document.createElement("button");
    b.innerText=p;
    b.onclick=()=>renderAssets(`assets/projects/${p}`,m);
    tabs.appendChild(b);
  });

  m.appendChild(tabs);
  app.appendChild(m);

  renderAssets("assets/projects/projectA",m);
}

/* ===== About ===== */
function showAbout(){
  app.innerHTML="";
  let m=createModule();

  let img=document.createElement("img");
  img.src="assets/about/profile.jpg";

  let t=document.createElement("p");
  t.innerText=lang==="en"?"About me":"关于我";

  m.appendChild(img);
  m.appendChild(t);
  app.appendChild(m);
}

/* ===== 资源加载（自动匹配图片/视频）===== */
function renderAssets(path,module){
  module.querySelectorAll(".item").forEach(i=>i.remove());

  for(let i=1;i<=20;i++){
    ["jpg","png","gif","mp4"].forEach(ext=>{
      let file=`${path}/${i}.${ext}`;
      let el;

      if(ext==="mp4"){
        el=document.createElement("video");
        el.src=file;
        el.controls=true;
      }else{
        el=document.createElement("img");
        el.src=file;
      }

      el.onerror=()=>el.remove();
      el.onload=()=>{
        let d=document.createElement("div");
        d.className="item";
        d.appendChild(el);
        module.appendChild(d);
      };
    });
  }
}

/* ===== 通用 ===== */
function createModule(){
  let d=document.createElement("div");
  d.className="module";
  return d;
}

/* 初始化 */
initHeader();
showHome();
