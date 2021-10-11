module.exports = async function ({ api, watch }) {
  const { logger, utils } = api;
  const { chokidar, lodash, winPath } = utils;
  await generate();

  const watchers = [];
  if (watch) {
    const watcherPaths = await api.applyPlugins({
      key: 'addTmpGenerateWatcherPaths',
      type: api.ApplyPluginsType.add,
      initialValue: []
    });

    // prettier
    lodash.uniq(watcherPaths.map(p => winPath(p))).forEach(p => {
      const watcher = createWatcher(p);
      watchers.push(watcher);
    });
  }

  async function generate() {
    // logger.info('generate files');
    await api.applyPlugins({
      key: 'onGenerateFiles',
      type: api.ApplyPluginsType.event
    });
  }

  function createWatcher(path) {
    const watcher = chokidar.watch(path, {
      // ignored: /(^|[\/\\])(_mock.js$|\..)/,
      ignoreInitial: true
    });

    watcher.on(
      'all',
      lodash.throttle(async (event, path) => {
        logger.info(`${event} ${path}`);
        await generate();
      }, 100)
    );
    return watcher;
  }

  function unwatch() {
    watchers.forEach(watcher => {
      watcher.close();
    });
  }

  return unwatch;
};
