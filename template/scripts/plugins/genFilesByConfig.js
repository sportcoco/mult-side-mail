const { join, parse } = require('path');
const {
  deepmerge,
  fsExtra: { readFileSync }
} = require('@bomijs/utils');

module.exports = api => {
  const source = join(api.cwd, 'src');
  const abcConfigPath = join(api.cwd, 'configs');
  api.addTmpGenerateWatcherPaths(() => [abcConfigPath]);

  api.onGenerateFiles(() => {
    const options = {
      tmpDir: 'src',
      configPath: process.env.APP_CONFIG_PATH,
      configDir: 'configs',
      manifestJson: 'manifest.json',
      pagesJson: 'pages.json',
      theme: 'uni.scss',
      skipInterpolation: '**/index.html',
      pagesPattern: '**/*.vue',
      imports: {
        formatCompName(val) {
          let str = '';
          for (let i = 0; i < val.length; i++) {
            const e = val.charAt(i);
            str += /[A-Z]/.test(e) ? `${i !== 0 ? '-' : ''}${e.toLocaleLowerCase()}` : e;
          }
          return str;
        },
        formatCompProps(obj) {
          let str = '';
          Object.keys(obj).forEach(key => {
            str += ` ${key}="${obj[key].default}"`;
          });
          return str;
        },
        transformObject(obj) {
          return JSON.stringify(obj, null, 2);
        }
      },
      metalsmith: {
        after(metalsmith, opts, helpers) {
          metalsmith
            .use(getAppConfig(opts.tmpDir, opts.configDir, opts.configPath))
            .use(genRoutes(opts.configDir, api.logger))
            .use(modifyManifest(opts.manifestJson, { ...helpers, deepmerge }))
            .use(modifyPagesConfig(opts.pagesJson, { ...helpers, deepmerge }))
            .use(modifyTheme(opts.theme, helpers))
            .use(collectCompData(opts.pagesPattern, helpers));
          // .use(genPages(helpers));
        }
      }
    };
    api.generate({ source, options }, err => {
      if (err) {
        console.log(err);
      }
    });
  });
};

// 获取项目配置文件
function getAppConfig(tmpDir, configDir, configPath) {
  return (files, metalsmith, done) => {
    const targetDir = join(process.cwd(), tmpDir);
    const appConfigFile = join(configDir, 'app.js');
    const data = metalsmith.metadata();
    let contents = '';
    try {
      contents = readFileSync(configPath);
      data.rootConfig = require(configPath);
    } catch (err) {
      data.rootConfig = {};
    }

    if (!files[appConfigFile]) {
      files[appConfigFile] = { contents };
    } else {
      files[appConfigFile].contents = contents;
    }

    metalsmith.destination(targetDir);
    done();
  };
}

// 生成页面模板--路由映射
function genRoutes(source, logger) {
  return (files, metalsmith, done) => {
    const data = metalsmith.metadata();
    const ROOT_CONFIG_KEY = 'rootConfig';
    const MODULES_KEY = 'modules';
    const PAGE_KEY = 'pages';
    const modules = data[ROOT_CONFIG_KEY][MODULES_KEY] || {};
    const routesFile = join(source, 'routes.json');
    const pages = Object.keys(modules).reduce((memo, key) => {
      const module = modules[key];
      const item = module[PAGE_KEY].map(e => ({
        styleKey: e.styleKey,
        path: e.pageBasic.path,
        root: e.pageBasic.root
      }));
      return memo.concat(item);
    }, []);
    let contents = pages.reduce((memo, cur) => {
      const suffix = '.vue';
      const slash = '/';
      const routePath = pathJoin(slash, cur.root || '', cur.path);
      const routeKey = join(cur.root || '', cur.path) + suffix;
      if (files[routeKey]) {
        memo[cur.styleKey] = routePath;
      } else {
        logger.fatal(`未找到该文件路径 [${routeKey}]`);
      }
      return memo;
    }, {});

    contents = JSON.stringify(contents, null, 2);
    contents = Buffer.from(contents);

    if (!files[routesFile]) {
      files[routesFile] = { contents };
    } else {
      files[routesFile].contents = contents;
    }

    done();
  };
}

