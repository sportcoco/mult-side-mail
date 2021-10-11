<template>
  <view class="text">{{ title }}</view>
</template>

<script>
export default {
  name: 'IndexText',
  props: {
    title: {
      type: String,
      default: 'Hellow',
    },
  },
};
</script>

<style lang="scss">
.text {
  font-size: 40rpx;
  color: $uni-color-primary;
  text-align: center;
  padding: 20rpx;
}
</style>
