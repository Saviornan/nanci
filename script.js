/**
 * NANCY PORTFOLIO - GITHUB PRECISION VERSION
 */

const app = document.getElementById("app");
let lang = "cn"; 
let CONTENT_DATA = {};
let currentQueue = [];
let currentIndex = 0;
let typeInterval = null;

async function init() {
    try {
        const res = await fetch('content.json');
        if (!res.ok) throw new Error("Missing content.json");
        CONTENT_DATA = await res.json();
        setupGlobalButtons();
        renderHome();
    } catch (e) {
        console.error("Initialization failed:", e);
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
    btnAbout.innerText = CONTENT_DATA.header.about[lang];
    btnAbout.onclick = renderAbout;
}

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
    document.getElementById("to-creations").onclick = (e) => { e.preventDefault(); renderCreations(); };
    document.getElementById("to-projects").onclick = (e) => { e.preventDefault(); renderProjects(); };

    const titleText = lang === "en" ? "NANCY'S ARCHIVE" : "楠茜的艺术存档";
    typeWriter(document.getElementById("home-title"), titleText, 80, () => {
        document.getElementById("home-links").classList.add("active");
    });
}

function renderCreations() {
    app.innerHTML = `
        <div class="gallery-container">
            <button class="back-btn" onclick="renderHome()">←</button>
            <div class="filter-bar" id="filter-bar">
                <span class="active" data-tag="all">ALL</span>
            </div>
            <div class="masonry" id="main-masonry"></div>
        </div>
    `;

    const filterBar = document.getElementById("filter-bar");
    filterBar.querySelector('[data-tag="all"]').onclick = (e) => filterGallery('all', e.target);

    CONTENT_DATA.creations.forEach(cat => {
        // 生成标签
        const span = document.createElement('span');
        span.innerText = cat.title[lang].toUpperCase();
        span.onclick = (e) => filterGallery(cat.tag, e.target);
        filterBar.appendChild(span);

        // 精准加载文件
        if (cat.files) {
            cat.files.forEach(fileName => {
                const fileUrl = `${cat.folder}/${fileName}`;
                const dbKey = `${cat.folder.replace('assets/', '')}/${fileName.split('.')[0]}`;
                const isVid = fileName.toLowerCase().endsWith('.mp4');

                const div = document.createElement("div");
                div.className = `item ${cat.tag}`;
                if (isVid) {
                    div.innerHTML = `<video src="${fileUrl}" muted loop autoplay data-key="${dbKey}"></video>`;
                } else {
                    div.innerHTML = `< img src="${fileUrl}" data-key="${dbKey}">`;
                }
                div.onclick = () => openViewer(fileUrl);
                document.getElementById("main-masonry").appendChild(div);
            });
        }
    });
}

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

function openViewer(src) {
    const visible = Array.from(document.querySelectorAll('.item')).filter(el => el.style.display !== 'none');
    currentQueue = visible.map(el => {
        const m = el.querySelector('img, video');
        return { src: m.src, isVid: m.tagName === 'VIDEO', key: m.getAttribute('data-key') };
    });
    currentIndex = currentQueue.findIndex(q => q.src.includes(src));
    updateViewer();
    document.getElementById("viewerLayer").classList.add("active");
}

function updateViewer() {
    const data = currentQueue[currentIndex];
    const mBox = document.getElementById("viewerMedia");
    mBox.innerHTML = data.isVid ? `<video src="${data.src}" controls autoplay></video>` : `< img src="${data.src}">`;
    const info = (CONTENT_DATA.db && CONTENT_DATA.db[data.key]) ? CONTENT_DATA.db[data.key][lang] : { title: "Works", desc: "" };
    document.getElementById("vTitle").innerText = info.title;
    document.getElementById("vDesc").innerText = info.desc;
}

function renderProjects() {
    app.innerHTML = `<div class="gallery-container"><button class="back-btn" onclick="renderHome()">←</button><div class="project-list" id="project-list"></div></div>`;
    CONTENT_DATA.projects.forEach(proj => {
        const div = document.createElement("div");
        div.className = "project-entry";
        div.innerHTML = `< img class="cover" src="${proj.folder}/1.jpg"><h3>${proj.title[lang]}</h3>`;
        div.onclick = () => openProject(proj);
        document.getElementById("project-list").appendChild(div);
    });
}

function openProject(proj) {
    const layer = document.getElementById("projectLayer");
    const media = proj.details.map(f => f.endsWith('.mp4') ? `<video src="${proj.folder}/${f}" controls></video>` : `< img src="${proj.folder}/${f}">`).join('');
    layer.innerHTML = `<button class="viewer-close" onclick="this.parentElement.classList.remove('active')">✕ CLOSE</button><div class="proj-inner"><div class="proj-header"><h1>${proj.title[lang]}</h1><p>${proj.desc[lang]}</p ></div><div class="proj-content">${media}</div></div>`;
    layer.classList.add("active");
}

function renderAbout() {
    const d = CONTENT_DATA.about[0];
    app.innerHTML = `<div class="home-screen" style="flex-direction:row; gap:50px; padding:0 10%; text-align:left;"><button class="back-btn" onclick="renderHome()">←</button>< img src="${d.media}" style="width:300px;"><div style="max-width:450px;"><h2>${CONTENT_DATA.header.about[lang]}</h2><p>${d.text[lang]}</p ></div></div>`;
}

function typeWriter(el, text, speed, cb) {
    if (typeInterval) clearInterval(typeInterval);
    el.innerHTML = ""; let i = 0;
    typeInterval = setInterval(() => {
        el.innerHTML += text[i++];
        if (i >= text.length) { clearInterval(typeInterval); if (cb) cb(); }
    }, speed);
}

document.getElementById("vNext").onclick = () => { currentIndex = (currentIndex + 1) % currentQueue.length; updateViewer(); };
document.getElementById("vPrev").onclick = () => { currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length; updateViewer(); };
document.querySelector(".viewer-close").onclick = () => document.getElementById("viewerLayer").classList.remove("active");

window.onload = init;
