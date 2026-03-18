let app=document.getElementById("app");
let currentPage,currentCategory=null,inDetailView=false,lang="en";
let content=null;

const lb=document.getElementById("lightbox");
const lbImg=document.getElementById("lbImg");
const lbVideo=document.getElementById("lbVideo");
document.getElementById("lbClose").onclick=()=>{lb.style.display="none"; lbImg.style.display="none"; lbVideo.style.display="none";};

fetch("content.json").then(r=>r.json()).then(j=>{content=j; initSite();});

function initSite(){
  document.getElementById("btn-lang").innerText=content.header.lang[lang];
  document.getElementById("btn-about").innerText="About";
  document.getElementById("btn-lang").onclick=()=>{
    lang=lang==="en"?"cn":"en";
    document.getElementById("btn-lang").innerText=content.header.lang[lang];
    if(currentPage) currentPage();
  };
  document.getElementById("btn-about").onclick=()=>{
    if(currentPage===showAbout) showHome();
    else showAbout();
  };
  showHome();
}

function typeWriter(el,text,speed,callback){
  el.innerHTML=""; let i=0;
  let t=setInterval(()=>{ el.innerHTML+=text[i++]; if(i>=text.length){ clearInterval(t); callback&&callback(); } },speed);
}

function createBackButton(){
  document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  let b=document.createElement("button"); b.className="back-btn"; b.innerText="←";
  b.onclick=()=>{
    if(currentPage===showCreations){ if(inDetailView){ showCreations(); inDetailView=false; } else showHome();}
    else if(currentPage===showProjects){ if(inDetailView){ showProjects(); inDetailView=false; } else showHome();}
  };
  document.body.appendChild(b);
}

function expandFromButton(btn,callback){
  let rect=btn.getBoundingClientRect();
  let o=document.createElement("div"); o.className="expand-overlay";
  o.style.left=rect.left+rect.width/2+"px"; o.style.top=rect.top+rect.height/2+"px";
  document.body.appendChild(o);
  setTimeout(()=>o.classList.add("active"),10);
  setTimeout(()=>{ o.remove(); callback(); },500);
}

function showHome(){
  currentPage=showHome; app.innerHTML=""; document.querySelectorAll(".back-btn").forEach(e=>e.remove());
  let m=createModule(); let h=document.createElement("h1"); 
  let box=document.createElement("div"); box.className="home-actions";
  let b1=document.createElement("button"); b1.innerText=content.header.creations[lang]; b1.onclick=(e)=>expandFromButton(e.currentTarget,showCreations);
  let b2=document.createElement("button"); b2.innerText=content.header.projects[lang]; b2.onclick=(e)=>expandFromButton(e.currentTarget,showProjects);
  box.appendChild(b1); box.appendChild(b2); m.appendChild(h); m.appendChild(box); app.appendChild(m);
  typeWriter(h,lang==="cn"?"欢迎来到楠茜的作品集":"Welcome to Nancy's Portfolio",60,()=>{ box.style.opacity="1"; });
}

function showCreations(){
  currentPage=showCreations; app.innerHTML=""; inDetailView=false; createBackButton();
  let m=createModule(); let tabs=document.createElement("div"); tabs.className="tabs";
  content.creations.forEach(cat=>{ let b=document.createElement("button"); b.innerText=cat.title[lang]; b.onclick=()=>openCategoryPage(cat.folder); tabs.appendChild(b); });
  m.appendChild(tabs); app.appendChild(m);
}

function openCategoryPage(folder){
  currentCategory=folder; inDetailView=true; app.innerHTML=""; createBackButton();
  let m=createModule(); let grid=document.createElement("div"); grid.className="grid"; m.appendChild(grid); app.appendChild(m);
  for(let i=1;i<=50;i++){
    ["jpg","png","gif","mp4"].forEach(ext=>{
      let url=`${folder}/${i}.${ext}`;
      fetch(url,{method:"HEAD"}).then(r=>{
        if(r.ok){
          let div=document.createElement("div"); div.className="item";
          if(ext==="mp4"){ let v=document.createElement("video"); v.src=url; v.controls=true; v.muted=true; v.playsInline=true; div.appendChild(v); v.onclick=()=>{ lb.style.display="flex"; lbVideo.style.display="block"; lbVideo.src=url; lbImg.style.display="none"; }; }
          else{ let img=new Image(); img.src=url; div.appendChild(img); img.onclick=()=>{ lb.style.display="flex"; lbImg.src=url; lbImg.style.display="block"; lbVideo.style.display="none"; }; }
          grid.appendChild(div);
        }
      }).catch(()=>{});
    });
  }
}

function showAbout(){ currentPage=showAbout; app.innerHTML=""; createBackButton(); let m=createModule(); let t=document.createElement("p"); t.innerText=lang==="cn"?"这里是楠茜的个人介绍。":"This is Nancy's introduction."; m.appendChild(t); app.appendChild(m); }

function showProjects(){
  currentPage=showProjects; app.innerHTML=""; inDetailView=false; createBackButton();
  let m=createModule(); let grid=document.createElement("div"); grid.className="grid";
  content.projects.forEach(p=>{ let b=document.createElement("button"); b.innerText=p.title[lang]; b.onclick=()=>openCategoryPage(p.folder); grid.appendChild(b); });
  m.appendChild(grid); app.appendChild(m);
}

function createModule(){ let d=document.createElement("div"); d.className="module"; setTimeout(()=>d.classList.add("show"),10); return d; }

/* 粒子背景 */
const canvas=document.getElementById("bgCanvas"); const ctx=canvas.getContext("2d");
let w,h,particles=[];
function resizeCanvas(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; initParticles(); }
window.addEventListener("resize",resizeCanvas);
function initParticles(){ particles=[]; for(let i=0;i<400;i++){ particles.push({x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.2+0.5, baseR:Math.random()*1.2+0.5}) } }
window.addEventListener("mousemove",e=>{
  particles.forEach(p=>{
    let dx=p.x-e.clientX, dy=p.y-e.clientY;
    let d=Math.sqrt(dx*dx+dy*dy);
    if(d<120){ p.r=p.baseR*(1+(120-d)/60); } else p.r=p.baseR; 
  });
});
function drawParticles(){
  ctx.clearRect(0,0,w,h);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,"+(p.r/p.baseR*0.15)+")";
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
resizeCanvas(); drawParticles();
