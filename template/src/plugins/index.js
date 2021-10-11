import uView from 'uview-ui';
import API from '@/api';
import Http from '@/api/http';
import Routes from '@/configs/routes.json';
import mixins from '@/plugins/mixins';
import * as Utils from '@/plugins/utils';

export default {
  install(Vue, options) {
    // 全局调用API
    Vue.prototype.$API = API;
    Vue.prototype.$Http = Http;
    Vue.prototype.$Routes = Routes;
    Vue.prototype.$Utils = Utils;

    // 插件
    Vue.use(uView);
    Vue.use(mixins);
  }
};
