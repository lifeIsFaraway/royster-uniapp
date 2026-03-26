<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({ name: 'Guide' })
definePage({
  type: 'home',
  style: { navigationStyle: 'custom' },
})

// === 状态控制 ===
const current = ref(0)
function swiperChange(e: any) {
  // 禁止在未完成选择时通过手势直接滑到下一页
  if (e.detail.current > current.value) {
    if (current.value === 0 && q1.value.selected === -1) {
      current.value = 0 // 强制留住
      uni.showToast({ title: '凭直觉选一句吧', icon: 'none' })
      return
    }
    if (current.value === 1 && q_visual.value.selected === -1) {
      current.value = 1
      uni.showToast({ title: '凭直觉选一种色彩吧', icon: 'none' })
      return
    }
    if (current.value === 2 && q_audio.value.selected === -1) {
      current.value = 2
      uni.showToast({ title: '先猜猜这首歌吧', icon: 'none' })
      return
    }
  }
  current.value = e.detail.current
}

// === 互动 Q1: 歌词心境测试 (单选) ===
const q1 = ref({
  options: [
    '炊烟袅袅升起，隔江千万里',
    '月色被打捞起，晕开了结局',
    '如传世的青花瓷自顾自美丽',
  ],
  selected: -1,
})

function selectQ1(index: number) {
  q1.value.selected = index
}

