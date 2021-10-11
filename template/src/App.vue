<script>
export default {
  onLaunch: async function () {
    await this.$store.dispatch('login/login');
    await this.$store.dispatch('card/getCardList');
  },
  onShow: function () {},
  onHide: function () {}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uview-ui/index.scss';
@import '@/assets/styles/common.scss';
@import '@/assets/styles/iconfont.scss';
</style>
