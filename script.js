/* 基础配置 */
let lang = "en";
const app = document.getElementById("app");
const spotlight = document.querySelector(".spotlight");

const UI_TEXT = {
    home: { cn: "欢迎来到楠茜的作品集", en: "Welcome to Nancy's Portfolio" },
    creations: { cn: "个人创作", en: "Creations" },
    projects: { cn: "项目案例", en: "Projects" },
    about: { cn: "关于我", en: "About" }
};

/* 聚光灯：跟随鼠标 */
window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    spotlight.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--accent) 0%, transparent 50%)`;
});

/* 初始化按钮 */
document.getElementById("btn-lang").onclick = () => {
    lang = lang === "en" ? "cn" : "en";
    document.getElementById("btn-lang").innerText = lang.toUpperCase();
    renderPage(); // 刷新当前页文字
};

document.getElementById("btn-about").onclick = renderAbout;

/* 首页渲染 */
function renderHome() {
    app.innerHTML = `
        <div class="home-content">
            <h1 id="main-title"></h1>
            <div class="home-actions">
                <button onclick="renderGallery('creations')">${UI_TEXT.creations[lang]}</button>
                <button onclick="renderGallery('projects')">${UI_TEXT.projects[lang]}</button>
            </div>
        </div>
    `;
    typeWriter(document.getElementById("main-title"), UI_TEXT.home[lang], 60);
}

/* 作品列表：使用你原来的循环读取逻辑 */
function renderGallery(type) {
    app.innerHTML = "";
    removeBackButton();
    addBackButton();

    const grid = document.createElement("div");
    grid.className = "grid";
    app.appendChild(grid);

    // 假设分类路径
    const categories = type === 'creations' ? ['2d', '3d', 'ai'] : ['projectA'];
    
    categories.forEach(cat => {
        const path = `assets/${type}/${cat}`;
        // 暴力循环加载 50 个资源
        for (let i = 1; i <= 50; i++) {
            ["jpg", "png", "gif", "mp4"].forEach(ext => {
                const file = `${path}/${i}.${ext}`;
                const isVideo = ext === "mp4";
                const el = isVideo ? document.createElement("video") : new Image();
                
                el.src = file;
                if (isVideo) { 
                    el.muted = true; el.playsInline = true; el.loop = true; 
                }

                el.onload = el.onloadedmetadata = () => {
                    const d = document.createElement("div");
                    d.className = "item";
                    d.appendChild(el.cloneNode(true));
                    grid.appendChild(d);
                    
                    // 点击打开侧滑面板
                    d.onclick = () => openPanel(file, isVideo, cat);
                };
                el.onerror = () => el.remove();
            });
        }
    });
}

/* 侧滑面板：展示心得记录 */
function openPanel(src, isVideo, title) {
    const panel = document.getElementById("sidePanel");
    const mediaBox = document.getElementById("panelMedia");
    
    mediaBox.innerHTML = "";
    const el = isVideo ? document.createElement("video") : new Image();
    el.src = src;
    if (isVideo) { el.controls = true; el.autoplay = true; }
    mediaBox.appendChild(el);

    document.getElementById("panelTitle").innerText = title.toUpperCase();
    document.getElementById("panelDate").innerText = "2026 / Visual Work";
    document.getElementById("panelDesc").innerText = lang === "cn" 
        ? "这是我关于此作品的创作心得。在这里你可以详细描述你使用的工具（如 C4D, Midjourney, PS）、你的设计思考以及在这个项目中学到的东西。"
        : "This is my creative insight for this work. Here you can describe in detail the tools you used (e.g. C4D, Midjourney, PS), your design thinking, and what you learned in this project.";

    panel.classList.add("active");
}

document.querySelector(".close-panel").onclick = () => {
    document.getElementById("sidePanel").classList.remove("active");
    document.getElementById("panelMedia").innerHTML = ""; // 停止视频播放
};

/* 关于我 */
function renderAbout() {
    app.innerHTML = `
        <div style="max-width:600px; text-align:center;">
            <h2>${UI_TEXT.about[lang]}</h2>
            <p style="line-height:2; color:#ccc;">
                ${lang === 'cn' ? '这里是楠茜。一个热爱探索 AI 与视觉边界的设计师。' : 'This is Nancy. A designer who loves exploring the boundaries of AI and visuals.'}
            </p >
        </div>
    `;
    addBackButton();
}

/* 通用组件 */
function typeWriter(el, text, speed) {
    el.innerHTML = "";
    let i = 0;
    let timer = setInterval(() => {
        el.innerHTML += text[i++];
        if (i >= text.length) clearInterval(timer);
    }, speed);
}

function addBackButton() {
    const b = document.createElement("button");
    b.className = "back-btn";
    b.innerText = "←";
    b.onclick = renderHome;
    document.body.appendChild(b);
}

function removeBackButton() {
    const b = document.querySelector(".back-btn");
    if (b) b.remove();
}

/* 页面刷新逻辑 */
function renderPage() {
    // 简单判断当前状态
    if (document.querySelector(".grid")) return; 
    renderHome();
}

window.onload = renderHome;
