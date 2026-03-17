let lang = "en";

// JSON 数据直接写在 JS 里，避免 fetch / 路径问题
let data = {
  creations: ["2d","ai","3d"],
  projects: ["projectA"],
  text: {
    creations: {en:"Creations", cn:"个人创作"},
    projects: {en:"Projects", cn:"项目"},
    "2d": {en:"2D", cn:"二维"},
    ai: {en:"AI", cn:"AI生成"},
    "3d": {en:"3D", cn:"三维"}
  }
};

const app = document.getElementById("app");

// 初始化头部
function initHeader(){
  document.getElementById("btn-creations").innerText = data.text.creations[lang];
  document.getElementById("btn-projects").innerText = data.text.projects[lang];
  document.getElementById("btn-lang").innerText = lang.toUpperCase();
}

// 语言切换
document.getElementById("btn-lang").onclick = () => {
  lang = lang==="en"?"cn":"en";
  initHeader();
  currentRender();
};

// 头部按钮
document.getElementById("btn-creations").onclick = showCreations;
document.getElementById("btn-projects").onclick = showProjects;

let currentRender = showHome;

// 背景渐变
let hue = 200;
document.addEventListener("mousemove", e => {
  let x = e.clientX/window.innerWidth;
  let y = e.clientY/window.innerHeight;
  document.body.style.background =
    `linear-gradient(${120 + x*30}deg,
    hsl(${hue + y*20},50%,60%),
    hsl(${hue + 50 + y*20},50%,65%))`;
});
function animate(){
  hue += 0.1;
  requestAnimationFrame(animate);
}
animate();

/* ================= 首页 ================= */
function showHome(){
  currentRender = showHome;
  app.innerHTML="";

  let module = createModule();

  let title = document.createElement("h1");
  title.innerText = "NANCI";
  module.appendChild(title);

  let sub = document.createElement("p");
  sub.innerText = lang==="en" ? "Portfolio / Selected Works" : "作品集 / 精选内容";
  module.appendChild(sub);

  let btnCreations = document.createElement("button");
  btnCreations.innerText = data.text.creations[lang];
  btnCreations.onclick = showCreations;

  let btnProjects = document.createElement("button");
  btnProjects.innerText = data.text.projects[lang];
  btnProjects.onclick = showProjects;

  let btnAbout = document.createElement("button");
  btnAbout.innerText = "About";
  btnAbout.onclick = showAbout;

  module.appendChild(btnCreations);
  module.appendChild(btnProjects);
  module.appendChild(btnAbout);

  app.appendChild(module);
}

/* ================= Creations ================= */
function showCreations(){
  currentRender = showCreations;
  app.innerHTML="";
  let module = createModule();

  let tabs = document.createElement("div");
  tabs.className="tabs";

  data.creations.forEach(cat => {
    let btn = document.createElement("button");
    btn.innerText = data.text[cat][lang];
    btn.onclick = () => renderCategory(cat,module);
    tabs.appendChild(btn);
  });

  module.appendChild(tabs);
  app.appendChild(module);

  renderCategory(data.creations[0],module);
}

function renderCategory(cat,module){
  module.querySelectorAll(".item").forEach(i=>i.remove());

  for(let i=1;i<=20;i++){
    let names = [`${i}.jpg`,`${i}.png`,`${i}.gif`,`${i}.mp4`];
    names.forEach(name=>{
      let path = `assets/creations/${cat}/${name}`;
      let el;
      if(name.includes(".mp4")){
        el=document.createElement("video");
        el.src=path;
        el.controls=true;
      }else{
        el=document.createElement("img");
        el.src=path;
      }

      el.onerror=()=>el.remove();
      el.onload=()=>{
        let div=document.createElement("div");
        div.className="item";
        div.appendChild(el);
        module.appendChild(div);
      };
    });
  }
}

/* ================= Projects ================= */
function showProjects(){
  currentRender = showProjects;
  app.innerHTML="";
  let module = createModule();

  data.projects.forEach(p => {
    // 横向分类按钮
    let tabs = document.createElement("div");
    tabs.className="tabs";

    let btn = document.createElement("button");
    btn.innerText = p;
    btn.onclick = ()=>renderProject(p,module);
    tabs.appendChild(btn);

    module.appendChild(tabs);
    app.appendChild(module);

    // 默认显示第一个项目
    renderProject(p,module);
  });
}

function renderProject(p,module){
  module.querySelectorAll(".item").forEach(i=>i.remove());

  for(let i=1;i<=20;i++){
    let names = [`${i}.jpg`,` ${i}.png`,`${i}.mp4`];
    names.forEach(name=>{
      let path = `assets/projects/${p}/${name}`;
      let el;
      if(name.includes(".mp4")){
        el=document.createElement("video");
        el.src=path;
        el.controls=true;
      }else{
        el=document.createElement("img");
        el.src=path;
      }

      el.onerror=()=>el.remove();
      el.onload=()=>{
        let div=document.createElement("div");
        div.className="item";
        div.appendChild(el);
        module.appendChild(div);
      };
    });
  }
}

/* ================= About ================= */
function showAbout(){
  currentRender = showAbout;
  app.innerHTML="";
  let module = createModule();

  let img = document.createElement("img");
  img.src = "assets/about/profile.jpg";
  img.style.maxWidth="300px";

  let text = document.createElement("p");
  text.innerText = lang==="en" ? "About me" : "关于我";

  module.appendChild(img);
  module.appendChild(text);

  app.appendChild(module);
}

/* ================= 通用模块 ================= */
function createModule(){
  let m=document.createElement("div");
  m.className="module active";
  return m;
}

// 初始化头部和首页
initHeader();
showHome();

