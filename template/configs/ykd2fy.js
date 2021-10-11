module.exports = {
  basic: {
    name: '医科大二附院',
    terminalId: {
      'h5': '',
    },
    apiHost: {
      development: '',
      production: ''
    }
  },
  manifest: {
    /* 应用的配置 */
    h5: {
      /* H5特有相关 */
      title: '医科大二附院'
    },
    'mp-weixin': {
      /* 微信小程序特有相关 */
      usingComponents: true,
    }
  },
  pagesGlob: {
    /* 页面相关的全局配置 */
    globalStyle: {
      /* 设置默认页面的窗口表现 */
      navigationBarTextStyle: 'black',
      navigationBarTitleText: '医科大二附院',
      navigationBarBackgroundColor: '#FFFFFF',
      backgroundColor: '#FFFFFF'
    },
  },
  theme: {
    /* 主题颜色相关 */
    primary: '#1dac85',
    success: '#19be6b',
    error: '#fa3534',
    highlight: '#ff4d4f',
    warning: '#ff9900',
    normal: '#d9d9d9',
    info: '#909399',
    disabled: ' #c8c9cc'
  },
  modules: {
    home: {
      moduleConfig: {},
      pages: [
        {
          pageBasic: {
            path: 'pages/home/home',
            style: {
              navigationBarTitleText: '医科大二附院'
            }
          },
          styleKey: 'Home',
        }
      ]
    },
  }
};
