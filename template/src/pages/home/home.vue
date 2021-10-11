<template>
  <view class="content">
    <the-logo />
    <home-text title="Hellow the world" />
    <button class="button" @click="showTips">{{ buttonText }}</button>
  </view>
</template>

<script>
import TheLogo from './components/the-logo';
import HomeText from './components/home-text';
export default {
  components: {
    TheLogo,
    HomeText
  },
  data() {
    return {
      buttonText: 'click me'
    };
  },
  methods: {
    showTips() {
      uni.showModal({
        title: '提示',
        content: 'Hellow the world',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.button {
  font-size: 26rpx;
}
</style>
