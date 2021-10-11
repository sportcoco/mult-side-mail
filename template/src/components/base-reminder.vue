<template>
  <view class="u-border-top u-p-t-40">
    <view class="u-flex u-m-b-30">
      <u-icon :name="name" custom-prefix="base-icon" :size="iconSize" color="primary"></u-icon>
      <view class="text-theme-primary u-font-lg text-bold u-m-l-10">{{ title }}</view>
    </view>
    <view class="u-font-md reminder-text">
      <text>{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BaseReminder',
  props: {
    // 图标路径
    name: {
      type: String,
      default: 'wenxintishi'
    },
    // 提示标题
    title: {
      type: String,
      default: '温馨提示'
    },
    // 提示内容
    text: {
      type: String,
      default: ''
    },
    // 图标的大小
    iconSize: {
      type: [String, Number],
      default: 30
    }
  }
};
</script>
<style lang="scss" scoped>
.reminder-text {
  font-weight: 500;
  line-height: 44rpx;
  color: $u-tips-color;
}
</style>
