<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGrowthStore } from '@/store/growth'

const growthStore = useGrowthStore()

onMounted(() => {
  growthStore.fetchGrowthInfo()
})
</script>

<template>
  <view class="profile-page">
    <!-- TODO: 个人主页（第五阶段实现） -->
    <view class="placeholder">
      <text>👤 我的</text>
      <text class="sub">个人空间</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.profile-page {
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
