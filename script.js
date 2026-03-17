let app=document.getElementById("app");

let currentPage;
let currentCategory=null;
let inDetailView=false;
let backToListOnce=false;
let lang="en";

/* 文案 */
let text={
  home:{en:"Welcome to my portfolio",cn:"欢迎来到我的作品集"},
  about:{en:"About me",cn:"关于我"}
};

/* 背景 */
document.body.style.background=
"linear-gradient(120deg,#e9edf3,#f4f6fb)";

/* header按钮 */
document.getElementById("btn-about").onclick=()=>{
  if(currentPage===showAbout){
    showHome();
  }else{
    showAbout();
  }
};

document.getElementById("btn-lang").onclick=()=>{
  lang=lang==="en"?"cn":"en";
  document.getElementById("btn-lang").innerText=lang.toUpperCase();
  currentPage();
};

/* 返回 */
function createBackButton(){
  let b=document.createElement("button");
  b.className="back-btn";
  b.innerText="←";

  b.onclick=()=>{
    if(inDetailView){
      showCreations();
      backToListOnce=true;
    }else{
      if(backToListOnce){
        showHome();
        backToListOnce=false;
      }
    }
  };

  document.body.appendChild(b);
}

/* 扩散 */
function expandFromButton(btn,callback){
  let rect=btn.getBoundingClientRect();

  let o=document.createElement("div");
  o.className="expand-overlay";
  o.style.left=rect.left+"px";
  o.style.top=rect.top+"px";

  document.body.appendChild(o);

  setTimeout(()=>o.classList.add("active"),10);

  setTimeout(()=>{
    o.remove();
    callback();
  },500);
}

/* 动画 */
function animateItems(m){
  let items=m.querySelectorAll(".item");

  items.forEach((el,i)=>{
    setTimeout(()=>{
      el.style.opacity="1";
      el.style.transform="translateY(0)";
    },i*60);
  });
}

/* 首页 */
function showHome(){
  currentPage=showHome;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());

  let m=createModule();

  let h=document.createElement("h1");
  h.innerText="NANCI";

  let sub=document.createElement("div");
  sub.className="subtitle";
  sub.innerText=text.home[lang];

  let box=document.createElement("div");
  box.className="home-actions";

  let b1=document.createElement("button");
  b1.innerText="Creations";
  b1.onclick=(e)=>expandFromButton(e.target,showCreations);

  let b2=document.createElement("button");
  b2.innerText="Projects";
  b2.onclick=(e)=>expandFromButton(e.target,showProjects);

  box.appendChild(b1);
  box.appendChild(b2);

  m.appendChild(h);
  m.appendChild(sub);
  m.appendChild(box);

  app.appendChild(m);
}

/* Creations */
function showCreations(){
  currentPage=showCreations;
  app.innerHTML="";
  inDetailView=false;

  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  createBackButton();

  let m=createModule();

  let tabs=document.createElement("div");
  tabs.className="tabs";

  ["2d","3d","ai"].forEach(cat=>{
    let b=document.createElement("button");
    b.innerText=cat.toUpperCase();

    b.onclick=()=>{
      tabs.querySelectorAll("button").forEach(btn=>btn.classList.remove("active"));
      b.classList.add("active");

      currentCategory=cat;
      inDetailView=true;
      backToListOnce=false;

      renderAssets(`assets/creations/${cat}`,m);
      animateItems(m);
    };

    tabs.appendChild(b);
  });

  m.appendChild(tabs);
  app.appendChild(m);
}

/* About */
function showAbout(){
  currentPage=showAbout;
  app.innerHTML="";
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());

  let m=createModule();

  let t=document.createElement("p");
  t.innerText=text.about[lang];

  m.appendChild(t);
  app.appendChild(m);
}

/* Projects */
function showProjects(){
  currentPage=showProjects;
  app.innerHTML="";

  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  createBackButton();

  let m=createModule();

  let tabs=document.createElement("div");
  tabs.className="tabs";

  ["projectA"].forEach(p=>{
    let b=document.createElement("button");
    b.innerText=p;

    b.onclick=()=>{
      tabs.querySelectorAll("button").forEach(btn=>btn.classList.remove("active"));
      b.classList.add("active");

      renderAssets(`assets/projects/${p}`,m);
      animateItems(m);
    };

    tabs.appendChild(b);
  });

  m.appendChild(tabs);
  app.appendChild(m);
}

/* 模块 */
function createModule(){
  let d=document.createElement("div");
  d.className="module";
  setTimeout(()=>d.classList.add("show"),10);
  return d;
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

/* 初始化 */
document.getElementById("btn-lang").innerText="EN";
showHome();
