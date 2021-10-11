import Vue from 'vue';
import App from './App';
import store from './store'
import plugins from '@/plugins';


Vue.config.productionTip = false;
Vue.use(plugins);

App.mpType = 'app';

const app = new Vue({
  ...App,
  store
});

app.$mount();
