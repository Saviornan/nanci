const app = document.getElementById("app");
let lang = "cn"; 
let CONTENT_DATA = {};
let currentQueue = [];
let currentIndex = 0;
let typeInterval = null; // 修复打字机重叠 Bug

/* 初始化：读取配置 */
async function init() {
    try {
        const res = await fetch('content.json');
        CONTENT_DATA = await res.json();
        setupGlobal();
        renderHome();
    } catch (e) {
        console.error("加载 content.json 失败，请确保在本地服务器环境下运行", e);
    }
}

/* 全局交互绑定 */
function setupGlobal() {
    const btnLang = document.getElementById("btn-lang");
    const btnAbout = document.getElementById("btn-about");

    btnLang.onclick = () => {
        lang = lang === "en" ? "cn" : "en";
        btnLang.innerText = CONTENT_DATA.header.lang[lang];
        renderHome();
    };
    btnAbout.innerText = CONTENT_DATA.header.about[lang];
    btnAbout.onclick = () => renderAbout();
}

/* 首页渲染 */
function renderHome() {
    app.innerHTML = `
        <div class="home-screen">
            <h1 id="home-title"></h1>
            <div class="nav-links" id="home-links">
                <a href=" " id="link-creations">${CONTENT_DATA.header.creations[lang]}</a >
                <a href="#" id="link-projects">${CONTENT_DATA.header.projects[lang]}</a >
            </div>
        </div>
    `;

    // 使用更安全的事件绑定，绕过浏览器拦截
    document.getElementById("link-creations").onclick = (e) => { 
        e.preventDefault(); // 阻止页面刷新跳转
        renderCreations(); 
    };
    document.getElementById("link-projects").onclick = (e) => { 
        e.preventDefault(); 
        renderProjects(); 
    };

    const titleText = lang === "en" ? "NANCY'S ARCHIVE" : "楠茜的艺术存档";
    typeWriter(document.getElementById("home-title"), titleText, 80, () => {
        document.getElementById("home-links").classList.add("active");
    });
}

/* 个人创作：瀑布流混合展示 */
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
    
    const filterBar = document.getElementById("filter-bar");
    
    // 增加数据保护：如果 content.json 里不小心删掉了 creations，也不会白屏
    if (CONTENT_DATA.creations && Array.isArray(CONTENT_DATA.creations)) {
        CONTENT_DATA.creations.forEach(cat => {
            const span = document.createElement('span');
            span.innerText = cat.title[lang].toUpperCase();
            span.onclick = (e) => filterGallery(cat.tag, e.target);
            filterBar.appendChild(span);
            
            // 加载该分类下的作品
            loadMixItems(cat.folder, cat.tag);
        });
    } else {
        console.error("读取作品数据失败，请检查 content.json 中是否正确包含 creations 数组！");
    }
}

// 核心加载器（自动过滤失效路径）
function loadMixItems(folderPath, tag) {
    const grid = document.getElementById("main-masonry");
    for (let i = 1; i <= 15; i++) {
        ["jpg", "mp4"].forEach(ext => {
            const fileUrl = `${folderPath}/${i}.${ext}`;
            const fileKey = `${folderPath.replace('assets/', '')}/${i}`; // 生成用于匹配 JSON 数据库的 key
            
            const isVid = ext === "mp4";
            const temp = isVid ? document.createElement("video") : new Image();
            temp.src = fileUrl;

            // 只有成功加载的资源才会添加到页面
            temp.onload = temp.onloadedmetadata = () => {
                const div = document.createElement("div");
                div.className = `item ${tag}`;
                div.innerHTML = isVid ? `<video src="${fileUrl}" muted loop autoplay data-key="${fileKey}"></video>` : `< img src="${fileUrl}" data-key="${fileKey}">`;
                grid.appendChild(div);
                
                div.onclick = () => openViewer(fileUrl);
            };
            temp.onerror = () => temp.remove();
        });
    }
}

/* 标签过滤逻辑 */
function filterGallery(tag, el) {
    document.querySelectorAll('.filter-bar span').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    
    document.querySelectorAll('.item').forEach(item => {
        if (tag === 'all' || item.classList.contains(tag)) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 10);
        } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 400);
        }
    });
}

