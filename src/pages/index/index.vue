<script lang="ts" setup>
import type { ICommentItem } from '@/api/comment'
import type { IMusicItem } from '@/api/music'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { apiCommentListById } from '@/api/comment'
import { apiRandomMusic } from '@/api/music'
import { apiCheckin, apiUserInfo } from '@/api/user'

defineOptions({ name: 'Home' })
definePage({
  style: {
    navigationStyle: 'custom',
  },
})

// === 1. 问候与日期 (带时间感知) ===
const today = new Date()
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
const signCardEntered = ref(false)
let signCardTimer: ReturnType<typeof setTimeout> | null = null
let signCardCloseTimer: ReturnType<typeof setTimeout> | null = null

function clearSignCardTimers() {
  if (signCardTimer) {
    clearTimeout(signCardTimer)
    signCardTimer = null
  }
  if (signCardCloseTimer) {
    clearTimeout(signCardCloseTimer)
    signCardCloseTimer = null
  }
}

function openSignCard() {
  clearSignCardTimers()
  showSignCard.value = true
  signCardEntered.value = false
  signCardTimer = setTimeout(() => {
    signCardEntered.value = true
  }, 40)
}

function closeSignCard() {
  clearSignCardTimers()
  signCardEntered.value = false
  signCardCloseTimer = setTimeout(() => {
    showSignCard.value = false
  }, 260)
}

function doCheckIn() {
  if (isCheckedIn.value)
    return
  isCheckedIn.value = true
  inspirationPoints.value += 50
  streakDays.value += 1
  weekDays.value[3].status = 'done' // 点亮今天的打卡点
  void apiCheckin().catch(error => console.warn('checkin api fallback to local', error))

  // 延迟一点弹出日签，让用户先看到打卡成功的微反馈，提高体验
  setTimeout(() => {
    openSignCard()
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
      closeSignCard()
    }, 1500)
  }, 1200)
}

onBeforeUnmount(() => {
  clearSignCardTimers()
})

interface IHomeTrack {
  id: number | string
  title: string
  artist: string
  desc: string
  lyric: string
  listeners: string
  tag: string
  cover: string
}

