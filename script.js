/**
 * NANCY PORTFOLIO - FINAL STABLE VERSION
 */

const app = document.getElementById("app");
let lang = "cn"; 
let CONTENT_DATA = {};
let currentQueue = [];
let currentIndex = 0;

// 启动
window.onload = () => {
    init();
};

async function init() {
    try {
        const res = await fetch('content.json');
        CONTENT_DATA = await res.json();
        setupGlobalButtons();
        renderHome();
    } catch (e) {
        console.error("JSON加载失败");
    }
}

function setupGlobalButtons() {
    const btnLang = document.getElementById("btn-lang");
    const btnAbout = document.getElementById("btn-about");
    btnLang.onclick = () => {
        lang = lang === "en" ? "cn" : "en";
        btnLang.innerText = CONTENT_DATA.header.lang[lang];
        btnAbout.innerText = CONTENT_DATA.header.about[lang];
        renderHome();
    };
    btnAbout.onclick = renderAbout;
}

function renderHome() {
    app.innerHTML = `
        <div class="home-screen">
            <h1 id="home-title">NANCY ARCHIVE</h1>
            <div class="nav-links" id="home-links" style="opacity:1">
                <a href=" " onclick="renderCreations();return false;">${CONTENT_DATA.header.creations[lang]}</a >
                <a href="#" onclick="renderProjects();return false;">${CONTENT_DATA.header.projects[lang]}</a >
            </div>
        </div>
    `;
}

function renderCreations() {
    app.innerHTML = `
        <div class="gallery-container">
            <button class="back-btn" onclick="renderHome()">←</button>
            <div class="filter-bar" id="filter-bar">
                <span class="active" onclick="filterGallery('all', this)">ALL</span>
            </div>
            <div class="masonry" id="main-masonry"></div>
        </div>
    `;

    CONTENT_DATA.creations.forEach(cat => {
        const span = document.createElement('span');
        span.innerText = cat.title[lang].toUpperCase();
        span.onclick = (e) => filterGallery(cat.tag, e.target);
        document.getElementById("filter-bar").appendChild(span);

        // 探测加载 1-15 号
        for (let i = 1; i <= 15; i++) {
            ["jpg", "png", "mp4"].forEach(ext => {
                const url = `${cat.folder}/${i}.${ext}`;
                const dbKey = `${cat.folder.replace('assets/', '')}/${i}`;
                
                if (ext === "mp4") {
                    const v = document.createElement("video");
                    v.src = url;
                    v.onloadedmetadata = () => addItem(v, url, dbKey, cat.tag, true);
                } else {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => addItem(img, url, dbKey, cat.tag, false);
                }
            });
        }
    });
}

function addItem(el, url, key, tag, isVid) {
    const grid = document.getElementById("main-masonry");
    if (!grid || grid.querySelector(`[data-path="${url}"]`)) return;

    const div = document.createElement("div");
    div.className = `item ${tag}`;
    div.setAttribute("data-path", url);
    
    div.innerHTML = isVid 
        ? `<video src="${url}" muted loop autoplay></video>` 
        : `< img src="${url}">`;
    
    div.onclick = () => openViewer(url, isVid, key);
    grid.appendChild(div);
}

function openViewer(src, isVid, key) {
    const layer = document.getElementById("viewerLayer");
    const mBox = document.getElementById("viewerMedia");
    
    mBox.innerHTML = isVid 
        ? `<video src="${src}" controls autoplay></video>` 
        : `< img src="${src}">`;

    const info = (CONTENT_DATA.db && CONTENT_DATA.db[key]) 
        ? CONTENT_DATA.db[key][lang] 
        : { title: "WORKS", desc: "" };

    document.getElementById("vTitle").innerText = info.title;
    document.getElementById("vDesc").innerText = info.desc;
    
    layer.style.display = "flex";
    layer.classList.add("active");
}

// 简单的关闭函数
document.querySelector(".viewer-close").onclick = () => {
    const layer = document.getElementById("viewerLayer");
    layer.style.display = "none";
    document.getElementById("viewerMedia").innerHTML = ""; // 停止视频播放
};

// 过滤功能
function filterGallery(tag, el) {
    document.querySelectorAll('.filter-bar span').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.item').forEach(item => {
        if (tag === 'all' || item.classList.contains(tag)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 项目页
function renderProjects() {
    app.innerHTML = `<div class="gallery-container"><button class="back-btn" onclick="renderHome()">←</button><div class="project-list" id="project-list"></div></div>`;
    CONTENT_DATA.projects.forEach(proj => {
        const div = document.createElement("div");
        div.className = "project-entry";
        div.innerHTML = `< img src="${proj.folder}/1.jpg" class="cover"><h3>${proj.title[lang]}</h3>`;
        div.onclick = () => {
            const layer = document.getElementById("projectLayer");
            const media = proj.details.map(f => f.endsWith('.mp4') ? `<video src="${proj.folder}/${f}" controls></video>` : `< img src="${proj.folder}/${f}">`).join('');
            layer.innerHTML = `<button class="viewer-close" onclick="this.parentElement.style.display='none'">✕ CLOSE</button><div class="proj-inner"><h1>${proj.title[lang]}</h1><p>${proj.desc[lang]}</p >${media}</div>`;
            layer.style.display = "block";
            layer.classList.add("active");
        };
        document.getElementById("project-list").appendChild(div);
    });
}

function renderAbout() {
    const d = CONTENT_DATA.about[0];
    app.innerHTML = `<div class="home-screen" style="flex-direction:row; padding:0 10%;"><button class="back-btn" onclick="renderHome()">←</button>< img src="${d.media}" style="width:300px; margin-right:50px;"><div style="text-align:left;"><h2>ABOUT</h2><p>${d.text[lang]}</p ></div></div>`;
}
