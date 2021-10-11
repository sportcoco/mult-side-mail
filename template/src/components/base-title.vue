<template>
  <view class="te-service">
    <u-row gutter="16" justify="space-between">
      <u-col span="8">
        <view class="left">
          <u-icon
            v-if="icon"
            :name="icon"
            style="margin-right: 16rpx"
            :color="iconColor"
            :custom-prefix="iconPrefix"
            :size="iconSize"
          ></u-icon>
          <text class="text-theme-primary u-font-30 text-bold">{{ title }}</text>
        </view>
      </u-col>
      <u-col span="4">
        <view class="show">
          <slot name="right"></slot>
        </view>
      </u-col>
    </u-row>
  </view>
</template>

<script>
export default {
  name: 'BaseTitle',
  props: {
    // 标题文字
    title: {
      type: String,
      default: '标题文字'
    },
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    },
    iconSize: {
      type: String,
      default: '28'
    },
    iconPrefix: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
.te-service {
  padding: 16rpx 0;
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .show {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
