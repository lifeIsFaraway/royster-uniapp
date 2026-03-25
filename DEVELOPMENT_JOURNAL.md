# Royster-uniapp 开发进度与上下文记录

本文档用于记录项目从初始化到目前的开发进度、架构调整、以及核心模块的设计规范，以帮助后续开发时无缝衔接。

## 1. 核心技术栈分析
当前项目使用了高度定制化的 `unibest` 模板，核心技术栈如下：
* **框架**: Vue 3 + TypeScript
* **多端编译**: uni-app + Vite
* **样式方案**: UnoCSS (原子化 CSS)
* **状态管理**: Pinia
* **请求库**: Alova
* **其他组件**: 诸如 `z-paging` 等高级列表组件

## 2. 核心设计规范 (Design Tokens)
项目整体借鉴了 **Mobbin.com** 的极简审美，抛弃了繁杂的线框与重度阴影，主张通过大字号排版与极强的负空间（留白）来构建高级感。

所有对应的设计 Tokens 已在 `uno.config.ts` 中完成沉淀，开发中**强推使用专属前缀**：
* **颜色**:
  * `mobbin-bg`: `#FAFAFA` (全局背景)
  * `mobbin-card`: `#FFFFFF` (卡片背景)
  * `mobbin-text-main`: `#111111` (强调字、主标题)
  * `mobbin-text-sub`: `#777777` (次要描述)
* **圆角**:
  * `rounded-mobbin-tag`: `12rpx` (小标签)
  * `rounded-mobbin-card`: `24rpx` (一般卡片)
  * `rounded-mobbin-card-lg`: `40rpx` (英雄卡、主视觉卡)
* **阴影**:
  * `shadow-mobbin-sm`: `0 2px 10px rgba(0, 0, 0, 0.03)` (常驻浅阴影)
  * `shadow-mobbin-hover`: `0 10px 30px rgba(0, 0, 0, 0.08)` (浮起/强调阴影)

## 3. 已完成核心页面与功能

### 3.1 路由与导航调整
* **Tabbar 策略**: 针对需要引导页作为 App 一屏的业务需求，将 `src/tabbar/config.ts` 中的 `tabbarStrategy` 调整为了 `NO_TABBAR (0)`。这样可以完全接管应用的层级控制。
* **页面入口**: 移除了原 `index.vue` 的 `type: 'home'`，使新写的 `guide/index.vue` 变为默认启动页，结束后通过 `uni.reLaunch` 导航回首页。

### 3.2 引导页 (Onboarding: `src/pages/guide/index.vue`)
* 实现了沉浸式可滑动的 Swiper 极简引导页。
* 配合 3D 偏移（`rotate`、`scale`）等动画展现了应用特性。
* **底部微交互**: 底部不使用传统按钮，而是用**纯文本+箭头**的极简形式 (`继续 ->` / `开始探索 ->`) 配合纯色的极简进度指示器（细条型 Dots）。
* 引入了 `pb-safe` 与 `pt-safe` 做原生级的适配（兼容刘海屏/手势黑线）。
* 额外在背景加入了几乎透明（0.015 Opacity）的巨大水印数字（01、02...）拉升画面层次。

### 3.3 首页重构 (Home: `src/pages/index/index.vue`)
完全重新编写了首页，极大地丰富了功能模块并坚守了极简排版理念：
1. **全局悬浮头像 (FAB)**：置于右上角，采用 `backdrop-blur` 微玻璃态。并且右上角动态显示了用户的“灵感点数（✨）”。
2. **巨幅日期模块 (Hero)**：通过 `text-[88px]` 的数字配合日期感知自动切换 Greeting (`Good Morning / Evening` 等)，并绑定了连击签到标签 `🔥 Streak`。
3. **点距式签到面板**：
   * 用精致的横向 Banner 替代大体块。
   * 周历采用了精细的彩色圆点（Dots）配合环形勾勒线，展现每日达成度。
   * **音乐日签弹窗 (彩蛋 Modal)**：点击签到后弹出，由厚重毛玻璃加持。内部展示类似于打孔实体票据的海报卡片（包含歌曲、名言、虚构条形码）。模拟了保存到相册的功能加载联动。
4. **编辑私藏 (音乐横滑推荐)**：
   * 带阴影特效的方形专辑封面（瀑布横流 `scroll-x`）。
   * 点击专辑后，底部会在屏幕外弹入一个**圆润的玻璃态暗黑悬浮播放器**（Now Playing），并包含跳动的频闪动画与唱片自旋特效。
5. **圆桌讨论 (评论模块)**：
   * 细化了头像、微标签 (`[Pro]`)、以及互动按钮设计。
   * 将点赞心形设计成红色，包含弹跳放大动画逻辑。
   * 底部增加了悬浮的“假输入框”供模拟发布讨论用。

## 4. 后续开发建议 / 待办事项 (TODOs)

1. **接口对接 (API)**
   * 目前 `pages/index/index.vue` 中的打卡状态 (`weekDays`)、专辑数据 (`albums`)、评论数据 (`comments`) 均为硬编码。后续需要在 `src/api` 目录下撰写请求并同页面做真实绑定。
2. **保存日签到相册真实功能**
   * 当前在 `saveSignCard()` 中的保存图片逻辑只是 Toast 模拟，后期需使用 `uni.canvasToTempFilePath` 渲染视图、或结合对应后端的绘图接口返回图流，最终调用 `uni.saveImageToPhotosAlbum`。
3. **Tabbar 还原 / 定制开发**
   * 当用户从向导页进入主页后，后续必定需要切换多个业务主页面（如“我的”、“发现”）。若采用原生则修改 `pages.config.ts`；若采用自定义，须开启 `CUSTOM_TABBAR` 并在全局挂载你重新设计的 Mobbin 风 Tabbar。
4. **全局组件提取**
   * 可以考虑把当前 `index.vue` 里的“音乐专辑卡片”、“日签弹窗卡片”剥离到 `src/components/`，让后续详情页能复用上述的优异动效设计。
