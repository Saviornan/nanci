const app = document.getElementById("app");
const fluid = document.querySelector(".fluid-bg");
let lang = "en";

// 心得数据库：根据分类展示不同心得
const CONTENT_MAP = {
    "digital": { 
        tag: "Digital Art & Design", 
        desc: "融合了2D手绘表现与3D空间推敲，非AI生成的纯手工数字化创作。重点在于色彩节奏与造型的精准控制。" 
    },
    "ai": { 
        tag: "AI Exploration", 
        desc: "基于 MJ/SD 的实验性尝试。通过 Prompt Engineering 探索视觉的随机性与工业生产力的边界。" 
    },
    "projects": { 
        tag: "Commercial Project", 
        desc: "这是一个完整的商业化落地案例。包含了需求分析、视觉推导、动效 demo 及最终实施方案。" 
    }
};

/* 鼠标环境光位移 */
window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    fluid.style.transform = `translate(${x}px, ${y}px)`;
});

/* 初始化主页 */
function renderHome() {
    app.innerHTML = `
        <div class="home-screen">
            <p class="sub">ARTIST & DESIGNER</p >
            <div class="title-wrap"><h1>NANCY</h1></div>
            <div class="title-wrap"><h1>PORTFOLIO</h1></div>
            <div class="nav-links">
                <a href=" " class="nav-link" onclick="renderGallery()">CREATIONS</a >
                <a href="#" class="nav-link" onclick="renderProjects()">PROJECTS</a >
            </div>
        </div>
    `;
    removeBack();
}

/* 渲染创作页：区分 Digital 与 AI */
function renderGallery() {
    app.innerHTML = `
        <div class="gallery-container">
            <button class="back-home" onclick="renderHome()">←</button>
            <div class="section-head">
                <h2>DIGITAL ART</h2>
                <p style="color:#444">Handcrafted 2D & 3D Visuals</p >
            </div>
            <div class="masonry-grid" id="grid-digital"></div>

            <div class="section-head">
                <h2>AI EXPLORATION</h2>
                <p style="color:#444">Prompt Engineering & Refinement</p >
            </div>
            <div class="masonry-grid" id="grid-ai"></div>
        </div>
    `;
    loadMasonry("creations/2d", "grid-digital", "digital");
    loadMasonry("creations/3d", "grid-digital", "digital"); // 2D 3D 整合
    loadMasonry("creations/ai", "grid-ai", "ai");
}

/* 渲染项目页：宽幅卡片布局 */
function renderProjects() {
    app.innerHTML = `
        <div class="gallery-container">
            <button class="back-home" onclick="renderHome()">←</button>
            <div class="section-head">
                <h2>CASE STUDIES</h2>
            </div>
            <div id="grid-projects"></div>
        </div>
    `;
    loadProjects("projects/projectA");
}

/* 瀑布流加载器 */
function loadMasonry(path, gridId, type) {
    const grid = document.getElementById(gridId);
    for (let i = 1; i <= 15; i++) {
        ["jpg", "mp4", "png"].forEach(ext => {
            const file = `assets/${path}/${i}.${ext}`;
            const isVideo = ext === "mp4";
            const el = isVideo ? document.createElement("video") : new Image();
            el.src = file;
            el.onload = el.onloadedmetadata = () => {
                const item = document.createElement("div");
                item.className = "item";
                const media = el.cloneNode();
                if(isVideo) { media.muted = true; media.loop = true; media.play(); }
                item.appendChild(media);
                grid.appendChild(item);
                item.onclick = () => openViewer(file, isVideo, type, `WORK #${i}`);
            };
            el.onerror = () => el.remove();
        });
    }
}

/* 项目加载器 */
function loadProjects(path) {
    const grid = document.getElementById("grid-projects");
    const item = document.createElement("div");
    item.className = "project-card";
    item.innerHTML = `
        < img src="assets/${path}/1.jpg" onerror="this.src='https://via.placeholder.com/1200x400'">
        <div class="project-info-overlay">
            <h3>PROJECT ALPHA</h3>
            <p>Brand Identity & 3D Motion</p >
        </div>
    `;
    item.onclick = () => openViewer(`assets/${path}/1.jpg`, false, "projects", "PROJECT ALPHA");
    grid.appendChild(item);
}

/* 查看器：支持扩散 */
function openViewer(src, isVideo, type, title) {
    const layer = document.getElementById("viewerLayer");
    const mediaBox = document.getElementById("viewerMedia");
    
    mediaBox.innerHTML = "";
    const el = isVideo ? document.createElement("video") : new Image();
    el.src = src;
    if (isVideo) { el.controls = true; el.autoplay = true; }
    mediaBox.appendChild(el);

    document.getElementById("vTitle").innerText = title;
    document.getElementById("vTag").innerText = CONTENT_MAP[type].tag;
    document.getElementById("vDesc").innerText = CONTENT_MAP[type].desc;

    layer.style.display = "block";
    setTimeout(() => layer.classList.add("active"), 10);
}

document.querySelector(".viewer-close").onclick = () => {
    const layer = document.getElementById("viewerLayer");
    layer.classList.remove("active");
    setTimeout(() => layer.style.display = "none", 500);
};

function removeBack() {
    const b = document.querySelector(".back-home");
    if(b) b.remove();
}

window.onload = renderHome;
