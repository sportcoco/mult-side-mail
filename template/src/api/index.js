import http from '@/api/http';
import { merge } from 'lodash';

class CreateApi {
  constructor(options) {
    this.api = {};
    this.apiBuilder(options);
  }

  apiBuilder({ debug, sep = '/', apiConfigs = {} }) {
    Object.keys(apiConfigs).forEach(moduleName => {
      apiConfigs[moduleName].forEach(api => {
        let { name, method, desc, path: url, data = {}, config = {} } = api;
        const apiName = `${moduleName}${sep}${name}`;
        Object.defineProperty(this.api, apiName, {
          value(_data, _config) {
            debug && console.log(`调用接口: ${apiName}，描述: ${desc}`);
            method = method.toLowerCase();
            data = merge(data, _data);
            config = merge(config, _config);
            return http({ method, url, data, config });
          }
        });
      });
    });
  }
}

// 收集 apiConfigs
function collectApi(filesContext) {
  const configs = {};
  filesContext.keys().forEach(path => {
    const moduleName = path.replace(/(\.\/|\.js)/g, '');
    // 过滤'-'，替换成驼峰
    const moduleCamelName = moduleName.replace(/-(\w)/g, (_, str) => (str ? str.toUpperCase() : ''));
    configs[moduleCamelName] = files(path).default;
  });
  return configs;
}

const files = require.context('./modules', false, /\.js$/);
const apiConfigs = collectApi(files);

export default new CreateApi({
  apiConfigs,
  debug: process.env.DEBUG_API === true ? true : false // eslint-disable-line
}).api;
