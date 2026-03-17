const typedText = document.getElementById('typed-text');
const fullText = { en: typedText.dataset.en, cn: typedText.dataset.cn };
let lang = 'en';

/* 打字动画 */
function typeWriter(text, i = 0) {
    if (i < text.length) {
        typedText.textContent += text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1), 100);
    } else {
        document.getElementById('buttons').classList.add('show');
        document.getElementById('buttons').classList.remove('hidden');
    }
}

typedText.textContent = '';
typeWriter(fullText[lang]);

/* About 弹出层 */
const aboutBtn = document.getElementById('btn-about');
const aboutPanel = document.getElementById('about-panel');
const closeAbout = document.getElementById('close-about');
const aboutText = document.getElementById('about-text');

fetch('content.json')
    .then(res => res.json())
    .then(data => {
        aboutText.textContent = data.about[`text_${lang}`];

        aboutBtn.addEventListener('click', () => { aboutPanel.classList.add('show'); });
        closeAbout.addEventListener('click', () => { aboutPanel.classList.remove('show'); });
        aboutPanel.addEventListener('click', (e) => { if(e.target===aboutPanel) aboutPanel.classList.remove('show'); });

        function createItem(itemData){
            const div = document.createElement('div'); div.className='item';
            if(itemData.type==='image'||itemData.type==='gif'){
                const img=document.createElement('img'); img.src=itemData.media; img.alt=itemData.title; div.appendChild(img);
            } else if(itemData.type==='video'){
                const video=document.createElement('video'); video.src=itemData.media; video.controls=true; div.appendChild(video);
            }
            const p=document.createElement('p'); p.textContent=itemData[`text_${lang}`]; div.appendChild(p);
            if(itemData.link){ const a=document.createElement('a'); a.href=itemData.link; a.target="_blank"; a.textContent="查看详情"; div.appendChild(a); }
            return div;
        }

        ['works','projects'].forEach(sectionId => {
            const grid = document.querySelector(`#${sectionId} .grid`);
            data[sectionId].forEach(item => { grid.appendChild(createItem(item)); });
        });

        document.querySelectorAll('.entry-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const section = document.getElementById(targetId);
                section.classList.add('show');
                section.scrollIntoView({behavior:'smooth'});
                const items = section.querySelectorAll('.item');
                items.forEach((item,index)=>{ setTimeout(()=>{item.classList.add('show');}, index*150); });
            });
        });
    });

/* 语言切换 */
document.getElementById('btn-en').addEventListener('click', () => switchLang('en'));
document.getElementById('btn-cn').addEventListener('click', () => switchLang('cn'));
function switchLang(newLang){
    if(lang===newLang) return;
    lang=newLang;
    typedText.textContent='';
    typeWriter(fullText[lang]);
    document.querySelectorAll('.lang-btn').forEach(btn=>btn.classList.remove('active'));
    document.getElementById(`btn-${lang}`).classList.add('active');

    fetch('content.json').then(res=>res.json()).then(data=>{
        aboutText.textContent = data.about[`text_${lang}`];
        ['works','projects'].forEach(sectionId=>{
            const grid = document.querySelector(`#${sectionId} .grid`);
            grid.innerHTML=''; // 清空旧内容
            data[sectionId].forEach(item=>{ grid.appendChild(createItem(item)); });
        });
    });
}

/* 高级动态背景 */
let hueOffset = 0;
function updateBackground(x, y){
    const angle = x * 360;
    hueOffset += 0.2;
    if(hueOffset>360) hueOffset=0;
    const color1 = `hsl(${(200+hueOffset)%360}, 30%, 95%)`;
    const color2 = `hsl(${(220+hueOffset)%360}, 20%, 90%)`;
    document.body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

document.addEventListener('mousemove', e=>{
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    updateBackground(x, y);
});

setInterval(()=>{ updateBackground(0.5,0.5); }, 100);

