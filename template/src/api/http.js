import Request from '@/lib/Request';
import store from '@/store';
import { basic } from '@/configs/app';
import crypto from '@/lib/crypto';
import { Platform } from '@/lib/platform';
const { Base64, MD5 } = crypto;
const service = new Request({
  baseURL: basic.apiHost[process.env.NODE_ENV] || ''
});

// 请求拦截
service.interceptors.request.use((config, method) => {
  const token = uni.getStorageSync('access_token') || '';
  const terminalId = basic.terminalId[Platform];
  const requestId = MD5(config.url + new Date().getTime());
  config.header = {
    token,
    terminalId,
    requestId
  };

  // Base64加密
  config.body = JSON.stringify(config.body);
  config.body = method === 'get' ? { data: Base64.encrypt(config.body) } : Base64.encrypt(config.body);
  return config;
});

// 响应拦截
service.interceptors.response.use(response => {
  // Base64解密
  if (response.data && typeof response.data.result === 'string') {
    const _result = response.data.result;
    try {
      response.data.result = Base64.decrypt(response.data.result);
      response.data.result = response.data.result && JSON.parse(response.data.result);
    } catch (e) {
      response.data.result = _result;
    }
  }

  return response;
});

// 刷新一次 AccessToken，再请求一次
async function fixAccessToken(response, task) {
  const { data } = response;
  const CODE_REG = /^(20001|20002|20003)$/gi;
  const fixStatus = data && CODE_REG.test(data.code);
  const isNeedToLogin = /20003/gi.test(data.code);
  let token = '';
  let userInfo;
  if (!fixStatus) {
    return Promise.resolve(response);
  }

  try {
    if (!isNeedToLogin) {
      userInfo = uni.getStorageSync('user_info');
      userInfo = userInfo && JSON.parse(userInfo);
    }

    if (!isNeedToLogin && userInfo) {
      const res = await store.dispatch('login/getAccessToken', userInfo);
      token = res.token;
      uni.setStorageSync('access_token', token);
    } else {
      uni.clearStorageSync('access_token');
      token = await store.dispatch('login/login');
    }

    return task({ token });
  } catch (e) {
    return Promise.reject(e);
  }
}

export default function http({ method, url, data, config }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const { header = {}, reqIntercept = false, resIntercept = false, ...args } = config || {};
    const task = header => service.request({ method, url, data, header, reqIntercept, resIntercept });

    try {
      !args.hideLoading &&
        uni.showLoading({
          title: '加载中',
          mask: true
        });
      let response = await task(header);
      // 是否需要刷新token
      response = await fixAccessToken(response, task);

      if (response.statusCode !== 200 || (response.data && response.data.code !== 0)) {
        service.logger({ type: 'error', ...args }, { method, url, data }, response.data);
        reject(response.data);
      } else {
        service.logger({ type: 'success', ...args }, { method, url, data }, response.data);
        resolve(response.data.result !== undefined ? response.data.result : response.data);
      }
    } catch (e) {
      reject(e);
    } finally {
      !args.hideLoading && uni.hideLoading();
    }
  });
}