/* 查看器：支持容错的数据读取 */
function openViewer(clickedSrc) {
    // 【Bug 修复】重组队列，仅将当前页面未隐藏的元素加入，防止翻页时翻到被隐藏分类的图
    const visibleItems = Array.from(document.querySelectorAll('.item')).filter(el => el.style.display !== 'none');
    
    currentQueue = visibleItems.map(el => {
        const media = el.querySelector('img, video');
        return {
            src: media.src,
            isVideo: media.tagName === 'VIDEO',
            key: media.getAttribute('data-key')
        };
    });

    currentIndex = currentQueue.findIndex(q => q.src.includes(clickedSrc));
    updateViewer(currentQueue[currentIndex]);
    document.getElementById("viewerLayer").classList.add("active");
}

function updateViewer(data) {
    const mBox = document.getElementById("viewerMedia");
    mBox.innerHTML = data.isVideo ? `<video src="${data.src}" controls autoplay></video>` : `< img src="${data.src}">`;

    // 数据库匹配 (如果没有填写描述，提供默认值，防止报错)
    const dbInfo = (CONTENT_DATA.db && CONTENT_DATA.db[data.key]) ? CONTENT_DATA.db[data.key][lang] : null;
    document.getElementById("vTitle").innerText = dbInfo ? dbInfo.title : "Untitled";
    document.getElementById("vDesc").innerText = dbInfo ? dbInfo.desc : "No description available.";
}

// 翻页按键
document.getElementById("vNext").onclick = () => { currentIndex = (currentIndex + 1) % currentQueue.length; updateViewer(currentQueue[currentIndex]); };
document.getElementById("vPrev").onclick = () => { currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length; updateViewer(currentQueue[currentIndex]); };
document.querySelector(".viewer-close").onclick = () => document.getElementById("viewerLayer").classList.remove("active");

/* 项目展示 (长卷式阅读) */
function renderProjects() {
    app.innerHTML = `
        <div class="gallery-container">
            <button class="back-btn" onclick="renderHome()">←</button>
            <div class="project-list" id="project-list"></div>
        </div>
    `;
    const list = document.getElementById("project-list");
    CONTENT_DATA.projects.forEach(proj => {
        const div = document.createElement("div");
        div.className = "project-entry";
        div.innerHTML = `
            < img class="cover" src="${proj.folder}/1.jpg" onerror="this.src='https://via.placeholder.com/1600x800?text=Project+Cover'">
            <h3>${proj.title[lang]}</h3>
        `;
        div.onclick = () => openProjectDetail(proj);
        list.appendChild(div);
    });
}

function openProjectDetail(proj) {
    const layer = document.getElementById("projectLayer");
    
    // 将项目内的 detail 数组转为 html
    let mediaHtml = (proj.details || []).map(file => {
        return file.endsWith('.mp4') 
            ? `<video src="${proj.folder}/${file}" controls></video>` 
            : `< img src="${proj.folder}/${file}">`;
    }).join('');

    layer.innerHTML = `
        <button class="close-proj viewer-close" onclick="this.parentElement.classList.remove('active')">✕ CLOSE</button>
        <div class="proj-inner">
            <div class="proj-header">
                <h1>${proj.title[lang]}</h1>
                <p>${proj.desc ? proj.desc[lang] : ''}</p >
            </div>
            <div class="proj-content">${mediaHtml}</div>
        </div>
    `;
    layer.classList.add("active");
}

/* 关于我 */
function renderAbout() {
    const aboutData = CONTENT_DATA.about[0];
    app.innerHTML = `
        <div class="home-screen" style="flex-direction:row; gap:80px; text-align:left;">
            <button class="back-btn" onclick="renderHome()">←</button>
            < img src="${aboutData.media}" style="width:300px; height:400px; object-fit:cover; filter:grayscale(0.5);">
            <div style="max-width:400px;">
                <h1 style="font-size:30px; margin-bottom:20px; letter-spacing:2px;">${CONTENT_DATA.header.about[lang]}</h1>
                <p style="line-height:2; color:#555;">${aboutData.text[lang]}</p >
            </div>
        </div>
    `;
}

/* 辅助：打字机效果 (自带排爆机制) */
function typeWriter(el, text, speed, cb) {
    if (typeInterval) clearInterval(typeInterval); // 清除旧定时器，防止重叠
    el.innerHTML = ""; 
    let i = 0;
    typeInterval = setInterval(() => {
        el.innerHTML += text[i++];
        if(i >= text.length) { clearInterval(typeInterval); if(cb) cb(); }
    }, speed);
}

// 启动
init();
