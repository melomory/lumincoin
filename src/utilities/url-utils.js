export class UrlUtils {
  /**
   * Получить значение параметра из строки запроса.
   * @param {string} param Параметр запроса.
   * @returns {string} Значение параметра запроса.
   */
  static getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
}
