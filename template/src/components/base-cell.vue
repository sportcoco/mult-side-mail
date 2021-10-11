<template>
  <view class="container">
    <view class="cell" :style="{ height: avatarSrc || articleSrc ? 'auto' : '224rpx' }">
      <view class="avatar" v-if="avatarSrc || articleSrc">
        <u-avatar v-if="avatarSrc" size="100" :src="avatarSrc"></u-avatar>
        <u-image v-if="articleSrc" width="200" height="128" :src="articleSrc" mode="aspectFill"></u-image>
      </view>
      <view class="label" :style="{ maxWidth: maxWidth }">
        <view class="label-title">
          <view>{{ title }}</view>
          <view v-if="tag">
            <u-tag :text="tag" type="success" shape="circle" size="mini" />
          </view>
        </view>
        <view class="label-content" v-if="content">{{ content }}</view>
        <view class="label-des" v-if="des">{{ des }}</view>
      </view>

      <view class="icon" :style="{ width: date ? '230rpx' : '80rpx' }">
        <view class="date" v-if="date">{{ date }}</view>
        <view class="icon-right">
          <u-icon custom-prefix="base-icon" name="xiayibu" size="40" color="var(--u-type-primary)"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 头像类型
    avatarSrc: {
      type: String,
      default: ''
    },
    // 文章类型
    articleSrc: {
      type: String,
      default: ''
    },
    // 标题文字
    // 文章类型
    title: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    des: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    maxWidth() {
      if (this.avatarSrc) {
        return '480rpx';
      }
      if (this.articleSrc) {
        return '347rpx';
      }
      if (!this.avatarSrc && !this.avatarSrc) {
        return '347rpx';
      }
      return '347rpx';
    }
  },
  methods: {},
  created() {}
};
</script>

<style lang="scss" scoped>
$colors: (
  u-type-primary: $u-type-primary
);
.container {
  @each $name, $color in $colors {
    --#{$name}: #{$color};
  }
  padding: 16rpx 0;
  .cell {
    background: rgba($normal-color, 0.2);
    padding: 16rpx 0 16rpx 16rpx;
    border-radius: 16rpx;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    .avatar {
      padding: 16rpx 16rpx 16rpx 0;
    }
    .label {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-evenly;
      align-items: flex-start;
      max-width: 480rpx;
      &-title {
        display: flex;
        justify-content: center;
        align-items: center;
        & > view:first-child {
          font-size: 30rpx;
          font-weight: bold;
          padding-right: 16rpx;
        }
      }
      &-content {
        width: 100%;
        color: $u-content-color;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &-des {
        width: 100%;
        color: $u-content-color;
        white-space: nowrap;
      }
    }
    .date {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 16rpx;
      color: $u-content-color;
    }
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      &-right {
        width: 36rpx;
        height: 36rpx;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
