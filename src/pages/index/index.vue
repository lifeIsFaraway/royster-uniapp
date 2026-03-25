<script lang="ts" setup>
import { computed, ref } from 'vue'

defineOptions({ name: 'Home' })
definePage({
  style: {
    navigationStyle: 'custom',
  },
})

// === 1. 问候与日期 (带时间感知) ===
const today = new Date()
const hour = today.getHours()
const greeting = computed(() => {
  if (hour < 5)
    return 'Good Night'
  if (hour < 12)
    return 'Good Morning'
  if (hour < 18)
    return 'Good Afternoon'
  return 'Good Evening'
})
const dateNum = today.getDate()
const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][today.getMonth()]
const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()]

// 用户资产模拟
const inspirationPoints = ref(1250)
const streakDays = ref(12)

// === 2. 签到模块玩法 (持平度打卡) ===
const isCheckedIn = ref(false)
const weekDays = ref([
  { id: 1, label: 'M', status: 'done' },
  { id: 2, label: 'T', status: 'done' },
  { id: 3, label: 'W', status: 'done' },
  { id: 4, label: 'T', status: 'pending' }, // 模拟今天
  { id: 5, label: 'F', status: 'future' },
  { id: 6, label: 'S', status: 'future' },
  { id: 7, label: 'S', status: 'future' },
])

const showSignCard = ref(false)

function doCheckIn() {
  if (isCheckedIn.value)
    return
  isCheckedIn.value = true
  inspirationPoints.value += 50
  streakDays.value += 1
  weekDays.value[3].status = 'done' // 点亮今天的打卡点

  // 延迟一点弹出日签，让用户先看到打卡成功的微反馈，提高体验
  setTimeout(() => {
    showSignCard.value = true
  }, 400)
}

function saveSignCard() {
  // 模拟保存图片的流程
  uni.showLoading({ title: '海报生成中...', mask: true })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '✅ 已保存到核心相册', icon: 'none', duration: 2000 })
    // 延迟关闭
    setTimeout(() => {
      showSignCard.value = false
    }, 1500)
  }, 1200)
}

// === 3. 音乐专辑板块玩法 (标签与播放控制) ===
const albums = [
  { id: 1, title: 'Midnight City', artist: 'M83', listeners: '1.2M', tag: 'Synthwave', cover: 'https://picsum.photos/seed/album1/400/400' },
  { id: 2, title: 'Starboy', artist: 'The Weeknd', listeners: '4.5M', tag: 'R&B / Pop', cover: 'https://picsum.photos/seed/album2/400/400' },
  { id: 3, title: 'Random Access', artist: 'Daft Punk', listeners: '8.1M', tag: 'Electronic', cover: 'https://picsum.photos/seed/album3/400/400' },
  { id: 4, title: 'Currents', artist: 'Tame Impala', listeners: '3.2M', tag: 'Psychedelic', cover: 'https://picsum.photos/seed/album4/400/400' },
]
const nowPlaying = ref(false)
const currentAlbum = ref(albums[0])

function playAlbum(album: any) {
  currentAlbum.value = album
  nowPlaying.value = true
}
function togglePlay() {
  nowPlaying.value = !nowPlaying.value
}

// === 4. 评论模块交互 (点赞与回复) ===
const comments = ref([
  {
    id: 1,
    user: 'Alex H.',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    badge: 'Pro', // 增加勋章
    content: '极简设计的核心在于“少即是多”。这套无边框、无沉重阴影的设计，让视线完全集中在内容上，确实非常具有高级感。',
    time: '2 小时前',
    likes: 124,
    isLiked: false,
    replies: 3,
  },
  {
    id: 2,
    user: 'Mia T.',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    badge: '',
    content: '右上角的悬浮头像和全局的毛玻璃质感搭配得天衣无缝。最喜欢横向瀑布流里的播放微交互！',
    time: '5 小时前',
    likes: 89,
    isLiked: true,
    replies: 0,
  },
])

