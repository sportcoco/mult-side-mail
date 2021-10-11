import { urlJoin } from './util';

export default class Request {
  constructor(opts) {
    this.defaults = opts;
    this.interceptors = interceptors();
    this.onerror = () => {};
  }

  request({ method, url, data, header, reqIntercept, resIntercept }) {
    let timer; // timer 检测超时定时器
    let requestTask; // requestTask 网络请求 task 对象
    let aborted = false; // aborted 请求是否已被取消
    let overtime = false; // overtime 请求是否超时
    const abort = () => {
      // timer 检测超时定时器，requestTask 网络请求 task 对象，aborted 请求是否已被取消，abort 取消请求方法
      aborted = true; // 将请求状态标记为已取消
      // eslint-disable-next-line no-unused-expressions
      requestTask ? requestTask.abort() : ''; // 执行取消请求方法
    };

    return new Proxy(
      new Promise((resolve, reject) => {
        // 返回经过 Proxy 后的 Promise 对象使其可以监听到是否调用 abort 方法
        this.interceptors.request
          .intercept(
            { header: { ...(this.defaults.header || {}), ...header }, body: data || {} },
            method,
            url,
            data,
            reqIntercept
          )
          .then(async ({ header, body: data, cancel }) => {
            // 等待请求拦截器里的方法执行完
            if (aborted || cancel) {
              // 如果请求已被取消,停止执行,返回 reject
              await this.onerror(method, url, data, '网络请求失败：主动取消');
              // eslint-disable-next-line prefer-promise-reject-errors
              return reject('网络请求失败：主动取消');
            }
            requestTask = uni.request({
              url: (/^http(s)?:\/\//.test(url) && url) || urlJoin(this.defaults.baseURL, url),
              data,
              method,
              header,
              success: async res => {
                // 网络请求成功
                clearTimeout(timer); // 清除检测超时定时器
                this.interceptors.response.intercept(
                  resolve,
                  {
                    success: true,
                    ...res
                  },
                  method,
                  url,
                  data,
                  reject,
                  resIntercept
                ); // 执行响应拦截器
              },
              fail: async res => {
                // 网络请求失败
                clearTimeout(timer); // 清除检测超时定时器
                !overtime &&
                  (await this.onerror(
                    method,
                    url,
                    data,
                    aborted ? '网络请求失败：主动取消' : '网络请求失败：（URL无效|无网络|DNS解析失败）'
                  ));
                // eslint-disable-next-line prefer-promise-reject-errors
                aborted ? reject('网络请求失败：主动取消') : reject('网络请求失败：（URL无效|无网络|DNS解析失败）');
              }
            });
            timer = setTimeout(async () => {
              // 请求超时执行方法
              overtime = true; // 将状态标记为超时，不会被 fail 中的 onerror 重复执行
              requestTask.abort(); // 执行取消请求方法
              await this.onerror(method, url, data, '网络请求失败：超时取消');
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('网络请求时间超时'); // reject 原因
            }, this.defaults.timeout || 56 * 1000); // 设定检测超时定时器
          });
      }),
      {
        get: (target, prop) => {
          // 如果调用 abort 方法,返回 abort 方法
          if (prop === 'abort') {
            return abort;
          } else {
            if (Reflect.get(target, prop) && Reflect.get(target, prop).bind) {
              return Reflect.get(target, prop).bind(target);
            } else {
              return Reflect.get(target, prop);
            }
          }
        }
      }
    );
  }

  logger(opts, request, response) {
    // 打印 主题颜色
    const $consoleColor = {
      green: '#87d068',
      red: '#f50',
      blue: '#2db7f5',
      yellow: '#faad14',
      pink: '#eb2f96'
    };

    console.group(`[${request.method.toUpperCase()}]${request.url.replace(this.defaults.baseURL, '')}`);

    switch (opts.type) {
      case 'success':
        request.data && console.log('%c[参数]', `color:${$consoleColor.blue}`, request.data);
        console.log(
          '%c[返回]',
          `color:${$consoleColor.green}`,
          response.result !== undefined ? response.result : response
        );
        break;
      case 'error':
        !opts.hideErrMsg &&
          response.message &&
          setTimeout(() => {
            uni.showToast({ title: response.message, duration: 3000, icon: 'none' });
          }, 300);

        uni.getNetworkType({
          success: ({ networkType }) =>
            console.log(`%c[请求错误-${networkType}]`, `color:${$consoleColor.yellow}`, request, response)
        });

        request.data && console.log('%c[参数]', `color:${$consoleColor.red}`, request.data);
        console.log('%c[错误代码]', `color:${$consoleColor.red}`, response.code || response.error);
        console.log('%c[错误信息]', `color:${$consoleColor.red}`, response.message);
        console.log(
          '%c[错误数据]',
          `color:${$consoleColor.red}`,
          response.result !== undefined ? response.result : response
        );
        break;
    }

    console.groupEnd();
  }
}

// 拦截器
function interceptors() {
  return {
    request: {
      interceptors: [],
      use(fun) {
        this.interceptors.push(fun);
      },
      async intercept(config, method, url, data, reqIntercept) {
        if (!reqIntercept) {
          // 如果请求允许被拦截
          for (let i = 0; i < this.interceptors.length; i++) {
            config = await this.interceptors[i](config, method, url, data);
          }
        }
        return config;
      }
    },
    response: {
      interceptors: [],
      use(fun) {
        this.interceptors.push(fun);
      },
      async intercept(resolve, response, method, url, data, reject, resIntercept) {
        try {
          if (!resIntercept) {
            // 如果请求允许被拦截
            for (let i = 0; i < this.interceptors.length; i++) {
              response = await this.interceptors[i](response, method, url, data);
            }
          }
          if (response.success) {
            return resolve(response);
          } else {
            delete response.success;
            return resolve(response, method, url, data);
          }
        } catch (e) {
          reject(e);
        }
      }
    }
  };
}
