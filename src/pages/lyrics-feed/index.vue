<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script setup lang="ts">
// 「歌词击中了我」全局 Feed 页
</script>

<template>
  <view class="lyrics-feed-page">
    <!-- TODO: 歌词卡片 Feed（第三阶段实现） -->
    <view class="placeholder">
      <text>📖 歌词流</text>
      <text class="sub">被击中的那些瞬间</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lyrics-feed-page {
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
