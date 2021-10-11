import rootConfig from '@/configs/app';
import routes from '@/configs/routes.json';

export function getPageConfig(pagePath) {
  if (!pagePath && typeof pagePath !== 'string') return;
  for (const key in routes) {
    if (pagePath === key || pagePath === routes[key]) {
      pagePath = routes[key];
      break;
    }
  }
  if (!pagePath) return {};

  const { modules } = rootConfig || {};
  let memo = {};
  for (const key in modules) {
    if (Object.hasOwnProperty.call(modules, key)) {
      const pages = modules[key].pages || [];
      const page = pages.find(e => {
        const basic = e.pageBasic;
        const slash = '/';
        const path = pathJoin(slash, basic.root || '', basic.path);
        return path === pagePath;
      });

      if (page) {
        const moduleConfig = modules[key].moduleConfig;
        memo = { moduleConfig, ...page };
        break;
      }
    }
  }
  return memo;
}

// 拼接路径
function pathJoin(...args) {
  const arr = args || [];
  const str = arr.reduce((memo, cur) => (memo += typeof cur === 'string' ? cur + '/' : ''), '');
  return str.replace(/\/\/+/g, '/').replace(/\/$/, '');
}