// === 互动 Q2: 视觉共振测试 (单选) ===
const q_visual = ref({
  options: [
    { name: '极光幻境', class: 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300' },
    { name: '落日弥漫', class: 'bg-gradient-to-tr from-orange-300 via-rose-300 to-red-400' },
    { name: '冷峻深海', class: 'bg-gradient-to-bl from-teal-400 to-emerald-500' },
    { name: '极简虚无', class: 'bg-gradient-to-br from-gray-700 to-black' },
  ],
  selected: -1,
})

function selectQVisual(index: number) {
  q_visual.value.selected = index
}

// === 互动 Q3: 盲盒听觉测试 (单选) ===
const q_audio = ref({
  isPlaying: true, // 初始视觉上呈现播放的动效
  options: [
    '陈奕迅 - 富士山下',
    '陶喆 - 爱我还是他',
    '林俊杰 - 修炼爱情',
  ],
  selected: -1,
})

// === 互动 Q4: 十首灵魂曲目锚点 (多选) ===
const q_songs = ref({
  options: [
    { title: '富士山下', artist: '陈奕迅', cover: 'https://picsum.photos/seed/track1/300/300' },
    { title: 'Midnight City', artist: 'M83', cover: 'https://picsum.photos/seed/track2/300/300' },
    { title: '七里香', artist: '周杰伦', cover: 'https://picsum.photos/seed/track3/300/300' },
    { title: 'Yellow', artist: 'Coldplay', cover: 'https://picsum.photos/seed/track4/300/300' },
    { title: '修炼爱情', artist: '林俊杰', cover: 'https://picsum.photos/seed/track5/300/300' },
    { title: 'Blinding Lights', artist: 'The Weeknd', cover: 'https://picsum.photos/seed/track6/300/300' },
    { title: '水星记', artist: '郭顶', cover: 'https://picsum.photos/seed/track7/300/300' },
    { title: 'Let It Be', artist: 'The Beatles', cover: 'https://picsum.photos/seed/track8/300/300' },
    { title: '起风了', artist: '买辣椒也用券', cover: 'https://picsum.photos/seed/track9/300/300' },
    { title: 'Shape of You', artist: 'Ed Sheeran', cover: 'https://picsum.photos/seed/track10/300/300' },
    { title: '悬溺', artist: '葛东琪', cover: 'https://picsum.photos/seed/track11/300/300' },
    { title: 'Resonance', artist: 'HOME', cover: 'https://picsum.photos/seed/track12/300/300' },
  ],
  selected: [] as number[],
})

// 不再使用离散模型，改用模板直接渲染 3D 矩阵排列以保障性能和规整度

function togglePlayAudio() {
  q_audio.value.isPlaying = !q_audio.value.isPlaying
}
function selectQAudio(index: number) {
  q_audio.value.selected = index
}

function toggleQSongs(idx: number) {
  const i = q_songs.value.selected.indexOf(idx)
  if (i > -1) {
    q_songs.value.selected.splice(i, 1)
  }
  else {
    // 限制最多选择 10 首曲目
    if (q_songs.value.selected.length < 10) {
      q_songs.value.selected.push(idx)
    }
    else {
      uni.showToast({ title: '已达到共鸣上限 (10首)', icon: 'none' })
    }
  }
}

// === 导航控制 ===
function handleNext() {
  if (current.value === 0 && q1.value.selected === -1) {
    uni.showToast({ title: '凭直觉选一句吧', icon: 'none' })
    return
  }
  if (current.value === 1 && q_visual.value.selected === -1) {
    uni.showToast({ title: '凭直觉选一种色彩吧', icon: 'none' })
    return
  }
  if (current.value === 2 && q_audio.value.selected === -1) {
    uni.showToast({ title: '先猜猜这首歌吧', icon: 'none' })
    return
  }
  if (current.value === 3 && q_songs.value.selected.length === 0) {
    uni.showToast({ title: '请至少选择1首引路曲目', icon: 'none' })
    return
  }

  if (current.value < 4) { // Now 5 slides (0-4), so next is valid if current < 4
    current.value++
  }
}

function goHome() {
  uni.reLaunch({ url: '/pages/home/index' })
}
</script>

<template>
  <view class="relative h-screen w-screen flex flex-col overflow-hidden bg-mobbin-bg">
    <!-- 全局呼吸光斑背景，大幅增加画面的空气感和精致度 -->
    <view class="pointer-events-none absolute right-[-10vw] top-[-10vh] z-0 h-[60vw] w-[60vw] rounded-full bg-blue-100 opacity-60 mix-blend-multiply blur-[80px] filter" />
    <view class="pointer-events-none absolute bottom-[-10vh] left-[-10vw] z-0 h-[70vw] w-[70vw] rounded-full bg-indigo-50 opacity-60 mix-blend-multiply blur-[100px] filter" />

    <!-- 右上角跳过入口 -->
    <view class="pointer-events-none absolute left-0 right-0 top-0 z-20 mt-6 box-border flex items-center justify-between px-6 pt-safe">
      <view class="text-[16px] text-mobbin-text-sub font-black tracking-widest italic opacity-40">
        M.
      </view>
      <view class="pointer-events-auto border border-white/50 rounded-full bg-white/40 px-4 py-1.5 text-[13px] text-mobbin-text-sub font-bold tracking-wider shadow-sm backdrop-blur-md transition-all active:scale-95" @click="goHome">
        跳过
      </view>
    </view>

    <!-- 主体问卷滑块 -->
    <swiper class="h-full w-full flex-1" :current="current" :circular="false" :indicator-dots="false" @change="swiperChange">
      <!-- ================= Slide 1: 歌词单选测试 ================= -->
      <swiper-item>
        <view class="relative z-10 box-border h-full w-full flex flex-col justify-center px-8 pt-[5vh]">
          <!-- 背景巨大水印 -->
          <view class="pointer-events-none absolute z-0 select-none text-[280px] text-black/[0.015] font-black leading-none transition-all duration-1000 -left-6 -top-[5vh]">
            Q1
          </view>

          <!-- 题干头部区，加入了更聚焦的唱片挂件设计 -->
          <view class="relative z-10 mb-10 w-full">
            <view class="mb-5 flex items-center gap-2 text-[12px] text-mobbin-text-sub font-bold tracking-widest">
              <view class="h-1.5 w-1.5 animate-pulse rounded-full bg-mobbin-text-main" /> 潜意识匹配
            </view>

            <!-- 毛玻璃拟物化的迷你唱片挂件 -->
            <view class="mb-5 w-max flex items-center gap-3 border border-white/80 rounded-2xl bg-white/60 px-3 py-2 shadow-sm backdrop-blur-xl">
              <image src="https://picsum.photos/seed/jay/100/100" class="animate-spin-slow h-[34px] w-[34px] border-[1.5px] border-white rounded-full shadow-sm" />
              <view class="flex flex-col pr-3">
                <text class="text-[13px] text-mobbin-text-main font-extrabold leading-tight tracking-tight">青花瓷</text>
                <text class="mt-[1px] text-[10px] text-gray-500 font-medium leading-tight tracking-wider uppercase">Jay Chou</text>
              </view>
            </view>

            <view class="relative z-10 text-[34px] text-mobbin-text-main font-black leading-[1.3] tracking-tight font-serif">
              "天青色等烟雨，<br>而我在等你..."
            </view>
          </view>

          <!-- 精英质感的带ABCD序号的单选区 -->
          <view class="z-10 w-full flex flex-col gap-[14px]">
            <view
              v-for="(opt, idx) in q1.options" :key="idx"
              class="w-full flex items-center justify-between border-[1.5px] rounded-[32rpx] px-5 py-4 transition-all duration-400"
              :class="q1.selected === idx ? 'border-mobbin-text-main bg-mobbin-text-main text-white shadow-[0_12px_36px_rgba(0,0,0,0.18)] scale-[1.02]' : 'border-black/5 bg-white text-mobbin-text-main hover:bg-gray-50 active:scale-95 shadow-mobbin-sm'"
              @click="selectQ1(idx)"
            >
              <view class="flex items-center gap-3">
                <!-- 序号徽章 -->
                <view
                  class="h-8 w-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-300"
                  :class="q1.selected === idx ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'"
                >
                  {{ String.fromCharCode(65 + idx) }}
                </view>
                <text class="text-[15px] font-bold tracking-wide">{{ opt }}</text>
              </view>
              <view
                class="h-6 w-6 flex items-center justify-center rounded-full transition-all duration-300"
                :class="q1.selected === idx ? 'bg-white text-mobbin-text-main scale-100 opacity-100 shadow-sm' : 'scale-0 opacity-0 bg-transparent'"
              >
                <text class="i-carbon-checkmark text-[14px] font-bold" />
              </view>
            </view>
          </view>
        </view>
      </swiper-item>

      <!-- ================= Slide 2: 视觉共振测试 ================= -->
      <swiper-item>
        <view class="relative z-10 box-border h-full w-full flex flex-col justify-center px-8 pt-[5vh]">
          <view class="pointer-events-none absolute z-0 select-none text-[280px] text-black/[0.015] font-black leading-none transition-all duration-1000 -left-6 -top-[5vh]">
            Q2
          </view>

          <view class="relative z-10 mb-8 w-full">
            <view class="mb-5 flex items-center gap-2 text-[12px] text-mobbin-text-sub font-bold tracking-widest">
              <view class="h-1.5 w-1.5 animate-pulse rounded-full bg-mobbin-text-main" /> 视觉共振
            </view>
            <view class="relative z-10 text-[34px] text-mobbin-text-main font-black leading-[1.3] tracking-tight font-serif">
              "此刻，哪块色彩光谱<br>最能同频你的视网膜？"
            </view>
            <view class="mt-4 select-none text-[14px] text-gray-400 font-medium italic">
              — 抛开审视，拾取本能的色彩
            </view>
          </view>

          <!-- 2x2渐变艺术色块区 -->
          <view class="z-10 grid grid-cols-2 gap-4">
            <view
              v-for="(color, idx) in q_visual.options" :key="idx"
              class="relative aspect-square flex flex-col cursor-pointer justify-end overflow-hidden border-2 rounded-[36rpx] p-4 transition-all duration-500"
              :class="[
                color.class,
                q_visual.selected === idx ? 'scale-[1.03] shadow-[0_20px_40px_rgba(0,0,0,0.25)] border-white/60 z-10 blur-0' : (q_visual.selected !== -1 ? 'opacity-30 scale-95 border-transparent blur-[2px]' : 'border-black/5 hover:scale-95 shadow-sm'),
              ]"
              @click="selectQVisual(idx)"
            >
              <!-- 添加高级噪点颗粒纹理，模拟真实的胶片肌理 -->
              <view class="pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E');" />

              <view class="relative z-10 flex items-center justify-between">
                <text class="text-[13px] text-white font-black tracking-widest drop-shadow-md">{{ color.name }}</text>
                <view
                  class="h-[26px] w-[26px] flex items-center justify-center rounded-full bg-white/30 shadow-[0_2px_10px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300"
                  :class="q_visual.selected === idx ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
                >
                  <text class="i-carbon-checkmark text-[14px] text-white font-bold" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>

      <!-- ================= Slide 3: 听觉盲盒测试 ================= -->
      <swiper-item>
        <view class="relative z-10 box-border h-full w-full flex flex-col justify-center px-8 pt-[5vh]">
          <view class="pointer-events-none absolute z-0 select-none text-[280px] text-black/[0.015] font-black leading-none transition-all duration-1000 -left-6 -top-[5vh]">
            Q3
          </view>

          <view class="relative z-10 mb-10 w-full">
            <view class="mb-5 flex items-center gap-2 text-[12px] text-mobbin-text-sub font-bold tracking-widest">
              <view class="h-1.5 w-1.5 animate-pulse rounded-full bg-mobbin-text-main" /> 盲听直觉
            </view>

            <!-- 极为精美的波形播放器卡片 (CSS 动效波形) -->
            <view class="mb-6 w-full flex items-center gap-4 border border-white/80 rounded-[24rpx] bg-white/70 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">
              <view class="h-11 w-11 flex items-center justify-center rounded-full bg-mobbin-text-main shadow-md transition-transform active:scale-95" @click="togglePlayAudio">
                <view class="text-[16px] text-white" :class="q_audio.isPlaying ? 'i-carbon-pause-filled' : 'i-carbon-play-filled-alt ml-1'" />
              </view>

              <view class="relative h-10 flex flex-1 flex-col justify-center overflow-hidden">
                <!-- 纯CSS波形动画阵列 -->
                <view class="mt-1 h-6 w-full flex translate-y-[-2px] items-end gap-[3px]" :class="q_audio.isPlaying ? 'opacity-100' : 'opacity-40'">
                  <view
                    v-for="i in 16" :key="i" class="w-1.5 rounded-full bg-mobbin-text-main"
                    :style="{ height: q_audio.isPlaying ? `${20 + Math.random() * 80}%` : '20%', transition: 'height 0.2s', animation: q_audio.isPlaying ? `bounce-wave ${0.5 + Math.random()}s infinite alternate` : 'none' }"
                  />
                </view>
              </view>

              <view class="w-10 text-right text-[12px] text-gray-400 font-bold font-mono">
                0:14
              </view>
            </view>

            <view class="relative z-10 text-[34px] text-mobbin-text-main font-black leading-[1.3] tracking-tight font-serif">
              "这段在脑海中<br>循环的回响是..."
            </view>
          </view>

          <!-- 选项区 -->
          <view class="z-10 w-full flex flex-col gap-[14px]">
            <view
              v-for="(opt, idx) in q_audio.options" :key="idx"
              class="w-full flex items-center justify-between border-[1.5px] rounded-[32rpx] px-5 py-4 transition-all duration-400"
              :class="q_audio.selected === idx ? 'border-mobbin-text-main bg-mobbin-text-main text-white shadow-[0_12px_36px_rgba(0,0,0,0.18)] scale-[1.02]' : 'border-black/5 bg-white text-mobbin-text-main hover:bg-gray-50 active:scale-95 shadow-mobbin-sm'"
              @click="selectQAudio(idx)"
            >
              <view class="flex items-center gap-3">
                <view
                  class="h-8 w-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-300"
                  :class="q_audio.selected === idx ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'"
                >
                  {{ String.fromCharCode(65 + idx) }}
                </view>
                <text class="text-[15px] font-bold tracking-wide">{{ opt }}</text>
              </view>
              <view
                class="h-6 w-6 flex items-center justify-center rounded-full transition-all duration-300"
                :class="q_audio.selected === idx ? 'bg-white text-mobbin-text-main scale-100 opacity-100 shadow-sm' : 'scale-0 opacity-0 bg-transparent'"
              >
                <text class="i-carbon-checkmark text-[14px] font-bold" />
              </view>
            </view>
          </view>
        </view>
      </swiper-item>

      <!-- ================= Slide 4: 十首挚爱曲目极简画廊选片框 ================= -->
      <swiper-item>
        <view class="relative z-10 box-border h-full w-full flex flex-col pt-[5vh]">
          <!-- 最顶部固定文案模块 -->
          <view class="relative z-20 mt-[2vh] shrink-0 px-8 pb-3">
            <view class="pointer-events-none absolute z-0 select-none text-[280px] text-black/[0.015] font-black leading-none transition-all duration-1000 -left-6 -top-[5vh]">
              Q4
            </view>
            <view class="relative z-10 mb-5 flex items-center gap-2 text-[12px] text-mobbin-text-sub font-bold tracking-widest">
              <view class="h-1.5 w-1.5 animate-pulse rounded-full bg-mobbin-text-main" /> 共鸣锚点
            </view>
            <view class="relative z-10 mb-2 text-[32px] text-mobbin-text-main font-black leading-[1.2] tracking-tight font-serif">
              "锁定你的绝对系标<br>挑选至多 10 支神单"
            </view>
            <view class="relative z-10 mt-4 flex items-center justify-between text-[13px] text-gray-400 font-medium italic">
              — 你的精神避难所 ( {{ q_songs.selected.length }} / 10 )
            </view>
          </view>

          <!-- 上下物理柔和渐变消隐遮罩以提供边缘画廊质感 -->
          <view class="pointer-events-none absolute inset-x-0 top-[22vh] z-10 h-10 from-mobbin-bg to-transparent bg-gradient-to-b" />
          <view class="pointer-events-none absolute inset-x-0 bottom-[10vh] z-10 h-[15vh] from-mobbin-bg to-transparent bg-gradient-to-t" />

          <!-- 画廊主体：通过绝对定位强制接管弹性区域高度以确保完美滚动 -->
          <view class="relative z-0 w-full flex-1 overflow-hidden -mt-2">
            <scroll-view scroll-y class="absolute inset-0 h-full w-full">
              <view class="relative z-0 flex flex-wrap justify-between gap-y-[4vw] px-6 pb-[30vh] pt-4">
                <view
                  v-for="(song, idx) in q_songs.options" :key="idx"
                  class="relative aspect-square w-[42vw] overflow-hidden rounded-[32rpx] transition-all duration-400 active:scale-95"
                  :class="q_songs.selected.includes(idx) ? 'ring-[3px] ring-black/80 scale-[0.98] shadow-lg' : 'hover:scale-[0.98] shadow-sm ring-[1.5px] ring-black/5'"
                  @click="toggleQSongs(idx)"
                >
                  <!-- 专辑物理封面图像层（内置饱和度联动） -->
                  <image
                    :src="song.cover"
                    class="absolute inset-0 h-full w-full object-cover transition-all duration-700"
                    :class="q_songs.selected.includes(idx) ? 'scale-110 saturate-100' : 'scale-100 saturate-50 opacity-90'"
                  />

                  <!-- 暗角遮罩（选中半透压暗，未选中提供文字衬底保护） -->
                  <view
                    class="pointer-events-none absolute inset-0 transition-opacity duration-300"
                    :class="q_songs.selected.includes(idx) ? 'bg-black/30' : 'from-black/80 via-black/10 to-transparent bg-gradient-to-t'"
                  />

                  <!-- 精致的高斯模糊毛玻璃通过状态标识 -->
                  <view
                    class="absolute right-3 top-3 h-8 w-8 flex items-center justify-center border border-white/30 rounded-full bg-white/20 shadow-sm backdrop-blur-md transition-all duration-300"
                    :class="q_songs.selected.includes(idx) ? 'opacity-100 scale-100' : 'opacity-0 scale-0'"
                  >
                    <text class="i-carbon-checkmark text-[16px] text-white font-bold" />
                  </view>

                  <!-- 悬浮版式排版层 -->
                  <view
                    class="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300"
                    :class="q_songs.selected.includes(idx) ? 'translate-y-1' : ''"
                  >
                    <text class="block truncate text-[14px] text-white font-black leading-tight tracking-wider drop-shadow-md">{{ song.title }}</text>
                    <text class="mt-1 block truncate text-[11px] text-white/75 font-medium tracking-widest uppercase">{{ song.artist }}</text>
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </swiper-item>

      <!-- ================= Slide 5: 统一极简风格 - 3D 旋转透视正方形阵列 ================= -->
      <swiper-item>
        <view class="relative z-10 box-border h-full w-full flex flex-col items-center justify-center overflow-hidden bg-[#f8f9fa]">
          <!-- 背景：核心 3D 透视阵列容器 -->
          <view class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-40 mix-blend-multiply saturate-150 filter">
            <!-- 3D 摇摄呼吸动画层 -->
            <view class="animate-3d-breathe flex transform-gpu gap-[5vw]">
              <!-- 左列正方形阵列 -->
              <view class="animate-float-fast relative flex flex-col gap-[5vw] -top-[15vh]">
                <image v-for="i in 15" :key="`col1-${i}`" :src="`https://picsum.photos/seed/square_col1_${i}/400/400`" class="h-[34vw] w-[34vw] rounded-[36rpx] bg-gray-100 object-cover shadow-[0_20px_40px_rgba(0,0,0,0.15)] will-change-transform" />
              </view>

              <!-- 中列起始位置错开，产生空间落差感 -->
              <view class="animate-float-slow mt-[12vh] flex flex-col gap-[5vw]">
                <image v-for="i in 15" :key="`col2-${i}`" :src="`https://picsum.photos/seed/square_col2_${i}/400/400`" class="h-[34vw] w-[34vw] rounded-[36rpx] bg-gray-100 object-cover shadow-[0_30px_60px_rgba(0,0,0,0.2)] will-change-transform" />
              </view>

              <!-- 右列正方形阵列 -->
              <view class="animate-float-medium flex flex-col gap-[5vw]">
                <image v-for="i in 15" :key="`col3-${i}`" :src="`https://picsum.photos/seed/square_col3_${i}/400/400`" class="h-[34vw] w-[34vw] rounded-[36rpx] bg-gray-100 object-cover shadow-[0_15px_30px_rgba(0,0,0,0.1)] will-change-transform" />
              </view>
            </view>
          </view>

          <!-- 上下边缘柔和消隐遮罩 -->
          <view class="pointer-events-none absolute inset-x-0 top-0 z-0 h-[25vh] from-mobbin-bg via-mobbin-bg/70 to-transparent bg-gradient-to-b" />
          <view class="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[25vh] from-mobbin-bg via-mobbin-bg/70 to-transparent bg-gradient-to-t" />

          <!-- 中心：去容器化高级排版 (Unboxed Typography Layout) -->
          <view class="relative z-10 flex flex-col items-center text-center transition-all duration-1000 delay-300 ease-out">
            <!-- 精美且严谨的系统状态药丸 (System Badge) -->
            <view class="mb-6 flex items-center gap-2 border-[0.5px] border-black/10 rounded-full bg-white/40 px-3 py-1.5 shadow-sm backdrop-blur-xl">
              <view class="h-1.5 w-1.5 animate-pulse rounded-full bg-black/80" />
              <text class="text-[10px] text-mobbin-text-main font-bold tracking-[0.2em] font-mono uppercase">Status: Synced</text>
            </view>

            <!-- 巨大的电影级无边框排版，去掉了繁重的玻璃悬浮窗 -->
            <view class="mb-5 text-[48px] text-mobbin-text-main font-black leading-none tracking-tighter sm:text-[56px]">
              探索完成.
            </view>

            <view class="mx-auto max-w-[280px] text-[14px] text-mobbin-text-sub font-medium leading-[2] tracking-widest opacity-80 mix-blend-multiply">
              感官偏好均已被捕获<br>系统即将切入你的沉浸式宇宙
            </view>

            <!-- 极简的基底装饰线，体现版式的克制和高级感 -->
            <view class="mx-auto mt-10 h-[1.5px] w-8 bg-black/15" />
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 底部常驻悬浮控制栏 -->
    <view class="pointer-events-none absolute bottom-0 left-0 right-0 z-50 box-border flex items-center justify-between px-8 pb-[10vh] pt-4 pb-safe">
      <!-- 左侧极简状态指示仪 -->
      <view class="pointer-events-auto h-12 flex items-center space-x-2.5">
        <view
          v-for="(_, index) in 4" :key="index"
          class="h-1.5 rounded-full transition-all duration-500 ease-out"
          :class="current === index ? 'w-8 bg-mobbin-text-main' : 'w-2 bg-gray-200'"
        />
      </view>

      <!-- 右侧优雅操作按钮 -->
      <view class="pointer-events-auto h-12 flex items-center justify-end">
        <!-- 前 3 页的继续按钮 (验证输入有效性从而变色) -->
        <view
          v-if="current < 3"
          class="z-10 flex items-center text-[18px] font-bold tracking-wide transition-all duration-300"
          :class="((current === 0 && q1.selected !== -1) || (current === 1 && q_visual.selected !== -1) || (current === 2 && q_audio.selected !== -1)) ? 'text-mobbin-text-main active:scale-95' : 'text-gray-300 pointer-events-none'"
          @click="handleNext"
        >
          继续
          <view
            class="i-carbon-arrow-right ml-1.5 text-2xl transition-transform"
            :class="((current === 0 && q1.selected !== -1) || (current === 1 && q_visual.selected !== -1) || (current === 2 && q_audio.selected !== -1)) ? 'translate-x-1' : ''"
          />
        </view>

        <!-- 第 4 页探索按钮 -->
        <view
          v-else
          class="z-10 flex items-center text-[18px] text-mobbin-text-main font-bold tracking-wide transition-transform active:scale-95"
          @click="goHome"
        >
          立即开启
          <view class="i-carbon-arrow-right ml-1px text-2xl" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}
@keyframes bounce-wave {
  0% {
    transform: scaleY(0.4);
  }
  100% {
    transform: scaleY(1.4);
  }
}

@keyframes float-up-infinity {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-40%);
  }
}

@keyframes breathe-3d {
  0% {
    transform: perspective(1200px) rotateX(25deg) rotateY(-15deg) rotateZ(10deg) scale(1.4);
  }
  100% {
    transform: perspective(1200px) rotateX(30deg) rotateY(-5deg) rotateZ(15deg) scale(1.4);
  }
}

.animate-3d-breathe {
  animation: breathe-3d 10s ease-in-out infinite alternate;
}
.animate-float-fast {
  animation: float-up-infinity 35s linear infinite alternate;
}
.animate-float-medium {
  animation: float-up-infinity 45s linear infinite alternate-reverse;
}
.animate-float-slow {
  animation: float-up-infinity 60s linear infinite alternate;
}
</style>
