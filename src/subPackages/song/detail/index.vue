<route lang="json5">
{
  style: {
    navigationBarTitleText: '歌曲详情',
  },
}
</route>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

onLoad((options) => {
  console.log('song id:', options?.id)
})
</script>

<template>
  <view class="container">
    <text>歌曲详情</text>
  </view>
</template>

<style scoped>
.container {
  padding: 30rpx;
  min-height: 100vh;
  background-color: #0d0d0d;
  color: #fff;
}
</style>
