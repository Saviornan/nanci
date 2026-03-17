let lang = 'en';
let content = {};
let currentModule = null;
const mainContent = document.getElementById('main-content');
const btnLang = document.getElementById('btn-lang');

 异步加载 content.json
fetch('content.json')
  .then(res = res.json())
  .then(data = {
    content = data;
    initHeader();
    renderModule('creations');
  });

 初始化头部按钮文字
function initHeader() {
  document.getElementById('btn-creations').textContent = content.header.creations[lang];
  document.getElementById('btn-projects').textContent = content.header.projects[lang];
  btnLang.textContent = content.header.lang[lang];
}

 切换语言
btnLang.onclick = ()={
  lang = lang==='en''cn''en';
  initHeader();
  renderModule(currentModule);
}

 背景渐变 + 鼠标微动态
let hue = 200;
document.body.addEventListener('mousemove', e={
  let offsetX = e.clientX  window.innerWidth;
  let offsetY = e.clientY  window.innerHeight;
  document.body.style.background = `linear-gradient(${120 + offsetX30}deg, hsl(${hue + offsetY20},60%,50%), hsl(${hue+60 + offsetY20},60%,50%))`;
});
function animateBackground(){
  hue = (hue+0.2)%360;
  requestAnimationFrame(animateBackground);
}
animateBackground();

 渲染模块
function renderModule(type){
  mainContent.innerHTML='';
  currentModule = type;
  const arr = content[type];
  const moduleDiv = document.createElement('div');
  moduleDiv.classList.add('module','active');

   横向分类按钮
  const categories = arr.map(a=a.title[lang]);
  const tabs = document.createElement('div');
  tabs.classList.add('category-tabs');
  categories.forEach(c={
    const btn = document.createElement('button');
    btn.textContent=c;
    btn.onclick=()=renderCategory(c);
    tabs.appendChild(btn);
  });
  moduleDiv.appendChild(tabs);
  mainContent.appendChild(moduleDiv);

  renderCategory(categories[0]);
}

 渲染分类内容
function renderCategory(cat){
  const moduleDiv = document.querySelector('.module.active');
  moduleDiv.querySelectorAll('.item').forEach(i=i.remove());
  const items = content[currentModule].filter(a=a.title[lang]===cat);

  items.forEach(item={
    const div = document.createElement('div');
    div.classList.add('item');

    const h3 = document.createElement('h3');
    h3.textContent=item.title[lang];
    div.appendChild(h3);

     每个项目子文件夹下的 files.json
    fetch(item.folder+'files.json')
      .then(res=res.json())
      .then(files={
        files.forEach(f={
          const ext = f.split('.').pop().toLowerCase();
          if(['jpg','png','gif'].includes(ext)){
            const img = document.createElement('img');
            img.src = item.folder + '' + f;
            div.appendChild(img);
          } else if(['mp4','webm'].includes(ext)){
            const vid = document.createElement('video');
            vid.src = item.folder + '' + f;
            vid.controls=true;
            div.appendChild(vid);
          }
        });
      });

    const p = document.createElement('p');
    p.textContent=item.description[lang];
    div.appendChild(p);

    if(item.link){
      const a = document.createElement('a');
      a.href=item.link;
      a.target=_blank;
      a.textContent=item.link_text[lang]View;
      div.appendChild(a);
    }

    moduleDiv.appendChild(div);
  });
}

 头部按钮事件
document.getElementById('btn-creations').onclick = ()=renderModule('creations');
document.getElementById('btn-projects').onclick = ()=renderModule('projects');