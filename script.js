let app=document.getElementById("app");

let currentPage;
let currentCategory=null;
let inDetailView=false;
let backToListOnce=false;

/* 背景 */
let hue=200;

document.body.style.background =
`linear-gradient(120deg,hsl(200,25%,88%),hsl(230,25%,92%))`;

document.addEventListener("mousemove",e=>{
  let x=e.clientX/window.innerWidth;
  let y=e.clientY/window.innerHeight;

  document.body.style.background=
  `linear-gradient(${120+x*40}deg,
  hsl(${hue+y*10},25%,88%),
  hsl(${hue+30+y*10},25%,92%))`;
});

function animate(){
  hue+=0.05;
  requestAnimationFrame(animate);
}
animate();

/* 返回按钮 */
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

/* 扩散动画 */
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
  },600);
}

/* 动画 */
function animateItems(m){
  let items=m.querySelectorAll(".item");

  items.forEach((el,i)=>{
    setTimeout(()=>{
      el.style.transition="0.5s ease";
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

  let title=document.createElement("h1");
  title.innerText="NANCI";

  let sub=document.createElement("div");
  sub.className="subtitle";
  sub.innerText="Welcome to my portfolio";

  let actions=document.createElement("div");
  actions.className="home-actions";

  let b1=document.createElement("button");
  b1.innerText="Creations";
  b1.onclick=(e)=>expandFromButton(e.target,showCreations);

  let b2=document.createElement("button");
  b2.innerText="Projects";
  b2.onclick=(e)=>expandFromButton(e.target,showProjects);

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

/* Projects（结构同样） */
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
showHome();
