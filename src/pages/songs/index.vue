<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSongStore } from '@/store/song'

const songStore = useSongStore()

onMounted(() => {
  songStore.fetchSongList()
})
</script>

<template>
  <view class="songs-page">
    <!-- TODO: 歌库列表（第二阶段实现） -->
    <view class="placeholder">
      <text>🎵 歌库</text>
      <text class="sub">全部歌曲</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.songs-page {
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
