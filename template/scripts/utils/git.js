const { execa } = require('@bomijs/utils');

exports.latestTag = async () => {
  const { stdout } = await execa('git', ['describe', '--abbrev=0', '--tags']);
  return stdout;
};

const firstCommit = async () => {
  const { stdout } = await execa('git', ['rev-list', '--max-parents=0', 'HEAD']);
  return stdout;
};

exports.latestTagOrFirstCommit = async () => {
  let latest;
  try {
    // In case a previous tag exists, we use it to compare the current repo status to.
    latest = await exports.latestTag();
  } catch (_) {
    // Otherwise, we fallback to using the first commit for comparison.
    latest = await firstCommit();
  }

  return latest;
};

exports.commitLogFromRevision = async revision => {
  const { stdout } = await execa('git', ['log', '--format=%s %h', `${revision}..HEAD`]);
  return stdout;
};

// 是否安装了git
let _hasGit;
exports.hasGit = async () => {
  if (_hasGit) {
    return _hasGit;
  }
  try {
    await execa('git', ['--version'], { stdio: 'ignore' });
    return (_hasGit = true);
  } catch (error) {
    return (_hasGit = false);
  }
};

// 项目是否已经是一个git repo
const LRU = require('lru-cache'); // 在内存中管理缓存数据
const _projectGit = new LRU({
  max: 10, // 缓存大小
  maxAge: 1000 // 缓存过期时间
});

exports.hasProjectGit = (cwd = process.cwd()) => {
  if (_projectGit.has(cwd)) {
    return _projectGit.get(cwd);
  }
  let result;
  try {
    execa.sync('git', ['status'], { cwd, stdio: 'ignore' });
    result = true;
  } catch (error) {
    result = false;
  }
  _projectGit.set(cwd, result);
  return result;
};

exports.getGitUser = () => {
  let name;
  let email;

  try {
    name = execa.commandSync('git config --get user.name').stdout;
    email = execa.commandSync('git config --get user.email').stdout;
  } catch (e) {}

  name = name && JSON.stringify(name.toString().trim()).slice(1, -1);
  email = email && ' <' + email.toString().trim() + '>';
  return (name || '') + (email || '');
};
