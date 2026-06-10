# 资产文件夹

## 文件夹结构

```
assets/
├── avatar/              # 个人照片
│   └── photo.jpg        # 个人简介页头像
│
├── works/               # 个人作品（对应 Works 页面）
│   ├── 2d/              # 2D 作品
│   │   ├── 01.jpg
│   │   ├── 02.jpg
│   │   └── 03.jpg
│   │
│   ├── 3d/              # 3D 作品
│   │   ├── 01.jpg
│   │   ├── 02.jpg
│   │   └── 03.jpg
│   │
│   ├── ai/              # AI 作品
│   │   ├── 01.jpg
│   │   ├── 02.jpg
│   │   └── 03.jpg
│   │
│   └── motion/          # 动态 / 视频作品
│       ├── 01.jpg
│       ├── 02.jpg
│       └── 03.jpg
│
├── projects/            # 项目资产（每个项目一个文件夹）
│   ├── 01/              # 漫威争锋
│   │   └── shot1.jpg
│   │
│   ├── 02/              # 星痕共鸣
│   │   └── shot1.jpg
│   │
│   ├── 03/              # 仙王第五季
│   │   ├── cover.jpg
│   │   ├── shot1.jpg
│   │   └── shot2.jpg
│   │
│   ├── 04/              # 狐妖小红娘
│   │   ├── cover.jpg
│   │   ├── shot1.jpg
│   │   └── shot2.jpg
│   │
│   └── 05/              # 原创IP项目
│       ├── cover.jpg
│       ├── shot1.jpg
│       └── shot2.jpg
│
└── README.md
```

## 规则

### 个人作品（Works 页面）

Works 页面会按命名规则**自动探测并显示**素材，不需要每次手动告诉数量：

| 文件夹 | 对应标签 | 说明 |
|--------|---------|------|
| `works/2d/` | 2D | 2D 原画、插画、漫画、角色设计等 |
| `works/3d/` | 3D | 3D 角色、场景、模型渲染等 |
| `works/ai/` | AI创作 | AI生图、AI视频等 |
| `works/motion/` | 动态 | 动画片段、动图、视频作品等 |

- 文件命名：`01.jpg`、`02.png`、`03.gif`、`04.mp4`... 按展示顺序
- 支持格式：`.jpg`、`.jpeg`、`.png`、`.webp`、`.gif`、`.mp4`
- 每个分类默认自动检测 `01` 到 `20`
- 视频会静音、循环、自动播放

示例：

```text
assets/works/2d/01.jpg
assets/works/2d/02.gif
assets/works/3d/01.mp4
assets/works/ai/01.webp
assets/works/motion/01.mp4
```

### 项目资产（Projects 页面）

| 项目 | 文件夹 | 封面 | 截图 |
|------|--------|------|------|
| 漫威争锋 | `01/` | 视频自动播放 | `shot1.jpg` |
| 星痕共鸣 | `02/` | 视频自动播放 | `shot1.jpg` |
| 仙王第五季 | `03/` | `cover.jpg` | `shot1.jpg`、`shot2.jpg` |
| 狐妖小红娘 | `04/` | `cover.jpg` | `shot1.jpg`、`shot2.jpg` |
| 原创IP | `05/` | `cover.jpg` | `shot1.jpg`、`shot2.jpg` |

- 有视频链接的项目：封面自动播放视频，不需要 `cover.jpg`
- 无视频链接的项目：需要上传 `cover.jpg` 作为封面
- `shot1.jpg`、`shot2.jpg`：弹窗轮播中展示的截图
- 图片格式：`.jpg` 或 `.png`
