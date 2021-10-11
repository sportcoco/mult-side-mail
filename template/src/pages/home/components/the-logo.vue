<template>
  <view class="image-wrap">
    <image class="logo" :src="src"></image>
  </view>
</template>

<script>
export default {
  name: 'TheLogo',
  data() {
    return {
      src: require('@/assets/images/logo.png'),
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss">
.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 50rpx auto;
}
</style>
