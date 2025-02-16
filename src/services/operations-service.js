import { HttpUtils } from "../utilities/http-utils.js";

export class OperationsService {
/**
 * Получить операции.
 * @param {Object} filter Условия фильтрации.
 * @returns {Array} Коллекция операций.
 */
  static async getOperations(filter) {
    const returnObject = {
      error: false,
      redirect: null,
      operations: null,
    };

    const result = await HttpUtils.request(
      `/operations?period=${filter.period}&dateFrom=${filter.dateFrom}&dateTo=${filter.dateTo}`
    );

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && !Array.isArray(result.response))
    ) {
      returnObject.error = "Возникла ошибка при запросе операций.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.operations = result.response;

    return returnObject;
  }

  /**
   * Создать операцию.
   * @param {Object} data Данные для создания операции.
   * @returns {Object} Категория.
   */
  static async createOperation(data) {
    const returnObject = {
      error: false,
      redirect: null,
      category: null,
    };

    const result = await HttpUtils.request(`/operations`, "POST", true, data);

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && !result.response.id)
    ) {
      returnObject.error = "Возникла ошибка при создании операции.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.category = result.response;

    return returnObject;
  }

  /**
   * Удалить операцию.
   * @param {Number} id Ид операции
   * @returns
   */
  static async deleteOperation(id) {
    const returnObject = {
      error: false,
      redirect: null,
    };

    const result = await HttpUtils.request(`/operations/${id}`, "DELETE", true);

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      returnObject.error = "Возникла ошибка при удалении операции.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    return returnObject;
  }

  /**
   * Получить операцию.
   * @param {Number} id Ид операции.
   * @returns {Object} Операция.
   */
  static async getOperation(id) {
    const returnObject = {
      error: false,
      redirect: null,
      operation: null,
    };

    const result = await HttpUtils.request(`/operations/${id}`);

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response &&
        !result.response.id &&
        !result.response.type &&
        !result.response.amount &&
        !result.response.date &&
        !result.response.comment &&
        !result.response.category)
    ) {
      returnObject.error = "Возникла ошибка при запросе операций.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.operation = result.response;

    return returnObject;
  }

  /**
   * Обновить операцию.
   * @param {Number} id Ид операции.
   * @param {*} data Данные для обновления операции.
   * @returns {Object} Обновленная операция.
   */
  static async updateOperation(id, data) {
    const returnObject = {
      error: false,
      redirect: null,
      operation: null,
    };

    const result = await HttpUtils.request(
      `/operations/${id}`,
      "PUT",
      true,
      data
    );

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && !result.response.id)
    ) {
      returnObject.error = "Возникла ошибка при редактировании операции.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.category = result.response;

    return returnObject;
  }
}
