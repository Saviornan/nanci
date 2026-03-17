let app=document.getElementById("app");
let lang="en";
let currentPage;

/* 文本 */
let text={
  home:{en:"Welcome to my portfolio",cn:"欢迎来到我的作品集"},
  creations:{en:"Creations",cn:"个人创作"},
  projects:{en:"Projects",cn:"项目"},
  about:{en:"About me",cn:"关于我"}
};

/* header */
document.getElementById("btn-about").onclick=showAbout;
document.getElementById("btn-lang").onclick=()=>{
  lang=lang==="en"?"cn":"en";
  document.getElementById("btn-lang").innerText=lang.toUpperCase();
  currentPage();
};

/* 打字机 */
let timer;
function typeText(el,str){
  clearInterval(timer);
  el.innerText="";
  let i=0;
  timer=setInterval(()=>{
    if(i<str.length){
      el.innerText+=str[i++];
    }else clearInterval(timer);
  },50);
}

/* 背景（浅+有互动） */
let hue=200;

document.addEventListener("mousemove",e=>{
  let x=e.clientX/window.innerWidth;
  let y=e.clientY/window.innerHeight;

  document.body.style.background=
  `linear-gradient(${120+x*40}deg,
  hsl(${hue+y*10},30%,85%),
  hsl(${hue+30+y*10},30%,90%))`;
});

function animate(){
  hue+=0.05;
  requestAnimationFrame(animate);
}
animate();

/* 首页 */
function showHome(){
  currentPage=showHome;
  app.innerHTML="";

  let m=createModule();

  let title=document.createElement("h1");
  title.innerText="NANCI";

  let sub=document.createElement("div");
  sub.className="subtitle";
  typeText(sub,text.home[lang]);

  let actions=document.createElement("div");
  actions.className="home-actions";

  let b1=document.createElement("button");
  b1.innerText=text.creations[lang];
  b1.onclick=showCreations;

  let b2=document.createElement("button");
  b2.innerText=text.projects[lang];
  b2.onclick=showProjects;

  actions.appendChild(b1);
  actions.appendChild(b2);

  m.appendChild(title);
  m.appendChild(sub);
  m.appendChild(actions);

  app.appendChild(m);
}

/* Creations */
function showCreations(){
  currentPage=showCreations;
  app.innerHTML="";

  let m=createModule();

  let tabs=document.createElement("div");
  tabs.className="tabs";

  ["2d","3d","ai"].forEach(cat=>{
    let b=document.createElement("button");
    b.innerText=cat.toUpperCase();
    b.onclick=()=>renderAssets(`assets/creations/${cat}`,m);
    tabs.appendChild(b);
  });

  m.appendChild(tabs);
  app.appendChild(m);

  renderAssets("assets/creations/2d",m);
}

/* Projects */
function showProjects(){
  currentPage=showProjects;
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

/* About */
function showAbout(){
  currentPage=showAbout;
  app.innerHTML="";

  let m=createModule();

  let img=document.createElement("img");
  img.src="assets/about/profile.jpg";

  let t=document.createElement("p");
  t.innerText=text.about[lang];

  m.appendChild(img);
  m.appendChild(t);

  app.appendChild(m);
}

/* 资源加载 */
function renderAssets(path,m){
  m.querySelectorAll(".item").forEach(i=>i.remove());

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
        m.appendChild(d);
      };
    });
  }
}

function createModule(){
  let d=document.createElement("div");
  d.className="module";
  return d;
}

/* 初始化 */
document.getElementById("btn-lang").innerText="EN";
showHome();