// 修改应用配置
function modifyManifest(fileName, helper) {
  return (files, metalsmith, done) => {
    const { rootConfig } = metalsmith.metadata();
    const { stripJsonComment, deepmerge } = helper;
    const KEY = 'manifest';
    const tpl = metalsmith.path('../scripts/template/manifest.json');
    const file = fileName;
    let str = '';

    try {
      str = readFileSync(tpl);
    } catch (err) {}

    // 去掉JSON注释，解析JSON
    let contents = JSON.parse(stripJsonComment(str.toString()));
    // 合并JSON
    contents = deepmerge(contents, rootConfig[KEY] || {});
    // 转换
    contents = Buffer.from(JSON.stringify(contents, null, 2));

    if (!files[file]) {
      files[file] = { contents };
    } else {
      files[file].contents = contents;
    }

    done();
  };
}

// 修改页面配置
function modifyPagesConfig(fileName, helper) {
  return (files, metalsmith, done) => {
    const { rootConfig } = metalsmith.metadata();
    const { stripJsonComment, deepmerge } = helper;
    const GLOBAL_KEY = 'pagesGlob';
    const MODULE_KEY = 'modules';
    const PAGE_KEY = 'pages';
    const SUB_PAGE_KEY = 'subPackages';
    const TABBAR_KEY = 'tabBar';
    const tpl = metalsmith.path('../scripts/template/pages.json');
    const file = fileName;
    let str = '';

    try {
      str = readFileSync(tpl);
    } catch (err) {}
    // 去掉JSON注释，解析JSON
    let contents = JSON.parse(stripJsonComment(str.toString()));
    // 合并 页面公用配置
    contents = deepmerge(contents, rootConfig[GLOBAL_KEY] || {});
    // 过滤 modules 获得相应的页面配置
    const modules = rootConfig[MODULE_KEY] || {};
    const pagesBasic = [];
    let subPackages = [];

    Object.keys(modules).forEach(module => {
      modules[module][PAGE_KEY].forEach(e => {
        const basic = e.pageBasic;
        if (basic.root && typeof basic.root === 'string') {
          const normalizeBasic = JSON.parse(JSON.stringify(basic));
          const { root } = normalizeBasic;
          delete normalizeBasic.root;
          const item = {
            root,
            pages: [].concat(normalizeBasic)
          };
          subPackages.push(item);
        } else {
          pagesBasic.push(basic);
        }
      });
    });

    subPackages = subPackages.reduce((memo, cur) => {
      const { root } = cur;
      const pages = subPackages.filter(e => e.root === root).map(e => ({ ...e.pages[0] }));
      memo[root] = pages;
      return memo;
    }, {});

    subPackages = Object.keys(subPackages).map(root => ({
      root,
      pages: subPackages[root]
    }));

    contents.pages = pagesBasic;
    contents.subPackages = (rootConfig[GLOBAL_KEY][SUB_PAGE_KEY] || []).concat(subPackages);
    contents.tabBar = rootConfig[GLOBAL_KEY][TABBAR_KEY] || {};

    if (contents.tabBar.customTabbar) {
      delete contents.tabBar.customTabbar;
    }

    contents = Buffer.from(JSON.stringify(contents, null, 2));

    if (!files[file]) {
      files[file] = { contents };
    } else {
      files[file].contents = contents;
    }

    done();
  };
}

// 修改主题色
function modifyTheme(fileName, helper) {
  return (files, metalsmith, done) => {
    const { rootConfig } = metalsmith.metadata();
    const theme = rootConfig.theme || {};
    const tpl = metalsmith.path('../scripts/template/uni.scss');
    const file = fileName;
    let contents = '';

    try {
      contents = readFileSync(tpl);
    } catch (err) {}

    contents = contents.toString();

    Object.keys(theme).forEach(key => {
      const RE = new RegExp(`(\\$|\\--)${key}-color\\:\\s*.*\\;`, 'ig');
      contents = contents.replace(RE, `$1${key}-color: ${theme[key]};`);
    });

    contents = Buffer.from(contents);

    if (!files[file]) {
      files[file] = { contents };
    } else {
      files[file].contents = contents;
    }

    done();
  };
}

