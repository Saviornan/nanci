/**
 * NANCY PORTFOLIO - CORE LOGIC 2026
 * 修复：图片加载兼容性、安全事件绑定、动态过滤队列
 */

const app = document.getElementById("app");
let lang = "cn"; 
let CONTENT_DATA = {};
let currentQueue = [];
let currentIndex = 0;
let typeInterval = null;

// 初始化
async function init() {
    try {
        const res = await fetch('content.json');
        if (!res.ok) throw new Error("无法读取 content.json");
        CONTENT_DATA = await res.json();
        
        setupGlobalButtons();
        renderHome();
    } catch (e) {
        console.error("初始化失败:", e);
        app.innerHTML = `<div style="padding:100px; text-align:center;">Load Error: 请检查 content.json 路径及格式。</div>`;
    }
}

// 全局静态按钮绑定
function setupGlobalButtons() {
    const btnLang = document.getElementById("btn-lang");
    const btnAbout = document.getElementById("btn-about");

    btnLang.onclick = () => {
        lang = lang === "en" ? "cn" : "en";
        btnLang.innerText = CONTENT_DATA.header.lang[lang];
        btnAbout.innerText = CONTENT_DATA.header.about[lang];
        renderHome();
    };
    
    btnAbout.innerText = CONTENT_DATA.header.about[lang];
    btnAbout.onclick = (e) => {
        e.preventDefault();
        renderAbout();
    };
}

// 首页
function renderHome() {
    app.innerHTML = `
        <div class="home-screen">
            <h1 id="home-title"></h1>
            <div class="nav-links" id="home-links">
                <a href=" " id="to-creations">${CONTENT_DATA.header.creations[lang]}</a >
                <a href="#" id="to-projects">${CONTENT_DATA.header.projects[lang]}</a >
            </div>
        </div>
    `;

    // 绑定导航事件 (替代 href="javascript:...")
    document.getElementById("to-creations").onclick = (e) => { e.preventDefault(); renderCreations(); };
    document.getElementById("to-projects").onclick = (e) => { e.preventDefault(); renderProjects(); };

    const titleText = lang === "en" ? "NANCY'S ARCHIVE" : "楠茜的艺术存档";
    typeWriter(document.getElementById("home-title"), titleText, 80, () => {
        document.getElementById("home-links").classList.add("active");
    });
}

// 个人创作页
function renderCreations() {
    app.innerHTML = `
        <div class="gallery-container">
            <button class="back-btn" id="back-home">←</button>
            <div class="filter-bar" id="filter-bar">
                <span class="active" data-tag="all">ALL</span>
            </div>
            <div class="masonry" id="main-masonry"></div>
        </div>
    `;

    document.getElementById("back-home").onclick = renderHome;

    const filterBar = document.getElementById("filter-bar");
    
    // 动态生成标签并加载
    if (CONTENT_DATA.creations) {
        CONTENT_DATA.creations.forEach(cat => {
            const span = document.createElement('span');
            span.innerText = cat.title[lang].toUpperCase();
            span.setAttribute('data-tag', cat.tag);
            span.onclick = (e) => filterGallery(cat.tag, e.target);
            filterBar.appendChild(span);

            loadFolderMedia(cat.folder, cat.tag);
        });
    }

    // “ALL” 标签的点击事件
    filterBar.querySelector('[data-tag="all"]').onclick = (e) => filterGallery('all', e.target);
}

// 混合媒体加载逻辑 (核心修复)
function loadFolderMedia(folderPath, tag) {
    const grid = document.getElementById("main-masonry");
    const exts = ["jpg", "png", "webp", "mp4"];

    // 尝试读取每个文件夹下的 1-15 号文件
    for (let i = 1; i <= 15; i++) {
        exts.forEach(ext => {
            const fileUrl = `${folderPath}/${i}.${ext}`;
            // 生成用于匹配 db 的 key，例如 "creations/2d/1"
            const dbKey = `${folderPath.replace('assets/', '')}/${i}`;
            const isVid = ext === "mp4";

            if (isVid) {
                const v = document.createElement("video");
                v.src = fileUrl;
                v.onloadedmetadata = () => createMediaItem(grid, v, fileUrl, dbKey, tag, true);
                v.onerror = () => v.remove();
            } else {
                const img = new Image();
                img.src = fileUrl;
                img.onload = () => createMediaItem(grid, img, fileUrl, dbKey, tag, false);
                img.onerror = () => img.remove();
            }
        });
    }
}

function createMediaItem(grid, el, url, key, tag, isVid) {
    const div = document.createElement("div");
    div.className = `item ${tag}`;
    
    if (isVid) {
        div.innerHTML = `<video src="${url}" muted loop autoplay data-key="${key}"></video>`;
    } else {
        div.innerHTML = `< img src="${url}" data-key="${key}">`;
    }

    div.onclick = () => openViewer(url);
    grid.appendChild(div);
}

