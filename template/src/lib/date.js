import dayjs from 'dayjs';

/**
 * 获取包括num天内的日期和星期
 * @param {*} params 如果传入的是数字就是多少天的日期，如果传递的时日期数组就直接使用
 */
export function getDaysArr(params) {
  // 创建包括今天的num天数组
  const arr =
    typeof params === 'number' ? [...Array(params).keys()].map(days => new Date(Date.now() + 86400000 * days)) : params;

  const dateArr = [];
  const weekStr = ['日', '一', '二', '三', '四', '五', '六'];
  // eslint-disable-next-line
  arr.map(item => {
    dateArr.push({
      date: dayjs(item).format('DD'),
      trueDate: dayjs(item).format('YYYY-MM-DD'),
      week: weekStr[dayjs(item).format('d')]
    });
  });
  return dateArr;
}

/**
 * 格式化时间，转化为几分钟前，几秒钟前
 * @param timestamp 时间戳，单位是毫秒
 */
export function formatDuration(timestamp) {
  const mistiming = Math.round((Date.now() - timestamp) / 1000);
  const arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
  const arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
  for (let i = 0; i < arrn.length; i++) {
    const inm = Math.floor(mistiming / arrn[i]);
    if (inm !== 0) {
      return inm + arrr[i] + '前';
    }
  }
}

/**
 * 获取n天之前的日期 getDaysBeforeDate(10) 10天前
 * @param num 天数
 */
export function getDaysBeforeDate(num) {
  const date = new Date();

  const timestamp = date.getTime();
  // 获取三天前的日期
  const newDate = new Date(timestamp - num * 24 * 3600 * 1000);
  const year = newDate.getFullYear();
  // 月+1是因为js中月份是按0开始的
  let month = newDate.getMonth() + 1;
  let day = newDate.getDate();
  if (day < 10) {
    // 如果日小于10，前面拼接0
    day = '0' + day;
  }
  if (month < 10) {
    // 如果月小于10，前面拼接0
    month = '0' + month;
  }
  return [year, month, day].join('/');
}