function toggleLike(comment: any) {
  if (comment.isLiked) {
    comment.likes--
    comment.isLiked = false
  }
  else {
    comment.likes++
    comment.isLiked = true
  }
}

function toProfile() {
  uni.showToast({ title: '前往个人中心', icon: 'none' })
  // uni.navigateTo({ url: '/pages/me/me' })
}
</script>

<template>
  <view class="relative min-h-screen overflow-hidden bg-mobbin-bg">
    <!-- 悬浮个人中心 (带有动态积分展示)，极大地丰富了画面右上角的层次感 -->
    <view
      class="fixed right-6 z-50 flex items-center justify-between border border-white/60 rounded-full bg-white/60 py-[3px] pl-3 pr-[3px] shadow-mobbin-sm backdrop-blur-xl transition-transform active:scale-95"
      style="top: calc(env(safe-area-inset-top) + 16px);"
      @click="toProfile"
    >
      <!-- 积分 Tag -->
      <view class="mr-3 flex items-center">
        <text class="text-[17px]">✨</text>
        <text class="ml-1 text-[13px] text-mobbin-text-main font-bold">{{ inspirationPoints }}</text>
      </view>
      <!-- 头像 -->
      <image src="https://picsum.photos/seed/myavatar/100/100" class="h-[36px] w-[36px] rounded-full shadow-inner" mode="aspectFill" />
    </view>

    <!-- Scrollable Body -->
    <scroll-view scroll-y class="box-border h-screen w-full" :show-scrollbar="false">
      <!-- 页面底部留出给悬浮播放器的空间 -->
      <view class="px-6 pb-32 pt-safe">
        <!-- ======================= -->
        <!-- 1. 沉浸式日期与问候模块 -->
        <!-- ======================= -->
        <view class="relative mb-12 mt-[10vh] flex flex-col items-start justify-center">
          <!-- 背景巨大修饰文字，打破单调感 -->
          <view class="pointer-events-none absolute z-0 select-none text-[180px] text-black/[0.02] font-black -left-6 -top-12">
            {{ monthName.toUpperCase() }}
          </view>

          <view class="z-10 w-full flex flex-col">
            <text class="mb-2 text-2xl text-mobbin-text-main font-bold tracking-tight">{{ greeting }}, Explorer.</text>
            <text class="text-[88px] text-mobbin-text-main font-black leading-[0.8] tracking-tighter">{{ dateNum }}</text>
            <view class="mt-3 flex items-center text-[15px] text-mobbin-text-sub font-medium tracking-wide uppercase">
              <text>{{ dayName }}, {{ monthName }}</text>
              <view class="mx-3 h-1 w-1 rounded-full bg-mobbin-text-main" />
              <!-- 增加火焰小标签，代表Streak连击 -->
              <text class="flex items-center text-orange-500">🔥 {{ streakDays }} Streak</text>
            </view>
          </view>
        </view>

        <!-- ======================= -->
        <!-- 2. 数据饱满的签到模块   -->
        <!-- ======================= -->
        <view class="mb-12 overflow-hidden border border-mobbin-border rounded-mobbin-card-lg bg-mobbin-card shadow-mobbin-sm">
          <view class="flex items-center justify-between p-5">
            <view class="flex items-center gap-4">
              <view class="h-11 w-11 flex items-center justify-center rounded-full bg-gray-50 shadow-inner">
                <text class="text-[20px]">{{ isCheckedIn ? '🎉' : '📅' }}</text>
              </view>
              <view class="flex flex-col">
                <text class="text-[17px] text-mobbin-text-main font-bold tracking-tight">每日打卡</text>
                <text class="mt-0.5 text-[12px] text-mobbin-text-sub">连续第 {{ streakDays }} 天</text>
              </view>
            </view>
            <view
              class="h-9 flex items-center justify-center rounded-full px-5 text-[13px] font-bold transition-all" :class="isCheckedIn ? 'bg-gray-50 text-gray-400 pointer-events-none' : 'bg-mobbin-text-main text-white active:scale-95 shadow-mobbin-sm'"
              @click="doCheckIn"
            >
              {{ isCheckedIn ? '已完成' : '立即签到' }}
            </view>
          </view>

          <!-- 极简点距式进度指示器 -->
          <view class="flex items-center justify-between px-7 pb-6">
            <view v-for="(day, idx) in weekDays" :key="idx" class="relative flex flex-col items-center gap-2">
              <view
                class="z-10 h-2 w-2 rounded-full transition-all duration-500"
                :class="day.status === 'done' ? 'bg-mobbin-text-main' : (day.status === 'pending' ? 'bg-white border-[2.5px] border-mobbin-text-main w-[14px] h-[14px] -my-[3px]' : 'bg-gray-200')"
              />
              <text class="mt-0.5 text-[10px] font-bold" :class="day.status === 'pending' ? 'text-mobbin-text-main' : 'text-gray-300'">{{ day.label }}</text>
            </view>
          </view>
        </view>

        <!-- ======================= -->
        <!-- 3. “重磅”音乐专辑板块   -->
        <!-- ======================= -->
        <view class="mb-14">
          <view class="mb-6 flex items-center justify-between">
            <text class="text-[24px] text-mobbin-text-main font-bold tracking-tight">编辑私藏</text>
            <view class="text-[14px] text-mobbin-text-sub font-medium transition-opacity active:opacity-50">
              查看全部
            </view>
          </view>

          <!-- 横向滑动列表 -->
          <scroll-view scroll-x class="whitespace-nowrap px-6 -mx-6" :show-scrollbar="false">
            <view class="inline-flex pb-6 space-x-5">
              <view v-for="album in albums" :key="album.id" class="group w-[155px] flex flex-col cursor-pointer" @click="playAlbum(album)">
                <!-- 封面图 -->
                <view class="relative mb-4 h-[155px] w-[155px] overflow-hidden border border-black/5 rounded-mobbin-card-lg bg-gray-100 shadow-mobbin-sm transition-all group-active:scale-95">
                  <image :src="album.cover" class="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />

                  <!-- Tag 信息悬浮于左上角，让内容极具品质感 -->
                  <view class="absolute left-2 top-2 rounded-md bg-white/70 px-2.5 py-1 text-[10px] text-mobbin-text-main font-bold shadow-sm backdrop-blur-md">
                    {{ album.tag }}
                  </view>

                  <!-- 播放指示器 -->
                  <view
                    class="absolute bottom-2 right-2 h-[34px] w-[34px] flex items-center justify-center rounded-full transition-all duration-300"
                    :class="nowPlaying && currentAlbum.id === album.id ? 'bg-mobbin-text-main shadow-mobbin-sm' : 'bg-black/30 backdrop-blur-md opacity-0 group-hover:opacity-100'"
                  >
                    <view v-if="nowPlaying && currentAlbum.id === album.id" class="flex gap-[2px]">
                      <view class="h-[12px] w-[3px] animate-bounce rounded-full bg-white" />
                      <view class="h-[8px] w-[3px] animate-bounce rounded-full bg-white" style="animation-delay: 0.1s" />
                      <view class="h-[12px] w-[3px] animate-bounce rounded-full bg-white" style="animation-delay: 0.2s" />
                    </view>
                    <view v-else class="i-carbon-play-filled-alt ml-0.5 text-sm text-white" />
                  </view>
                </view>

                <!-- 专辑文字信息，增加收听人数等元数据让页面饱满 -->
                <view class="flex flex-col px-1">
                  <text class="truncate text-[16px] text-mobbin-text-main font-bold">{{ album.title }}</text>
                  <text class="mt-1 truncate text-[13px] text-mobbin-text-sub">{{ album.artist }}</text>
                  <text class="mt-1.5 flex items-center gap-1 text-[11px] text-gray-400">
                    <text class="i-carbon-headset" /> {{ album.listeners }} Listeners
                  </text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- ======================= -->
        <!-- 4. 深化的评论模块区     -->
        <!-- ======================= -->
        <view class="mb-4">
          <text class="mb-6 block text-[24px] text-mobbin-text-main font-bold tracking-tight">圆桌讨论</text>

          <view class="flex flex-col space-y-4">
            <view v-for="comment in comments" :key="comment.id" class="border-b border-gray-100/80 rounded-xl bg-transparent px-4 pb-4 pt-4 transition-colors -mx-4 last:border-0 hover:bg-gray-50/50">
              <!-- 用户头部 -->
              <view class="mb-2 flex items-start">
                <image :src="comment.avatar" class="mr-3 h-10 w-10 border border-gray-100/50 rounded-full bg-gray-100" mode="aspectFill" />
                <view class="flex flex-1 flex-col justify-center">
                  <view class="flex items-center gap-2">
                    <text class="text-[15px] text-mobbin-text-main font-bold">{{ comment.user }}</text>
                    <text v-if="comment.badge" class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 font-bold uppercase">{{ comment.badge }}</text>
                  </view>
                  <text class="mt-0.5 text-[12px] text-mobbin-text-sub">{{ comment.time }}</text>
                </view>
              </view>

              <!-- 评论主体与交互栏 -->
              <view class="pl-13">
                <text class="block text-[15px] text-gray-700 font-normal leading-[1.6] tracking-wide">{{ comment.content }}</text>

                <view class="mt-4 flex items-center justify-between">
                  <!-- 回复提示 -->
                  <view class="flex items-center text-[13px] text-mobbin-text-main font-medium active:opacity-50">
                    <view v-if="comment.replies > 0" class="flex items-center gap-1.5 rounded-full bg-gray-100/80 px-3 py-1.5">
                      <text class="i-carbon-chat" />
                      <text>{{ comment.replies }} 条讨论</text>
                    </view>
                    <view v-else class="text-gray-400">
                      回复
                    </view>
                  </view>

                  <!-- 点赞操作与计数联动 -->
                  <view
                    class="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors" :class="comment.isLiked ? 'bg-red-50 text-red-500' : 'text-gray-400'"
                    @click="toggleLike(comment)"
                  >
                    <view
                      class="text-[15px] transition-transform duration-300"
                      :class="[comment.isLiked ? 'i-carbon-favorite-filled scale-110' : 'i-carbon-favorite hover:scale-110']"
                    />
                    <text class="text-[13px] font-bold font-mono">{{ comment.likes }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 悬浮的快速发评假输入框 -->
          <view class="mt-6 flex items-center border border-mobbin-border rounded-full bg-mobbin-card p-1.5 shadow-mobbin-sm">
            <image src="https://picsum.photos/seed/myavatar/100/100" class="ml-1 h-8 w-8 rounded-full" mode="aspectFill" />
            <text class="flex-1 pl-3 text-[14px] text-gray-400">分享你的独特高见...</text>
            <view class="h-9 w-9 flex items-center justify-center rounded-full bg-mobbin-text-main transition-transform active:scale-90">
              <text class="i-carbon-send-alt text-sm text-white" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- ======================= -->
    <!-- 6. 悬浮音乐播放器条     -->
    <!-- ======================= -->
    <view
      class="fixed left-4 right-4 z-50 transition-all duration-700 ease-out"
      :class="nowPlaying ? 'translate-y-0 opacity-100 pb-safe bottom-4' : 'translate-y-24 opacity-0 bottom-4 pointer-events-none'"
    >
      <view class="flex items-center justify-between border border-gray-700/50 rounded-[24px] bg-gray-900/85 p-2.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <view class="flex items-center gap-3">
          <!-- 正在旋转的小唱片 -->
          <image
            :src="currentAlbum.cover" class="h-11 w-11 border border-gray-700 rounded-full shadow-sm"
            :class="nowPlaying ? 'animate-spin' : ''" style="animation-duration: 8s; animation-timing-function: linear;"
          />
          <view class="flex flex-col">
            <text class="w-32 truncate text-[14px] text-white font-bold leading-tight">{{ currentAlbum.title }}</text>
            <text class="text-[11px] text-gray-400 leading-tight">{{ currentAlbum.artist }}</text>
          </view>
        </view>

        <view class="flex items-center gap-3 pr-2">
          <view class="i-carbon-previous-filled text-lg text-white/70 active:text-white" />
          <view class="h-10 w-10 flex items-center justify-center rounded-full bg-white transition-transform active:scale-90" @click="togglePlay">
            <view class="text-lg text-black" :class="nowPlaying ? 'i-carbon-pause-filled' : 'i-carbon-play-filled-alt ml-0.5'" />
          </view>
          <view class="i-carbon-next-filled text-lg text-white/70 active:text-white" />
        </view>
      </view>
    </view>

    <!-- ======================= -->
    <!-- 7. 音乐日签弹窗 (Modal) -->
    <!-- ======================= -->
    <view v-if="showSignCard" class="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity" @touchmove.stop.prevent>
      <!-- 毛玻璃厚遮罩层 -->
      <view class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="showSignCard = false" />

      <!-- 日签卡片主体 -->
      <view id="daily-sign-card" class="relative z-10 w-[78vw] flex flex-col overflow-hidden rounded-[40rpx] bg-mobbin-bg shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]">
        <!-- 满宽封面区域 -->
        <view class="relative aspect-square w-full bg-gray-100">
          <image :src="albums[0].cover" mode="aspectFill" class="h-full w-full" />
          <!-- 玻璃态悬浮日期徽章 -->
          <view class="absolute left-4 top-4 flex flex-col items-center rounded-[20rpx] bg-white/80 px-3.5 py-2 shadow-sm backdrop-blur-md">
            <text class="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{{ monthName }}</text>
            <text class="mt-0.5 text-[24px] text-mobbin-text-main font-black leading-none">{{ dateNum }}</text>
          </view>
        </view>

        <!-- 卡片实体票据风格文字信息区 -->
        <view class="relative flex flex-col items-center bg-white p-7">
          <!-- 左右边缘半圆打孔切割效果 -->
          <view class="absolute h-8 w-8 rounded-full bg-black/60 backdrop-blur-md -left-4 -top-4" />
          <view class="absolute h-8 w-8 rounded-full bg-black/60 backdrop-blur-md -right-4 -top-4" />
          <view class="absolute left-0 top-0 w-full border-t-[1.5px] border-gray-200 border-dashed" />

          <view class="i-carbon-quotes absolute left-6 top-5 text-4xl text-gray-200" />
          <text class="z-10 mt-3 text-center text-[19px] text-mobbin-text-main font-extrabold leading-relaxed font-serif">"We're all merely stars in the sky."</text>
          <text class="mt-4 text-[11px] text-mobbin-text-sub font-semibold tracking-widest uppercase">— {{ albums[0].title }}, {{ albums[0].artist }}</text>

          <!-- 装饰性生成条形码 -->
          <view class="mt-8 flex items-center gap-[2px] opacity-20">
            <view class="h-8 w-1 bg-black" />
            <view class="h-8 w-[3px] bg-black" />
            <view class="h-8 w-1 bg-black" />
            <view class="h-8 w-[5px] bg-black" />
            <view class="h-8 w-1 bg-black" />
            <view class="h-8 w-[2px] bg-black" />
            <view class="h-8 w-[3px] bg-black" />
            <view class="h-8 w-[6px] bg-black" />
            <view class="h-8 w-1 bg-black" />
            <view class="h-8 w-[2px] bg-black" />
          </view>
        </view>
      </view>

      <!-- 操作区 -->
      <view class="z-10 mt-8 flex flex-col items-center">
        <view class="h-[48px] flex items-center justify-center rounded-full bg-white px-10 text-[15px] text-mobbin-text-main font-bold shadow-mobbin-hover transition-transform active:scale-95" @click="saveSignCard">
          保存日签到相册
        </view>
        <view class="mt-4 text-[13px] text-white/60 tracking-wider active:opacity-50" @click="showSignCard = false">
          轻触背景关闭
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
</style>
