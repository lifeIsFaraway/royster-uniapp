<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({ name: 'Guide' })
definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
  },
})

const current = ref(0)
function swiperChange(e: any) {
  current.value = e.detail.current
}

const list = [
  {
    title: '发现顶级设计',
    desc: '浏览数千种真实 App 的设计模式和 UI 组件',
    image: 'https://picsum.photos/seed/mobbin1/600/1200',
  },
  {
    title: '收藏你的灵感',
    desc: '将你最喜欢的屏幕截图和设计分门别类，建立你的个人素材库',
    image: 'https://picsum.photos/seed/mobbin2/600/1200',
  },
  {
    title: '像素级的完美',
    desc: '直接复制常用的设计 Token，快速构建属于你的产品',
    image: 'https://picsum.photos/seed/mobbin3/600/1200',
  },
]

function goHome() {
  // 因为你已经关闭了默认的 Tabbar，这里使用 reLaunch 清除页面栈进入首页
  uni.reLaunch({ url: '/pages/index/index' })
}

function handleNext() {
  if (current.value < list.length - 1) {
    current.value++
  }
}
</script>

<template>
  <view class="relative h-screen w-screen flex flex-col overflow-hidden bg-mobbin-bg">
    <!-- 顶部占位与跳过按钮 -->
    <view class="absolute left-0 right-0 top-0 z-10 mt-6 box-border flex justify-end px-6 pt-safe">
      <view class="px-2 py-1 text-[15px] text-mobbin-text-sub font-medium tracking-wider transition-all active:opacity-50" @click="goHome">
        跳过
      </view>
    </view>

    <!-- 主体轮播图 -->
    <swiper class="h-full w-full flex-1" :current="current" :circular="false" :indicator-dots="false" @change="swiperChange">
      <swiper-item v-for="(item, index) in list" :key="index">
        <!-- 增加了一层 view wrapper，因为 uni-app 中 swiper-item 直接加 relative 和 flex 会在部分端失效 -->
        <view class="relative box-border h-full w-full flex flex-col items-center px-8 pt-[12vh]">
          <!-- 超大极简数字水印底纹，丰富页面但绝不抢戏 -->
          <view
            class="pointer-events-none absolute top-[6vh] z-0 select-none text-[240px] text-black/[0.015] font-bold leading-none transition-all duration-1000 ease-out -left-8"
            :class="current === index ? 'translate-x-4 opacity-100' : '-translate-x-12 opacity-0'"
          >
            0{{ index + 1 }}
          </view>

          <!-- 核心配图动画区域（大幅提调卡片的尺寸，让高质量截图震撼视野） -->
          <view
            class="relative z-10 aspect-[1/1.9] max-h-[55vh] w-[75vw] flex items-center justify-center transition-all duration-1000 ease-out"
            :class="current === index ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'"
          >
            <!-- 背层卡片装饰 (更深一点的倾斜) -->
            <view class="absolute inset-0 rotate-[8deg] scale-95 border border-mobbin-border rounded-[40rpx] bg-mobbin-card shadow-mobbin-sm transition-transform duration-700 delay-100" />

            <!-- 前层主图卡片 -->
            <view class="absolute inset-0 overflow-hidden border border-mobbin-border rounded-[40rpx] bg-mobbin-card shadow-mobbin-hover transition-transform duration-700 -rotate-[4deg] hover:rotate-0">
              <image :src="item.image" mode="aspectFill" class="h-full w-full opacity-95 transition-transform duration-1000 hover:scale-105" />
            </view>
          </view>

          <!-- 轻量化、通透的文本排版 -->
          <view
            class="z-10 mt-12 w-full px-2 text-left transition-all duration-700 delay-200 ease-out"
            :class="current === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
          >
            <view class="mb-3 text-3xl text-mobbin-text-main font-semibold tracking-tight">
              {{ item.title }}
            </view>
            <view class="text-[15px] text-mobbin-text-sub font-normal leading-[1.7] opacity-90">
              {{ item.desc }}
            </view>
          </view>

          <!-- 将按钮放置入 slide 内部，跟随滑动 -->
          <view class="pointer-events-none absolute bottom-0 left-0 right-0 box-border flex items-center justify-end px-8 pb-12 pt-4 pb-safe">
            <view class="pointer-events-auto h-12 flex items-center justify-end">
              <!-- 极简文字+箭头 -->
              <view
                v-if="index < list.length - 1"
                class="z-10 flex items-center text-[17px] text-mobbin-text-main font-semibold transition-all active:opacity-50"
                @click="handleNext"
              >
                继续
                <view class="i-carbon-arrow-right ml-1 text-xl" />
              </view>

              <!-- 极致极简文字（移除完整的药丸背景框） -->
              <view
                v-else
                class="z-10 flex items-center text-[17px] text-mobbin-text-main font-bold transition-all active:opacity-50"
                @click="goHome"
              >
                开始探索
                <view class="i-carbon-arrow-right ml-1 text-xl" />
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 底部极简静态进度器 -->
    <view class="pointer-events-none absolute bottom-0 left-0 right-0 z-0 box-border flex items-center px-8 pb-12 pt-4 pb-safe">
      <view class="h-12 flex items-center space-x-2">
        <view
          v-for="(_, index) in list" :key="index"
          class="h-1 rounded-full transition-all duration-500 ease-out"
          :class="current === index ? 'w-6 bg-mobbin-text-main' : 'w-1.5 bg-gray-200'"
        />
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 隐藏原生 swiper scrollbar 如果有的情况 */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
