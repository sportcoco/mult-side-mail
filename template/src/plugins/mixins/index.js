import { getPageConfig } from '@/plugins/utils';

const mixin = {
  methods: {
    getCurrentPageConfig() {
      // eslint-disable-next-line
      const pages = getCurrentPages();
      const page = pages[pages.length - 1] || {};
      const path = '/' + (page.route || '');
      const config = getPageConfig(path);

      return config;
    }
  }
};

export default {
  install(Vue) {
    Vue.mixin(mixin);
  }
};
