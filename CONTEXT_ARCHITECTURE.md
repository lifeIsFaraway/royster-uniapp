# Royster-uniapp 上下文架构（持续开发基线）

> 本文档基于 `DEVELOPMENT_JOURNAL.md` 提炼，作为后续开发统一上下文入口。  
> 最后更新时间：2026-03-25

## 1. 项目目标与体验方向

- 目标：构建一个 Mobbin 风格的极简、高质感、多端 UniApp 应用。
- 体验关键词：大字号、强留白、轻阴影、少线框、清晰层级、微交互。
- 当前阶段：UI/交互样板已完成，业务数据与能力仍以 mock 为主，进入“模块化 + API 化”阶段。

## 2. 技术与架构基线

- 框架：Vue 3 + TypeScript（`<script setup lang="ts">`）
- 多端：uni-app + Vite
- 状态管理：Pinia
- 请求层：Alova
- 样式：UnoCSS（已沉淀 Mobbin 风 Token）
- 组件生态：含 `z-paging` 等列表能力

## 3. 已落地信息架构（页面与导航）

### 3.1 导航策略

- `src/tabbar/config.ts`：`tabbarStrategy = NO_TABBAR (0)`，当前由页面逻辑接管层级。
- 默认入口：`src/pages/guide/index.vue`（引导页）
- 引导结束：`uni.reLaunch` 回到首页 `src/pages/index/index.vue`

### 3.2 页面模块

- 引导页 `src/pages/guide/index.vue`
  - Swiper 沉浸引导
  - 文本箭头式底部交互（非传统按钮）
  - `pt-safe` / `pb-safe` 安全区适配
  - 背景超低透明度大数字水印

- 首页 `src/pages/index/index.vue`
  - 悬浮头像 FAB + 灵感点数
  - Hero 日期与时段问候
  - 签到模块 + 周历圆点状态
  - 日签弹窗（当前保存为模拟）
  - 音乐横滑推荐 + 底部悬浮播放器
  - 评论互动区（点赞/徽章/假输入框）

## 4. 设计系统约束（必须遵守）

统一使用 `uno.config.ts` 中 Mobbin Token，禁止随意新增视觉语义：

- 颜色：`mobbin-bg` / `mobbin-card` / `mobbin-text-main` / `mobbin-text-sub`
- 圆角：`rounded-mobbin-tag` / `rounded-mobbin-card` / `rounded-mobbin-card-lg`
- 阴影：`shadow-mobbin-sm` / `shadow-mobbin-hover`

开发约束：

- 优先 Token 类名，避免硬编码颜色值
- 交互动画保持“短、轻、克制”
- 视觉优先级靠排版与留白，不靠厚重阴影

## 5. 数据上下文与状态边界（现状 -> 目标）

### 5.1 当前本地状态（在首页）

- 签到：`isCheckedIn`、`weekDays`、`streakDays`
- 用户展示：`inspirationPoints`
- 内容流：`albums`、`comments`
- 弹层/播放：`showSignCard`、`nowPlaying`、`currentAlbum`

### 5.2 目标边界（建议）

- 页面本地状态：仅保留纯 UI 状态（开关、选中态、动画态）
- 业务状态：逐步迁移至 Pinia（用户、签到、内容流）
- 数据获取：统一经 `src/api/*` + Alova 封装

## 6. 模块拆分路线（后续优先）

目标：减少 `src/pages/index/index.vue` 体积，提升复用与可测试性。

- `src/components/home/HeroDateCard.vue`
- `src/components/home/CheckInPanel.vue`
- `src/components/home/SignPosterModal.vue`
- `src/components/home/AlbumCard.vue`
- `src/components/home/NowPlayingBar.vue`
- `src/components/home/CommentList.vue`

拆分原则：

- 单组件单职责
- Props 输入明确、事件输出明确
- 避免组件内直接请求 API

## 7. API 对接路线（按业务域推进）

第一批接口（建议先打通）：

- 用户信息：积分、头像、昵称
- 签到信息：今日状态、周历、连击天数、签到动作
- 推荐专辑：列表 + 播放基础信息
- 评论列表：列表、点赞动作

接口落位建议：

- `src/api/user.ts`
- `src/api/checkin.ts`
- `src/api/music.ts`
- `src/api/comment.ts`

## 8. 关键待办（与日志对齐）

- 将首页硬编码数据替换为真实请求绑定
- 把 `saveSignCard()` 从 Toast 模拟升级为真实保存链路
- 进入多主页面时评估并恢复/定制 Tabbar 策略
- 将首页高复用 UI 模块抽离为组件

## 9. 开发流程基准（每次迭代遵守）

1. 明确本次改动边界（页面、组件、API、状态）
2. 先补/改类型，再落请求封装，再接页面
3. 只在必要范围改动，避免“顺手大改”
4. 自测交互与多端兼容（尤其安全区、滚动、弹层）
5. 更新本文件与 `DEVELOPMENT_JOURNAL.md` 关键结论

## 10. 下一步默认执行清单（可直接进入开发）

1. 首页拆分第一批组件：`CheckInPanel` + `AlbumCard` + `NowPlayingBar`
2. 新增 `checkin/music/comment` API 文件并定义类型
3. 用接口返回替换首页 mock 数据（保留兜底占位）
4. 预留 Tabbar 策略切换开关（便于后续多页面扩展）

