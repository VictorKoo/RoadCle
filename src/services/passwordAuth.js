import crypto from 'crypto';
import Buffer from 'buffer';

export const authPassword = (userName, psw) => {};

/**
 * Hash方法
 *
 * @param {String} method e.g.: 'md5', 'sha1'
 * @param {String|Buffer} s
 * @param {String=} [format] 'hex'，'base64'. default is 'hex'.
 * @return {String} 编码值
 * @private
 */
export const hash = (method, s, format) => {
  let sum = crypto.createHash(method);
  let isBuffer = Buffer.isBuffer(s);
  if (!isBuffer && typeof s === 'object') {
    s = JSON.stringify(s);
  }
  sum.update(s, isBuffer ? 'binary' : 'utf8');
  return sum.digest(format || 'hex');
};

/**
 * MD5 编码
 * @param {String|Buffer} s
 * @param {String} [format] 'hex'，'base64'. default is 'hex'.
 * @return {String} md5 hash string
 * @public
 */
export const md5 = (s, format) => {
  return hash('md5', s, format);
};
