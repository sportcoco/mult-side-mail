const inquirer = require('inquirer');
const { join, isAbsolute } = require('path');
const genFiles = require('../utils/genFiles');

module.exports = api => {
  api.registerCommand({
    name: 'generate',
    description: 'generate the project from the config',
    async fn({ args }) {
      const {
        fsExtra: { readdirSync }
      } = api.utils;

      let source = 'configs';
      if (args.config && typeof args.config === 'string') {
        source = args.config;
      }

      const CONFIG_SOURCE = isAbsolute(source) ? source : join(api.cwd, source);
      const CONFIG_FILES = readdirSync(CONFIG_SOURCE);
      if (!CONFIG_FILES.length) throw new Error(api.logger.fatal(`未找到配置文件 [${CONFIG_SOURCE}]`));

      const { configFile } = await inquirer.prompt([
        {
          name: 'configFile',
          type: 'rawlist',
          require: true,
          message: `请选择配置文件（智慧医院） :`,
          choices: CONFIG_FILES
        }
      ]);

      process.env.APP_CONFIG_PATH = join(CONFIG_SOURCE, configFile);

      genFiles({ api, watch: args.watch });
    }
  });
};