// 过滤功能
function filterGallery(tag, el) {
    document.querySelectorAll('.filter-bar span').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    
    document.querySelectorAll('.item').forEach(item => {
        if (tag === 'all' || item.classList.contains(tag)) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 10);
        } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
        }
    });
}

// 查看器逻辑
function openViewer(src) {
    // 动态捕获当前【可见】的所有作品，作为翻页队列
    const visibleElements = Array.from(document.querySelectorAll('.item'))
                                 .filter(el => el.style.display !== 'none');
    
    currentQueue = visibleElements.map(el => {
        const media = el.querySelector('img, video');
        return {
            src: media.src,
            isVid: media.tagName === 'VIDEO',
            key: media.getAttribute('data-key')
        };
    });

    currentIndex = currentQueue.findIndex(q => q.src === src);
    updateViewerContent();
    document.getElementById("viewerLayer").classList.add("active");
}

function updateViewerContent() {
    const data = currentQueue[currentIndex];
    const mBox = document.getElementById("viewerMedia");
    
    mBox.innerHTML = data.isVid 
        ? `<video src="${data.src}" controls autoplay></video>` 
        : `< img src="${data.src}">`;

    // 匹配文字
    const info = (CONTENT_DATA.db && CONTENT_DATA.db[data.key]) 
                 ? CONTENT_DATA.db[data.key][lang] 
                 : { title: "WORKS", desc: "No record found." };

    document.getElementById("vTitle").innerText = info.title;
    document.getElementById("vDesc").innerText = info.desc;
}

// 项目页逻辑
function renderProjects() {
    app.innerHTML = `
        <div class="gallery-container">
            <button class="back-btn" id="back-home-p">←</button>
            <div class="project-list" id="project-list"></div>
        </div>
    `;
    document.getElementById("back-home-p").onclick = renderHome;

    const list = document.getElementById("project-list");
    CONTENT_DATA.projects.forEach(proj => {
        const div = document.createElement("div");
        div.className = "project-entry";
        div.innerHTML = `
            < img class="cover" src="${proj.folder}/1.jpg" onerror="this.src='https://via.placeholder.com/1200x600?text=Cover'">
            <h3>${proj.title[lang]}</h3>
        `;
        div.onclick = () => openProjectDetail(proj);
        list.appendChild(div);
    });
}

function openProjectDetail(proj) {
    const layer = document.getElementById("projectLayer");
    const mediaHtml = (proj.details || []).map(f => {
        return f.endsWith('.mp4') 
            ? `<video src="${proj.folder}/${f}" controls></video>` 
            : `< img src="${proj.folder}/${f}">`;
    }).join('');

    layer.innerHTML = `
        <button class="viewer-close" id="close-proj-btn">✕ CLOSE</button>
        <div class="proj-inner">
            <div class="proj-header">
                <h1>${proj.title[lang]}</h1>
                <p>${proj.desc ? proj.desc[lang] : ""}</p >
            </div>
            <div class="proj-content">${mediaHtml}</div>
        </div>
    `;
    layer.classList.add("active");
    document.getElementById("close-proj-btn").onclick = () => layer.classList.remove("active");
}

// 关于我
function renderAbout() {
    const data = CONTENT_DATA.about[0];
    app.innerHTML = `
        <div class="home-screen" style="flex-direction:row; gap:60px; text-align:left; padding:0 10%;">
            <button class="back-btn" onclick="renderHome()">←</button>
            < img src="${data.media}" style="width:300px; height:450px; object-fit:cover;">
            <div style="max-width:500px;">
                <h2 style="font-weight:300; margin-bottom:20px; letter-spacing:3px;">${CONTENT_DATA.header.about[lang]}</h2>
                <p style="line-height:2.2; color:#555;">${data.text[lang]}</p >
            </div>
        </div>
    `;
}

// 辅助：打字机
function typeWriter(el, text, speed, cb) {
    if (typeInterval) clearInterval(typeInterval);
    el.innerHTML = "";
    let i = 0;
    typeInterval = setInterval(() => {
        el.innerHTML += text[i++];
        if (i >= text.length) {
            clearInterval(typeInterval);
            if (cb) cb();
        }
    }, speed);
}

// Lightbox 控制绑定
document.getElementById("vNext").onclick = () => { currentIndex = (currentIndex + 1) % currentQueue.length; updateViewerContent(); };
document.getElementById("vPrev").onclick = () => { currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length; updateViewerContent(); };
document.querySelector(".viewer-close").onclick = () => document.getElementById("viewerLayer").classList.remove("active");

// 启动
window.onload = init;
