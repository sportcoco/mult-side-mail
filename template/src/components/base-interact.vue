<template>
  <view class="interact">
    <!-- <u-toast ref="uToast" /> -->
    <u-top-tips ref="uTips" />
    <view :class="['u-modal-wrapper', modalOptions.type]">
      <template v-if="modalOptions.useSlotName">
        <u-modal
          v-model="modalStatus"
          ref="uModal"
          :title="modalOptions.title"
          :content="modalOptions.content"
          :confirm-text="modalOptions.confirmText"
          :cancel-text="modalOptions.cancelText"
          :show-title="modalOptions.showTitle"
          :show-cancel-button="modalOptions.showCancelButton"
          @confirm="handlerModalFunction('confirm')"
          @cancel="handlerModalFunction('cancel')"
        >
          <!-- #ifdef H5 -->
          <slot :name="'modal-' + modalOptions.useSlotName" v-if="modalOptions.useSlotName" />
          <!-- #endif -->
          <!-- #ifdef MP -->
          <slot name="modal-{{modalOptions.useSlotName}}" v-if="modalOptions.useSlotName" />
          <!-- #endif -->
        </u-modal>
      </template>
      <template v-else>
        <template v-if="modalStatus">
          <u-modal
            v-model="modalStatus"
            ref="uModal"
            :title="modalOptions.title"
            :content="modalOptions.content"
            :confirm-text="modalOptions.confirmText"
            :cancel-text="modalOptions.cancelText"
            :show-title="modalOptions.showTitle"
            :show-cancel-button="modalOptions.showCancelButton"
            @confirm="handlerModalFunction('confirm')"
            @cancel="handlerModalFunction('cancel')"
          />
        </template>
      </template>
    </view>
    <view :class="['loading', loadingOptions.type, loadingOptions.mask ? '' : 'mask-through']">
      <u-mask :show="loadingStatus">
        <view class="loading-content">
          <u-loading :show="loadingStatus" :mode="loadingOptions.mode" :size="loadingOptions.size" />
          <view v-if="loadingOptions.title" class="loading-title">{{ loadingOptions.title }}</view>
        </view>
      </u-mask>
    </view>
  </view>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'BaseInteract',
  data() {
    // 定义 modal 参数
    const modalOptions = {
      title: '提示',
      content: '我是内容',
      useSlotName: '', // 自定义slot name, 修改modal 内容，content 会失效
      confirmText: '确认',
      cancelText: '取消',
      showTitle: false,
      width: 500,
      type: 'primary',
      showCancelButton: false,
      success: function () {},
      fail: function () {}
    };

    // 定义 loading 参数
    const loadingOptions = {
      type: 'primary',
      title: '加载中',
      mode: 'circle',
      size: '40',
      mask: false
    };

    return { modalOptions, modalStatus: false, loadingOptions, loadingStatus: false };
  },
  options: { styleIsolation: 'shared' },
  created() {
    const funcitonKeys = ['showToast', 'showTips', 'showModal', 'showLoading', 'hideLoading'];
    const target = Vue.prototype.$u;
    for (const item of funcitonKeys) {
      target[item] = this[item].bind(this);
    }
  },
  methods: {
    showLoading(opts) {
      this.loadingStatus = true;
      Object.assign(this.loadingOptions, { ...opts });
    },
    hideLoading() {
      this.loadingStatus = false;
    },
    showToast(args = {}) {
      if (typeof args === 'string') {
        args = {
          title: args,
          icon: 'none'
        };
      }
      return uni.showToast(args);
    },
    showTips(...args) {
      return this.$refs.uTips.show(...args);
    },
    showModal(opts) {
      this.modalStatus = true;
      Object.assign(this.modalOptions, { ...opts });
    },
    handlerModalFunction(type) {
      let Fn = function () {};
      switch (type) {
        case 'confirm':
          Fn = this.modalOptions.success;
          break;
        case 'cancel':
          Fn = this.modalOptions.fail;
          break;
      }
      if (typeof Fn === 'function') {
        Fn();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-modal-wrapper::v-deep {
  .u-model__content__message {
    padding: 58rpx 30rpx;
    font-weight: bold;
    color: $u-main-color;
  }
  .u-model__footer {
    background: #f5f5f5;
  }
}
.interact .primary::v-deep {
  .u-model__footer__button.hairline-left {
    color: $u-type-primary !important;
  }
  .u-loading-circle {
    border-color: #e5e5e5 #e5e5e5 #e5e5e5 $u-type-primary !important;
  }
}
.interact .success::v-deep {
  .u-model__footer__button.hairline-left {
    color: $u-type-success !important;
  }
  .u-loading-circle {
    border-color: #e5e5e5 #e5e5e5 #e5e5e5 $u-type-primary !important;
  }
}
.interact .info::v-deep {
  .u-model__footer__button.hairline-left {
    color: $u-type-info !important;
  }
  .u-loading-circle {
    border-color: #e5e5e5 #e5e5e5 #e5e5e5 $u-type-info !important;
  }
}
.interact .warning::v-deep {
  .u-model__footer__button.hairline-left {
    color: $u-type-warning !important;
  }
  .u-loading-circle {
    border-color: #e5e5e5 #e5e5e5 #e5e5e5 $u-type-warning !important;
  }
}
.interact .error::v-deep {
  .u-model__footer__button.hairline-left {
    color: $u-type-error !important;
  }
  .u-loading-circle {
    border-color: #e5e5e5 #e5e5e5 #e5e5e5 $u-type-error !important;
  }
}
.loading::v-deep {
  .u-mask {
    background-color: transparent !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading-content {
    background: rgba(0, 0, 0, 0.6);
    width: 200rpx;
    height: 180rpx;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .loading-title {
      font-size: 24rpx;
      color: #ffffff;
      padding-top: 20rpx;
    }
  }
}

.mask-through {
  pointer-events: none;
}
</style>
