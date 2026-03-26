<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGrowthStore } from '@/store/growth'
import { useSongStore } from '@/store/song'

const songStore = useSongStore()
const growthStore = useGrowthStore()

onMounted(async () => {
  // 首页加载时预拉取数据
  await Promise.all([
    songStore.fetchSongList(),
    growthStore.fetchGrowthInfo(),
  ])
})
</script>

<template>
  <view class="home-page">
    <!-- TODO: 首页内容（第二阶段实现） -->
    <view class="placeholder">
      <text>🏠 首页</text>
      <text class="sub">Royster Lee 的音乐世界</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: #0d0d0d;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  text {
    color: #fff;
    font-size: 48rpx;
  }
  .sub {
    color: rgba(255, 255, 255, 0.5);
    font-size: 28rpx;
  }
}
</style>
