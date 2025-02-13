import { HttpUtils } from "../utilities/http-utils.js";

export class BalanceService {
  /**
   * Получить баланс.
   * @returns {Number} Баланс.
   */
  static async getBalance() {
    const returnObject = {
      error: false,
      redirect: null,
      balance: null,
    };

    const result = await HttpUtils.request("/balance");

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response &&
        (result.response.error || isNaN(result.response.balance)))
    ) {
      returnObject.error = "Возникла ошибка при запросе баланса.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.balance = result.response.balance;

    return returnObject;
  }
}