const MOCK_ALBUMS: IHomeTrack[] = [
  { id: 1, title: 'Midnight City', artist: 'M83', desc: '深夜城市感的合成器浪潮，克制而有空间感。', lyric: 'The city is my church.', listeners: '1.2M', tag: 'Synthwave', cover: 'https://picsum.photos/seed/album1/400/400' },
  { id: 2, title: 'Starboy', artist: 'The Weeknd', desc: '暗色流行质感，人声和节奏都很利落。', lyric: 'Look what you have done.', listeners: '4.5M', tag: 'R&B / Pop', cover: 'https://picsum.photos/seed/album2/400/400' },
  { id: 3, title: 'Random Access', artist: 'Daft Punk', desc: '复古电子与现代律动的优雅平衡。', lyric: 'We lose ourselves to dance.', listeners: '8.1M', tag: 'Electronic', cover: 'https://picsum.photos/seed/album3/400/400' },
  { id: 4, title: 'Currents', artist: 'Tame Impala', desc: '迷幻氛围里的情绪递进，耐听且细腻。', lyric: 'Let it happen.', listeners: '3.2M', tag: 'Psychedelic', cover: 'https://picsum.photos/seed/album4/400/400' },
]
const albums = [...MOCK_ALBUMS]
const nowPlaying = ref(false)
const currentAlbum = ref(albums[0])
const heroTrack = ref(albums[Math.floor(Math.random() * albums.length)] || albums[0])
const signQuotePool = [
  'Silence is also a rhythm.',
  'Good taste starts with restraint.',
  'Small details make deep memory.',
  'Leave space, let content breathe.',
]
const signAlbum = computed(() => currentAlbum.value || albums[0])
const signQuote = computed(() => signQuotePool[today.getDate() % signQuotePool.length])
const signIssueNo = computed(() => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`)
const checkinProgress = computed(() => `${weekDays.value.filter(day => day.status === 'done').length}/7`)
const randomPicks = ref([...albums].sort(() => Math.random() - 0.5).slice(0, 3))
const reviewTrack = computed(() => (nowPlaying.value ? currentAlbum.value : heroTrack.value))
const menuOpen = ref(false)
const quickMenus = [
  { key: 'profile', title: '个人中心', subtitle: 'Profile', icon: 'i-carbon-user-avatar-filled' },
  { key: 'market', title: '物料市场', subtitle: 'Asset Market', icon: 'i-carbon-shopping-catalog' },
  { key: 'friends', title: '好友广场', subtitle: 'Friends Plaza', icon: 'i-carbon-group' },
]

function playAlbum(album: any) {
  currentAlbum.value = album
  nowPlaying.value = true
  void refreshTrackComments(album.id)
}
function togglePlay() {
  nowPlaying.value = !nowPlaying.value
}
function playHeroTrack() {
  currentAlbum.value = heroTrack.value
  nowPlaying.value = true
  void refreshTrackComments(heroTrack.value.id)
}

function getReviewContent(comment: any) {
  if (comment.content)
    return comment.content
  const kind = comment.kind
  const track = reviewTrack.value
  if (kind === 'arrangement')
    return `${track.title} 的编曲很干净，鼓点和合成器铺得很克制，情绪推进是“慢慢抬起来”的那种高级感。`
  if (kind === 'vocal')
    return `人声和混响的距离拿捏得很好，${track.artist} 的表达不会过满，反而让这首歌更耐听。`
  return `最打动我的是这首歌的氛围留白，听完会想循环一遍，再回到那句歌词。`
}

// === 4. 评论模块交互 (点赞与回复) ===
const comments = ref([
  {
    id: 1,
    user: 'Alex H.',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    badge: 'Pro', // 增加勋章
    kind: 'arrangement',
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
    kind: 'vocal',
    time: '5 小时前',
    likes: 89,
    isLiked: true,
    replies: 0,
  },
  {
    id: 3,
    user: 'Noah Z.',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    badge: '',
    kind: 'mood',
    time: '8 小时前',
    likes: 46,
    isLiked: false,
    replies: 1,
  },
])

function normalizeListeners(value: number | string | undefined) {
  if (typeof value === 'string')
    return value
  if (typeof value === 'number') {
    if (value >= 1000000)
      return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000)
      return `${(value / 1000).toFixed(1)}K`
    return String(value)
  }
  return '0'
}

function normalizeTrack(item: IMusicItem, fallbackIndex: number): IHomeTrack {
  return {
    id: item.id ?? `api-${fallbackIndex}`,
    title: item.title || item.name || `Track ${fallbackIndex + 1}`,
    artist: item.artist || item.singer || 'Unknown Artist',
    desc: (item as any).desc || (item as any).description || 'A refined track with layered mood and clean arrangement.',
    lyric: item.lyric || 'Music creates the mood we stay in.',
    listeners: normalizeListeners(item.listeners),
    tag: item.tag || 'Editorial',
    cover: item.cover || item.coverUrl || `https://picsum.photos/seed/api-track-${fallbackIndex}/400/400`,
  }
}

function parseMusicPayload(payload: any): IMusicItem[] {
  if (Array.isArray(payload))
    return payload
  if (Array.isArray(payload?.list))
    return payload.list
  if (Array.isArray(payload?.rows))
    return payload.rows
  if (payload && typeof payload === 'object')
    return [payload]
  return []
}

function parseCommentPayload(payload: any): ICommentItem[] {
  if (Array.isArray(payload))
    return payload
  if (Array.isArray(payload?.list))
    return payload.list
  if (Array.isArray(payload?.rows))
    return payload.rows
  return []
}

function formatTimeLabel(time: string | undefined) {
  if (!time)
    return '刚刚'
  return String(time).slice(0, 10)
}

function normalizeComment(item: ICommentItem, index: number) {
  return {
    id: item.id ?? `c-${index}`,
    user: item.user || item.username || item.nickname || `Listener ${index + 1}`,
    avatar: item.avatar || `https://picsum.photos/seed/reviewer-${index}/100/100`,
    badge: index === 0 ? 'Pro' : '',
    kind: 'mood',
    content: item.content || '',
    time: formatTimeLabel(item.createdAt),
    likes: typeof item.likes === 'number' ? item.likes : 0,
    isLiked: Boolean(item.isLiked),
    replies: typeof item.replies === 'number' ? item.replies : 0,
  }
}

