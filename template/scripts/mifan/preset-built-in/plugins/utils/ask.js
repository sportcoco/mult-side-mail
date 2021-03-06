const async = require('async');
const inquirer = require('inquirer');
const evaluate = require('./eval');

// Support types from prompt-for which was used before
const promptMapping = {
  string: 'input',
  boolean: 'confirm'
};

/**
 * Ask questions, return results.
 *
 * @param {Object} prompts
 * @param {Object} data
 * @param {Function} done
 */

module.exports = function ask(prompts, data, done) {
  preprocessDefault(prompts, data);
  async.eachSeries(
    Object.keys(prompts),
    (key, next) => {
      prompt(data, key, prompts[key], next);
    },
    done
  );
};

function preprocessDefault(prompts, data) {
  Object.keys(prompts).forEach(key => {
    const prompt = prompts[key];
    // eslint-disable-next-line
    if (prompt.hasOwnProperty('default')) {
      if (typeof prompt.default === 'function') {
        let temp;
        Object.defineProperty(data, key, {
          get() {
            if (temp !== undefined) {
              return temp;
            }
            return prompt.default(data);
          },
          set(val) {
            temp = val;
          },
          enumerable: true
        });
      } else {
        data[key] = prompt.default;
      }
    }
  });
}

/**
 * Inquirer prompt wrapper.
 *
 * @param {Object} data
 * @param {String} key
 * @param {Object} prompt
 * @param {Function} done
 */

function prompt(data, key, prompt, done) {
  // skip prompts whose when condition is not met
  if (prompt.when && !evaluate(prompt.when, data)) {
    return done();
  }

  let promptDefault = prompt.default;
  if (typeof prompt.default === 'function') {
    promptDefault = function () {
      return prompt.default(data);
    };
  }

  let promptChoices = prompt.choices || [];
  if (typeof prompt.choices === 'function') {
    promptChoices = function () {
      return prompt.choices(data);
    };
  }

  inquirer
    .prompt([
      {
        type: promptMapping[prompt.type] || prompt.type,
        name: key,
        message: prompt.message || prompt.label || key,
        default: promptDefault,
        choices: promptChoices,
        validate: prompt.validate || (() => true)
      }
    ])
    .then(answers => {
      if (Array.isArray(answers[key])) {
        data[key] = [];
        answers[key].forEach(multiChoiceAnswer => {
          data[key] = data[key].concat(multiChoiceAnswer);
        });
      } else if (typeof answers[key] === 'string') {
        data[key] = answers[key].replace(/"/g, '\\"');
      } else {
        data[key] = answers[key];
      }
      done();
    })
    .catch(done);
}
