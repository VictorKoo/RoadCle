/**
 *
 * @param {Object} obj
 * @returns {String} Query string
 */
const objToQueryString = (obj) => {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]),
    );
  }
  return keyValuePairs.join('&');
};

export default objToQueryString;