async function hydrateUserFromAPI() {
  try {
    const info = await apiUserInfo()
    const points = Number((info as any)?.inspirationPoints ?? (info as any)?.points)
    const streak = Number((info as any)?.streakDays ?? (info as any)?.streak)
    if (!Number.isNaN(points) && points > 0)
      inspirationPoints.value = points
    if (!Number.isNaN(streak) && streak >= 0)
      streakDays.value = streak
    const checked = Boolean((info as any)?.checkedInToday ?? (info as any)?.isCheckedIn)
    if (checked) {
      isCheckedIn.value = true
      weekDays.value[3].status = 'done'
    }
  }
  catch (error) {
    console.warn('user api fallback to mock', error)
  }
}

async function hydrateMusicFromAPI() {
  try {
    const data = await apiRandomMusic({ count: 4 })
    const parsed = parseMusicPayload(data).map(normalizeTrack).filter(Boolean)
    if (parsed.length > 0) {
      heroTrack.value = parsed[0]
      const merged = [...parsed, ...MOCK_ALBUMS].filter((item, index, arr) => arr.findIndex(i => i.id === item.id) === index)
      randomPicks.value = [...merged].sort(() => Math.random() - 0.5).slice(0, 3)
    }
  }
  catch (error) {
    console.warn('music api fallback to mock', error)
  }
}

async function refreshTrackComments(trackId: number | string) {
  try {
    const data = await apiCommentListById(trackId)
    const parsed = parseCommentPayload(data)
    if (parsed.length > 0)
      comments.value = parsed.slice(0, 3).map(normalizeComment)
  }
  catch (error) {
    console.warn('comment api fallback to mock', error)
  }
}

async function hydrateHomeFromAPI() {
  await hydrateUserFromAPI()
  await hydrateMusicFromAPI()
  await refreshTrackComments(heroTrack.value.id)
}

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

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onMenuSelect(menuKey: string) {
  closeMenu()
  if (menuKey === 'profile')
    uni.showToast({ title: '前往个人中心', icon: 'none' })
  else if (menuKey === 'market')
    uni.showToast({ title: '前往物料市场', icon: 'none' })
  else
    uni.showToast({ title: '前往好友广场', icon: 'none' })
  // TODO: 接入真实路由
}

onMounted(() => {
  void hydrateHomeFromAPI()
})
</script>

