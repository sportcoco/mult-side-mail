module.exports = {
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'development') {
      return {
        /* #ifdef MP */
        optimization: {
          minimize: true
        }
        /* #endif */
      };
    }
  }
};
