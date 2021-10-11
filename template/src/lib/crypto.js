import MD5 from 'crypto-js/md5';
import { Base64 } from 'js-base64';

export default {
  /*
   * MD5随机加密
   * @param {String}   word  需要加密的密码
   * @return {String}   加密的密文
   * */
  MD5(word) {
    return MD5(word).toString();
  },

  /*
   * Base64 编码
   * @param {String}   word  需要编码的内容
   * @return {String}   编码/解密 内容
   * */
  Base64: {
    encrypt: word => {
      return Base64.encode(word);
    },
    decrypt: word => {
      return Base64.decode(word);
    }
  }
};
