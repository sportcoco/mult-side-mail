<template>
  <view
    class="u-empty"
    v-if="show"
    :style="{
      marginTop: marginTop + 'rpx'
    }"
  >
    <u-icon
      :name="mode ? `empty-${mode}` : src"
      :custom-style="iconStyle"
      :label="text ? text : icons[mode]"
      label-pos="bottom"
      :label-color="color"
      :label-size="fontSize"
      :size="mode ? iconSize : imgWidth"
      :color="iconColor"
      margin-top="60"
    ></u-icon>
    <view class="u-slot-wrap">
      <slot name="bottom"></slot>
    </view>
  </view>
</template>

<script>
import uEmpty from 'uview-ui/components/u-empty/u-empty';
export default {
  name: 'BaseEmpty',
  extends: uEmpty,
  props: {
    // 图标路径
    src: {
      type: String,
      default: 'https://images-file-web.healthan.net/common/base/empty-1.png'
    },
    // 提示文字
    text: {
      type: String,
      default: '您还没有添加就诊卡'
    },
    // 文字颜色
    color: {
      type: String,
      default: '#c0c4cc'
    },
    // 图标的颜色
    iconColor: {
      type: String,
      default: '#c0c4cc'
    },
    // 图标的大小
    iconSize: {
      type: [String, Number],
      default: 120
    },
    // 文字大小，单位rpx
    fontSize: {
      type: [String, Number],
      default: 26
    },
    // 选择预置的图标类型
    mode: {
      type: String,
      default: ''
    },
    //  图标宽度，单位rpx
    imgWidth: {
      type: [String, Number],
      default: 490
    },
    // 图标高度，单位rpx
    imgHeight: {
      type: [String, Number],
      default: 'auto'
    },
    // 是否显示组件
    show: {
      type: Boolean,
      default: true
    },
    // 组件距离上一个元素之间的距离
    marginTop: {
      type: [String, Number],
      default: 100
    },
    iconStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin vue-flex($direction: row) {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: $direction;
  /* #endif */
}

.u-empty {
  @include vue-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.u-image {
  margin-bottom: 20rpx;
}

.u-slot-wrap {
  @include vue-flex;
  justify-content: center;
  align-items: center;
  margin-top: 20rpx;
}
</style>
