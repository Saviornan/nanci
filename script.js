const app = document.getElementById("app");
let lang = "en";

const TEXT = {
    welcome: { en: "WELCOME TO NANCY'S PORTFOLIO", cn: "欢迎来到楠茜的作品集" },
    creations: { en: "CREATIONS", cn: "个人创作" },
    projects: { en: "PROJECTS", cn: "项目展示" },
    about: { en: "ABOUT ME", cn: "关于我" },
    desc_digital: { en: "Handcrafted Digital Art (2D/3D)", cn: "非AI纯手工数字化创作 (2D/3D)" },
    desc_ai: { en: "AI Exploration & Experiment", cn: "AI 生成与实验性探索" }
};

// 按钮绑定
document.getElementById("btn-lang").onclick = () => {
    lang = lang === "en" ? "cn" : "en";
    document.getElementById("btn-lang").innerText = lang.toUpperCase();
    renderHome(); // 语言切换回首页，防止逻辑错乱
};

document.getElementById("btn-about").onclick = renderAbout;

/* 打字机函数 */
function typeWriter(el, text, speed, callback) {
    el.innerHTML = "";
    let i = 0;
    const timer = setInterval(() => {
        el.innerHTML += text[i++];
        if (i >= text.length) {
            clearInterval(timer);
            if (callback) callback();
        }
    }, speed);
}

/* 首页渲染 */
function renderHome() {
    app.innerHTML = `
        <div class="home-screen">
            <h1 id="type-title"></h1>
            <div class="nav-links" id="home-nav">
                <button onclick="renderCreations()">${TEXT.creations[lang]}</button>
                <button onclick="renderProjects()">${TEXT.projects[lang]}</button>
            </div>
        </div>
    `;
    typeWriter(document.getElementById("type-title"), TEXT.welcome[lang], 60, () => {
        document.getElementById("home-nav").classList.add("show");
    });
    removeBackBtn();
}

/* 个人创作页 */
function renderCreations() {
    app.innerHTML = `
        <div class="gallery-container">
            <div class="section-title">HANDCRAFTED ART</div>
            <div class="masonry" id="masonry-digital"></div>
            
            <div class="section-title">AI GENERATION</div>
            <div class="masonry" id="masonry-ai"></div>
        </div>
    `;
    addBackBtn();
    // 加载资源 (保留你原来的路径逻辑)
    loadMasonry("creations/2d", "masonry-digital", TEXT.desc_digital[lang]);
    loadMasonry("creations/3d", "masonry-digital", TEXT.desc_digital[lang]);
    loadMasonry("creations/ai", "masonry-ai", TEXT.desc_ai[lang]);
}

/* 项目展示页 (宽屏感) */
function renderProjects() {
    app.innerHTML = `
        <div class="gallery-container">
            <div class="section-title">COMMERCIAL PROJECTS</div>
            <div class="masonry" id="masonry-projects" style="column-count: 2;"></div>
        </div>
    `;
    addBackBtn();
    loadMasonry("projects/projectA", "masonry-projects", "Commercial Case Study");
}

/* 瀑布流加载器 */
function loadMasonry(path, gridId, tag) {
    const grid = document.getElementById(gridId);
    for (let i = 1; i <= 15; i++) {
        ["jpg", "mp4", "png"].forEach(ext => {
            const file = `assets/${path}/${i}.${ext}`;
            const isVideo = ext === "mp4";
            const temp = isVideo ? document.createElement("video") : new Image();
            temp.src = file;

            temp.onload = temp.onloadedmetadata = () => {
                const item = document.createElement("div");
                item.className = "item";
                const media = temp.cloneNode();
                if(isVideo) { media.muted = true; media.loop = true; media.play(); }
                item.appendChild(media);
                grid.appendChild(item);

                item.onclick = () => openViewer(file, isVideo, tag, `Works - ${i}`);
            };
            temp.onerror = () => temp.remove();
        });
    }
}

/* 详情查看器 */
function openViewer(src, isVideo, tag, title) {
    const layer = document.getElementById("viewerLayer");
    const mediaBox = document.getElementById("viewerMedia");
    mediaBox.innerHTML = "";
    const el = isVideo ? document.createElement("video") : new Image();
    el.src = src;
    if(isVideo) { el.controls = true; el.autoplay = true; }
    mediaBox.appendChild(el);

    document.getElementById("vTitle").innerText = title;
    document.getElementById("vTag").innerText = tag;
    document.getElementById("vDesc").innerText = lang === "en" ? "Insight: Exploring the balance between aesthetic and technique." : "创作心得：在审美与技术之间寻找微妙的平衡。";

    layer.classList.add("active");
}

document.querySelector(".viewer-close").onclick = () => document.getElementById("viewerLayer").classList.remove("active");

/* 关于我 */
function renderAbout() {
    app.innerHTML = `
        <div class="home-screen">
            <div style="max-width: 600px; padding: 20px;">
                <h1>${TEXT.about[lang]}</h1>
                <p style="line-height: 2; color: #888;">${lang === 'cn' ? '我是楠茜，一名探索数字艺术边界的设计师。' : 'I am Nancy, a designer exploring the boundaries of digital art.'}</p >
            </div>
        </div>
    `;
    addBackBtn();
}

/* 返回按钮管理 */
function addBackBtn() {
    removeBackBtn();
    const b = document.createElement("button");
    b.className = "back-btn";
    b.innerText = "←";
    b.onclick = renderHome;
    document.body.appendChild(b);
}

function removeBackBtn() {
    const b = document.querySelector(".back-btn");
    if(b) b.remove();
}

window.onload = renderHome;