// 收集 组件信息数据，形成 map 对象
function collectCompData(pattern, helper) {
  return (files, metalsmith, done) => {
    const data = metalsmith.metadata();
    const { minimatch } = helper;
    const compMap = new Map();
    const pageMap = new Map();

    function isComponent(dir) {
      return /component?s/gi.test(dir);
    }

    function normalizePath(path) {
      return path.replace(/\\+/g, '/').replace(/^src\//, '@/');
    }

    function normalizeName(val) {
      let str = '';
      const strArr = val.split('-');
      for (let i = 0; i < strArr.length; i++) {
        str += strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
      }
      return str;
    }

    Object.keys(files).forEach(file => {
      if (minimatch(file, pattern, { dot: true })) {
        const pathInfo = parse(file);
        const fileName = normalizeName(pathInfo.name);
        const filePath = normalizePath(file);
        if (isComponent(pathInfo.dir)) {
          compMap.set(fileName, { path: file, filePath, contents: files[file].contents });
        } else {
          pageMap.set(fileName, { path: file, filePath, contents: files[file].contents });
        }
      }
    });

    data.compMap = compMap;
    data.pageMap = pageMap;

    done();
  };
}

// 生成页面
// eslint-disable-next-line no-unused-vars
function genPages(helper) {
  return (files, metalsmith, done) => {
    const data = metalsmith.metadata();
    const { ArtTemplate, async } = helper;
    const ROOT_CONFIG_KEY = 'rootConfig';
    const MODULES_KEY = 'modules';
    const PAGE_KEY = 'pages';
    const SUFFIX = '.vue';
    const PAGES_ROOT_DIR = '';
    const pageMap = data.pageMap;
    const compMap = data.compMap;
    const modules = data[ROOT_CONFIG_KEY][MODULES_KEY] || {};
    const pages = Object.keys(modules).reduce((memo, key) => {
      const module = modules[key];
      const item = module[PAGE_KEY].map(e => ({ ...e, moduleName: key, moduleConfig: module.moduleConfig }));
      return memo.concat(item);
    }, []);

    const tpl = metalsmith.path('../scripts/template/layouts/index.art');

    async.each(
      pages,
      (page, next) => {
        const pageBasic = page.pageBasic || {};
        const pagePath = pageBasic.path + SUFFIX;
        const filePath = join(PAGES_ROOT_DIR, pagePath);
        // 处理页面模板
        if (page.styleKey) {
          const tpl = pageMap.get(page.styleKey);

          if (!tpl) {
            throw new Error(`[${page.styleKey}] 未找到该组件`);
          }
          if (!files[filePath]) {
            files[filePath] = { contents: tpl.contents };
          } else {
            files[filePath].contents = tpl.contents;
          }
          return next();
        }
        // 处理组件模板
        page.componentConfig.forEach(item => {
          const tpl = compMap.get(item.styleKey);
          if (!tpl) {
            throw new Error(`[${item.styleKey}] 未找到该组件`);
          }
          item.compPath = tpl.compPath;
        });

        try {
          const str = ArtTemplate(tpl, { ...data, page });
          if (!files[filePath]) {
            files[filePath] = { contents: Buffer.from(str) };
          } else {
            files[filePath].contents = Buffer.from(str);
          }
          next();
        } catch (err) {
          err.message = `[${filePath}] ${err.message}`;
          next(err);
        }
      },
      done
    );
  };
}

// 拼接路径
function pathJoin(...args) {
  const arr = args || [];
  const str = arr.reduce((memo, cur) => (memo += typeof cur === 'string' ? cur + '/' : ''), '');
  return str.replace(/\/\/+/g, '/').replace(/\/$/, '');
}
