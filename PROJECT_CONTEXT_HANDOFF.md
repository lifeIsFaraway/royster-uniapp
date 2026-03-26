# Royster Lee 粉丝社区 App — 项目开发交接文档

> **使用说明：**
> 在新的对话中，只需让 AI 阅读本文档（或直接将本文档发给 AI），AI 即可完美继承当前项目的所有产品方向、技术规划与开发进度。

---

## 一、产品方向（已确认的核心设定）

**1. 核心定位**：围绕音乐人 Royster Lee 的年轻粉丝社区
**2. 核心飞轮**：听歌/互动 → 积攒灵感值/徽章 → 提升等级 → 解锁更多歌曲（共 30-50 首歌，无老粉通道，统一成长流程）
**3. 两大核心模块**：
- **「歌词击中了我」**：选中一段歌词，配上自己的感受与不同氛围背景，生成可打卡分享的精美卡片。
- **成就徽章与空间**：具有强仪式感的等级称号（初听者 -> 铁杆粉）和基于行为达成的特殊徽章（如：深夜灵魂、歌词探险家）。

---

## 二、技术架构与配置状态

**前端技术栈：** `uni-app` + `Vue3` + `TypeScript` + `Pinia` + `unibest 框架` + `unocss`

### 1. 路由与 Tabbar 架构（已配置完毕：CUSTOM_TABBAR）
- **🏠 首页** (`pages/home/index`)
- **🎵 歌库** (`pages/songs/index`)
- **📖 歌词流** (`pages/lyrics-feed/index`)
- **👤 我的** (`pages/profile/index`)
*引导页完毕后（`pages/guide/index.vue` 的 `goHome()`），将自动跳转到新首页。*

### 2. 分包架构（`subPackages`）已在 `vite.config.ts` 和 `pages.config.ts` 中注册
项目划分为 4 个核心业务子包（空骨架已建好）：
- `src/subPackages/song` (包含：歌曲详情 `detail`、完整歌词 `lyrics`、所有乐评 `review`、写乐评 `review-write`)
- `src/subPackages/lyric-card` (包含：建卡片 `create`、卡片详情 `detail`)
- `src/subPackages/profile` (包含：徽章墙 `badges`、我的卡片 `cards`、设置 `settings`)
- `src/subPackages/level` (包含：等级成长页 `index`)

### 3. TypeScript 数据类型（全部封装完成）
- `src/api/types/songs.ts`（歌曲及相关属性类型）
- `src/api/types/reviews.ts`（长短评论类型）
- `src/api/types/lyric-cards.ts`（歌词卡片类型）
- `src/api/types/growth.ts`（粉丝成长等级与灵感积分类型）
- `src/api/types/login.ts` 完成了补充（`IUserInfoRes` 包含了等级、积分、首听歌曲等属性）。

### 4. API 接口封装（已完成结构定义）
- `src/api/songs.ts`
- `src/api/reviews.ts`
- `src/api/lyric-cards.ts`
- `src/api/growth.ts`

### 5. Pinia 状态管理（已完成拉取逻辑封装）
- `src/store/song.ts`（用于管理当前歌曲列表、缓存和当前播放歌曲状态）
- `src/store/growth.ts`（用于管理用户成长等级、经验进度条演算机制、打卡和徽章情况）

---

## 三、开发进度 & 下一步开发计划

### 🟢 第一阶段：基础架构搭建（100% 已完成）
- [x] 配置所有的主路由和子路由分包，使其被 `vite-plugin-uni-pages` 正确生成。
- [x] 所有 Pinia 领域模型和数据请求类型的打底建立及依赖的 `import` 修复。
- [x] 开启极简暗黑风 Custom Tabbar 配置并且修正好了所有 `unocss` safelist 的 Icon 渲染。

### 🟡 第二阶段：歌曲库与详情（下一步的起步重点）
**在新会话中，我们的开发首要任务（按顺序即可开展）：**
- [ ] 开发 `pages/home/index.vue`（首页：展示产品飞轮引导、主打歌曲推荐和卡片 Feed 摘要）。
- [ ] 开发 `pages/songs/index.vue`（库页：全部歌曲，加入「对应用户 Level 等级的锁定面板层 UI」）。
- [ ] 开发 `src/subPackages/song/detail/index.vue`（黑胶唱片质感歌曲播放页、综合评分和心情标签组件）。
- [ ] 开发 `src/subPackages/song/lyrics/index.vue`（歌词同步滚动与高亮流）。

### ⚪ 第三阶段：歌词卡片（未来待做）
- [ ] 长按选段交互、氛围生成器渲染、前端海报生成逻辑等。

### ⚪ 第四、五阶段：成长体系与个人空间（未来待做）
- [ ] 等级提升的动效界面、徽章获取动画、个人主页的装扮系统和数据展示墙。

---

**给对接 AI 助手的提示语：**
你好，AI 伙伴！请仔细阅读上面的文档。我们在早期会话的探讨和第一阶段基础构建都已经完成了，代码模块架构建立完毕且非常清晰。
在当前会话中，我们的任务将直接从 **“🟡 第二阶段：开发 `pages/home/index.vue` 和 `pages/songs/index.vue`”** 开始着手落实！
开发时无需新建项目或模型，直接修改 Vue 页面即可。整个 App 的基调是：**深色调、极简、玻璃拟物化、重交互动效（如呼吸、阻尼等）** 的顶级高审美粉丝社区平台。请保持最高审美的标准下进行 UI 组件封装！