<template>
  <view class="relative min-h-screen overflow-hidden bg-mobbin-bg">
    <view class="pointer-events-none absolute left-1/2 top-8 h-72 w-72 rounded-full bg-black/[0.03] blur-3xl -translate-x-1/2" />
    <!-- 菜单遮罩 -->
    <view v-if="menuOpen" class="fixed inset-0 z-[55] bg-black/12 backdrop-blur-[2px]" @click="closeMenu" />

    <!-- 悬浮菜单入口 -->
    <view
      class="fixed right-6 z-[60] flex items-center border border-black/8 rounded-full bg-white/86 px-[6px] py-[6px] shadow-[0_12px_24px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform active:scale-95"
      style="top: calc(env(safe-area-inset-top) + 16px);"
      @click="toggleMenu"
    >
      <view class="mr-2.5 flex items-center rounded-full bg-black/4 px-2.5 py-1.5">
        <text class="text-[17px]">✨</text>
        <text class="ml-1 text-[12px] text-mobbin-text-main font-bold">{{ inspirationPoints }}</text>
      </view>
      <view class="h-[34px] w-[34px] flex items-center justify-center border border-black/8 rounded-full bg-white">
        <view class="text-[18px] text-mobbin-text-main" :class="menuOpen ? 'i-carbon-close' : 'i-carbon-menu'" />
      </view>
    </view>

    <!-- 悬浮菜单面板 -->
    <view
      class="fixed right-6 z-[60] w-[220px] border border-black/8 rounded-[22rpx] bg-[#fbfaf8]/95 p-2.5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-260"
      style="top: calc(env(safe-area-inset-top) + 66px);"
      :class="menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'"
    >
      <view
        v-for="item in quickMenus" :key="item.key"
        class="mb-1.5 flex items-center rounded-[14rpx] px-2.5 py-2.5 transition-colors last:mb-0 active:bg-black/5"
        @click="onMenuSelect(item.key)"
      >
        <view class="mr-2.5 h-8 w-8 flex items-center justify-center rounded-[10rpx] bg-white text-[15px] text-mobbin-text-main shadow-[0_10px_16px_-14px_rgba(0,0,0,0.5)]" :class="item.icon" />
        <view class="flex-1">
          <text class="block text-[13px] text-mobbin-text-main font-semibold">{{ item.title }}</text>
          <text class="block text-[10px] text-mobbin-text-sub tracking-[0.08em] uppercase">{{ item.subtitle }}</text>
        </view>
        <view class="i-carbon-chevron-right text-[14px] text-mobbin-text-sub/70" />
      </view>
    </view>

    <!-- Scrollable Body -->
    <scroll-view scroll-y class="box-border h-screen w-full" :show-scrollbar="false">
      <!-- 页面底部留出给悬浮播放器的空间 -->
      <view class="box-border w-full px-6 pb-32 pt-safe">
        <!-- ======================= -->
        <!-- 1. 顶部歌曲 Hero         -->
        <!-- ======================= -->
        <view class="mb-8 mt-[8vh]">
          <view class="hero-shell relative overflow-hidden border border-black/7 rounded-[34rpx] bg-[#f4f3ef] p-2 shadow-[0_18px_26px_-22px_rgba(0,0,0,0.34)]">
            <view class="relative h-[58vw] max-h-[430rpx] min-h-[350rpx] overflow-hidden rounded-[28rpx]">
              <image :src="heroTrack.cover" mode="aspectFill" class="h-full w-full scale-[1.02]" />
              <view class="absolute inset-0 from-black/18 via-black/20 to-black/62 bg-gradient-to-b" />

              <view class="absolute inset-x-0 bottom-0 px-5 pb-4">
                <text class="block max-w-[88%] text-[38px] text-white font-black leading-[0.94] tracking-[-0.01em]">
                  {{ heroTrack.title }}
                </text>

                <view
                  class="mt-4 h-10 w-10 flex items-center justify-center border rounded-full transition-all"
                  :class="nowPlaying && currentAlbum.id === heroTrack.id ? 'border-white bg-white text-mobbin-text-main' : 'border-white/36 bg-white/12 text-white'"
                  @click="playHeroTrack"
                >
                  <view class="text-[16px]" :class="nowPlaying && currentAlbum.id === heroTrack.id ? 'i-carbon-pause-filled' : 'i-carbon-play-filled-alt ml-0.5'" />
                </view>
              </view>
            </view>
          </view>

          <view class="mt-3 px-1">
            <text class="block text-[13px] text-mobbin-text-main font-semibold">{{ heroTrack.artist }}</text>
            <text class="line-clamp-1 mt-1 block text-[12px] text-mobbin-text-sub leading-[1.5]">{{ heroTrack.desc }}</text>
          </view>

          <view class="mt-3 overflow-hidden border border-black/6 rounded-[20rpx] bg-white/84 p-2.5 shadow-[0_10px_18px_-18px_rgba(0,0,0,0.35)]">
            <view class="mb-2.5 flex items-center justify-between px-1">
              <text class="text-[12px] text-mobbin-text-main font-semibold tracking-[0.08em] uppercase">编辑私藏</text>
              <text class="text-[10px] text-mobbin-text-sub tracking-[0.12em] uppercase">Blend In Mood</text>
            </view>
            <scroll-view scroll-x class="whitespace-nowrap" :show-scrollbar="false">
              <view class="inline-flex gap-2">
                <view
                  v-for="album in randomPicks" :key="album.id"
                  class="w-[186rpx] flex items-center border border-black/6 rounded-[14rpx] bg-[#f7f6f2] p-2 active:scale-[0.99]"
                  @click="playAlbum(album)"
                >
                  <image :src="album.cover" class="h-10 w-10 rounded-[10rpx]" mode="aspectFill" />
                  <view class="ml-2 flex-1 overflow-hidden">
                    <text class="block truncate text-[12px] text-mobbin-text-main font-semibold">{{ album.title }}</text>
                    <text class="mt-0.5 block truncate text-[10px] text-mobbin-text-sub">{{ album.artist }}</text>
                  </view>
                  <view class="ml-1 h-7 w-7 flex items-center justify-center rounded-full" :class="nowPlaying && currentAlbum.id === album.id ? 'bg-mobbin-text-main text-white' : 'bg-black/6 text-mobbin-text-main'">
                    <view :class="nowPlaying && currentAlbum.id === album.id ? 'i-carbon-pause-filled text-[12px]' : 'i-carbon-play-filled-alt ml-0.5 text-[12px]'" />
                  </view>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>

        <view class="mb-12">
          <view class="mb-5 flex items-center justify-between">
            <text class="text-[24px] text-mobbin-text-main font-bold tracking-tight">乐评圆桌</text>
            <text class="text-[13px] text-mobbin-text-sub font-medium tracking-[0.08em] uppercase">Track Review</text>
          </view>

          <view class="mb-4 border border-black/6 rounded-[22rpx] bg-white/88 p-4 shadow-[0_10px_18px_-18px_rgba(0,0,0,0.32)]">
            <view class="mb-2 flex items-center justify-between">
              <text class="text-[11px] text-mobbin-text-sub font-semibold tracking-[0.14em] uppercase">Current Track</text>
              <text class="text-[11px] text-mobbin-text-main font-bold">{{ reviewTrack.title }}</text>
            </view>
            <text class="text-[15px] text-mobbin-text-main font-medium leading-[1.65]">
              正在乐评：{{ reviewTrack.artist }} 的「{{ reviewTrack.title }}」。这不是泛讨论区，而是围绕当前歌曲的听感、编曲与情绪表达。
            </text>
          </view>

          <view class="flex flex-col gap-3">
            <view v-for="comment in comments" :key="comment.id" class="border border-black/6 rounded-[20rpx] bg-white/88 p-4 shadow-[0_10px_18px_-18px_rgba(0,0,0,0.28)]">
              <view class="mb-3 flex items-center">
                <image :src="comment.avatar" class="mr-3 h-9 w-9 border border-black/8 rounded-full bg-gray-100" mode="aspectFill" />
                <view class="flex flex-1 items-center justify-between">
                  <view>
                    <view class="flex items-center gap-2">
                      <text class="text-[14px] text-mobbin-text-main font-bold">{{ comment.user }}</text>
                      <text v-if="comment.badge" class="rounded-full bg-black/5 px-2 py-[2px] text-[10px] text-mobbin-text-sub font-semibold tracking-[0.08em] uppercase">{{ comment.badge }}</text>
                    </view>
                    <text class="mt-0.5 block text-[11px] text-mobbin-text-sub">{{ comment.time }}</text>
                  </view>

                  <view class="flex items-center gap-2 text-[12px] text-mobbin-text-sub">
                    <view class="i-carbon-chat" />
                    <text>{{ comment.replies }}</text>
                  </view>
                </view>
              </view>

              <text class="block text-[15px] text-mobbin-text-main/90 font-medium leading-[1.65]">{{ getReviewContent(comment) }}</text>

              <view class="mt-4 flex items-center justify-between">
                <view class="rounded-full bg-black/4 px-3 py-1.5 text-[11px] text-mobbin-text-sub font-semibold tracking-[0.08em] uppercase">
                  {{ reviewTrack.title }} Review
                </view>
                <view
                  class="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors" :class="comment.isLiked ? 'bg-red-50 text-red-500' : 'bg-black/4 text-mobbin-text-sub'"
                  @click="toggleLike(comment)"
                >
                  <view class="text-[15px] transition-transform duration-300" :class="[comment.isLiked ? 'i-carbon-favorite-filled scale-110' : 'i-carbon-favorite']" />
                  <text class="text-[13px] font-bold font-mono">{{ comment.likes }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="mt-4 flex items-center border border-mobbin-border rounded-full bg-mobbin-card p-1.5 shadow-mobbin-sm">
            <image src="https://picsum.photos/seed/myavatar/100/100" class="ml-1 h-8 w-8 rounded-full" mode="aspectFill" />
            <text class="flex-1 pl-3 text-[14px] text-gray-400">写下你对《{{ reviewTrack.title }}》的乐评...</text>
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
    <view v-if="showSignCard" class="fixed inset-0 z-[100] flex flex-col items-center justify-center" @touchmove.stop.prevent>
      <!-- 毛玻璃厚遮罩层 -->
      <view class="sign-mask absolute inset-0 bg-black/60 backdrop-blur-md" :class="{ 'is-entered': signCardEntered }" @click="closeSignCard" />

      <!-- 仪式感光晕 -->
      <view class="sign-halo pointer-events-none absolute h-[56vh] w-[56vh] rounded-full" :class="{ 'is-entered': signCardEntered }" />

      <!-- 日签卡片主体 -->
      <view id="daily-sign-card" class="sign-card relative z-10 w-[80vw] flex flex-col overflow-hidden border border-white/40 rounded-[44rpx] bg-[#f4f4f2] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.45)]" :class="{ 'is-entered': signCardEntered }">
        <view class="relative h-[42vw] max-h-[360rpx] min-h-[280rpx] w-full overflow-hidden">
          <image :src="signAlbum.cover" mode="aspectFill" class="h-full w-full scale-[1.02]" />
          <view class="absolute inset-0 from-black/56 via-black/16 to-transparent bg-gradient-to-t" />
          <view class="absolute left-5 top-5 border border-white/35 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-md">
            <text class="text-[10px] text-white/90 font-semibold tracking-[0.22em] uppercase">Daily Curated</text>
          </view>

          <view class="absolute bottom-5 left-5 right-5">
            <text class="block text-[22px] text-white font-black leading-tight tracking-tight">{{ signAlbum.title }}</text>
            <text class="mt-1 block text-[13px] text-white/80 font-medium">{{ signAlbum.artist }}</text>
          </view>
        </view>

        <view class="sign-note relative bg-[#f9f9f7] px-6 pb-6 pt-5">
          <view class="mb-4 flex items-center justify-between">
            <view class="border border-black/8 rounded-full bg-white/80 px-3 py-1.5">
              <text class="text-[11px] text-mobbin-text-main font-semibold tracking-[0.12em] uppercase">{{ dayName }}</text>
            </view>
            <view class="text-right">
              <text class="block text-[9px] text-mobbin-text-sub font-medium tracking-[0.22em] uppercase">Issue</text>
              <text class="mt-1 block text-[11px] text-mobbin-text-main font-semibold tracking-[0.08em]">{{ signIssueNo }}</text>
            </view>
          </view>

          <text class="block text-[26px] text-mobbin-text-main font-black leading-none tracking-tight">{{ dateNum }}</text>
          <text class="mt-1 block text-[11px] text-mobbin-text-sub font-semibold tracking-[0.26em] uppercase">{{ monthName }}</text>

          <view class="mt-5 h-px w-full bg-black/8" />

          <view class="mt-5 flex">
            <view class="mr-3 mt-[2px] h-[14px] w-[2px] rounded-full bg-mobbin-text-main/70" />
            <text class="flex-1 text-[16px] text-mobbin-text-main font-semibold leading-[1.6] tracking-[0.01em]">"{{ signQuote }}"</text>
          </view>

          <view class="mt-6 flex items-center justify-between border border-black/6 rounded-full bg-white/85 px-4 py-2">
            <text class="text-[10px] text-mobbin-text-sub font-semibold tracking-[0.16em] uppercase">Mood Index</text>
            <view class="flex items-center gap-1.5">
              <view class="h-1.5 w-1.5 rounded-full bg-mobbin-text-main" />
              <view class="h-1.5 w-1.5 rounded-full bg-mobbin-text-main/60" />
              <view class="h-1.5 w-1.5 rounded-full bg-mobbin-text-main/35" />
            </view>
          </view>
        </view>
      </view>

      <!-- 操作区 -->
      <view class="sign-actions z-10 mt-8 flex flex-col items-center" :class="{ 'is-entered': signCardEntered }">
        <view class="h-[48px] flex items-center justify-center border border-white/30 rounded-full bg-white/92 px-10 text-[15px] text-mobbin-text-main font-bold shadow-mobbin-hover transition-transform active:scale-95" @click="saveSignCard">
          保存日签到相册
        </view>
        <view class="mt-4 text-[13px] text-white/60 tracking-wider active:opacity-50" @click="closeSignCard">
          轻触背景关闭
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sign-mask {
  opacity: 0;
  transition: opacity 0.32s ease;
}

.sign-mask.is-entered {
  opacity: 1;
}

.sign-halo {
  opacity: 0;
  transform: scale(0.78) translateY(18px);
  background:
    radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.42), transparent 42%),
    radial-gradient(circle at 70% 70%, rgba(255, 248, 232, 0.45), transparent 44%);
  transition:
    opacity 0.52s ease,
    transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
}

.sign-halo.is-entered {
  opacity: 0.95;
  transform: scale(1) translateY(0);
}

.sign-card {
  opacity: 0;
  transform: translateY(34px) scale(0.9) rotate(-1.2deg);
  transform-origin: 50% 78%;
  transition:
    transform 0.66s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.42s ease;
}

.sign-card.is-entered {
  opacity: 1;
  transform: translateY(0) scale(1) rotate(0);
}

.sign-note::before {
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(17, 17, 17, 0.12), transparent);
  content: '';
}

.sign-actions {
  opacity: 0;
  transform: translateY(14px) scale(0.96);
  transition:
    transform 0.44s ease,
    opacity 0.34s ease;
  transition-delay: 0s;
}

.sign-actions.is-entered {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: 0.16s;
}

::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
