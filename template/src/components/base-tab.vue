<template>
  <view class="u-subsection" :style="[subsectionStyle]">
    <view
      v-for="(item, index) in listInfo"
      :key="index"
      :class="['u-item', 'u-line-1', 'u-item-' + index]"
      @tap="click(index)"
    >
      <view :class="['u-item-text', 'u-line-1', textClass(index)]">{{ item.name }}</view>
    </view>
    <view :class="['u-item-bg', mode === 'subsection' ? 'u-flex u-row-center' : '']" :style="[itemBarStyle]">
      <view v-if="mode === 'subsection'" :class="[barItemClass]" :style="[barItemStyle]"></view>
    </view>
  </view>
</template>

<script>
import uSubsection from 'uview-ui/components/u-subsection/u-subsection';
export default {
  name: 'BaseTab',
  extends: uSubsection,
  props: {
    // tab的数据
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    // 当前活动的tab的index
    current: {
      type: [Number, String],
      default: 0
    },
    // 模式选择，mode=button为按钮形式，mode=subsection时为小滑块模式
    mode: {
      type: String,
      default: 'button'
    },
    // 主题颜色
    type: {
      type: String,
      default: 'primary'
    },
    // 组件的高度，单位rpx
    height: {
      type: [Number, String],
      default: 80
    },
    // 字体大小，单位rpx
    fontSize: {
      type: [Number, String],
      default: 26
    },
    // 是否开启动画效果
    animation: {
      type: Boolean,
      default: true
    },
    // 激活tab的字体是否加粗
    bold: {
      type: Boolean,
      default: true
    },
    // mode = button时，滑块背景颜色
    buttonColor: {
      type: String,
      default: '#ffffff'
    },
    // mode=button时，组件背景颜色
    bgColor: {
      type: String,
      default: '#F9F9F9'
    },
    // mode=subsection时，滑块长度
    barWidth: {
      type: [Number, String],
      default: 60
    },
    // mode=subsection时，滑块宽度
    barHeight: {
      type: [Number, String],
      default: 8
    },
    // 在切换分段器的时候，是否让设备震一下
    vibrateShort: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buttonPadding: 5, // mode = button 时，组件的内边距
      borderRadius: 999 // 圆角值
    };
  },
  computed: {
    // 文字样式
    textClass() {
      return index => {
        const useClass = [];
        const THEME_TYPE = `u-type-${this.type}`;
        // 设置字体颜色
        const textColor = index === this.currentIndex ? THEME_TYPE : 'u-tips-color';
        useClass.push(textColor);
        // 字体加粗
        if (index === this.currentIndex && this.bold) useClass.push('text-bold');
        // 文字大小
        useClass.push(`u-font-${this.fontSize}`);

        return useClass.join(' ');
      };
    },
    // 滑块外部的样式
    itemBarStyle() {
      const style = {};
      style.zIndex = 0;
      style.backgroundColor = '';
      style.borderRadius = `${this.borderRadius}px`;
      if (this.mode === 'button') {
        style.backgroundColor = this.buttonColor;
        style.bottom = `${this.buttonPadding}px`;
        style.height = uni.upx2px(this.height) - this.buttonPadding * 2 + 'px';
      } else if (this.mode === 'subsection') {
        style.height = `${uni.upx2px(this.barHeight)}px`;
        style.backgroundColor = 'transparent';
        style.bottom = 0;
      }
      return Object.assign(this.itemBgStyle, style);
    },
    // 滑块内部主题色的样式
    barItemClass() {
      const useClass = [];
      const THEME_TYPE = `u-type-${this.type}-bg`;
      if (this.mode === 'subsection') {
        useClass.push(THEME_TYPE);
      }
      return useClass.join(' ');
    },
    // 滑块内部的样式
    barItemStyle() {
      const style = {};
      if (this.mode === 'subsection') {
        style.width = `${uni.upx2px(this.barWidth)}px`;
        style.height = `${uni.upx2px(this.barHeight)}px`;
        style.borderRadius = `${this.borderRadius}px`;
      }
      return style;
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

.u-subsection {
  @include vue-flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.u-item {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  height: 100%;
  @include vue-flex;
  align-items: center;
  justify-content: center;
  color: $u-main-color;
  padding: 0 6rpx;
}

.u-item-bg {
  background-color: $u-type-primary;
  position: absolute;
  z-index: -1;
}

.u-none-border-right {
  border-right: none !important;
}

.u-item-first {
  border-top-left-radius: 8rpx;
  border-bottom-left-radius: 8rpx;
}

.u-item-last {
  border-top-right-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}

.u-item-text {
  transition: all 0.35s;
  @include vue-flex;
  align-items: center;
  position: relative;
  z-index: 3;
}
</style>
