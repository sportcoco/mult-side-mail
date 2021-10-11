import { basic } from '@/configs/app';
import { Platform } from '@/lib/platform';
import API from '@/api';

export default {
  namespaced: true,
  actions: {
    async login({ dispatch }, params) {
      let token = uni.getStorageSync('access_token');

      if (token) return Promise.resolve(token);

      /* #ifdef MP */
      const loginPromsie = scopes =>
        new Promise((resolve, reject) => {
          uni.login({
            scopes,
            success: ({ code, errMsg }) => (code ? resolve(code) : reject(errMsg)),
            fail: reject
          });
        });

      try {
        const appId = await dispatch('getAppId');
        const code = await loginPromsie(['auth_base']);
        const userInfo = await API['base/checkOrCreateUser']({
          appId,
          code,
          terminalId: basic.terminalId[Platform],
          loginChannel: 1,
          encryptedData: '',
          iv: ''
        });

        const res = await dispatch('getAccessToken', userInfo);
        token = res.token;
        uni.setStorageSync('access_token', token);
        uni.setStorageSync('user_info', JSON.stringify(userInfo));
      } catch (error) {
        console.log(error);
      }
      /* #endif */

      /* #ifdef H5 */
      try {
        if(Object.keys(params).length){
          const userInfo = params;
          const res = await dispatch('getAccessToken', userInfo);
          token = res.token;
          uni.setStorageSync('access_token', token);
          uni.setStorageSync('user_info', JSON.stringify(userInfo));
        }
      } catch (error) {
        console.log(error);
      }
      
      /* #endif */

      return Promise.resolve(token);
    },

    getAppId() {
      let appId = '';
      /* #ifndef MP-ALIPAY */
      const accountInfo = uni.getAccountInfoSync();
      appId = accountInfo.miniProgram.appId;
      /* #endif */
      /* #ifdef MP-ALIPAY */
      appId = my.getAppIdSync().appId;
      /* #endif */
      return appId;
    },

    // eslint-disable-next-line no-empty-pattern
    getAccessToken({}, data) {
      const terminalId = basic.terminalId[Platform];
      const { unionId = '', openId = '', miniOpenId = '', tokenMode = '2' } = data;
      const parms = {
        terminalId,
        userData: {
          unionId,
          openId,
          miniOpenId
        },
        mode: tokenMode,
        userId: unionId
      };
      return API['base/getToken'](parms);
    }
  }
};
