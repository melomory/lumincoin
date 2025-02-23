import { HttpUtils } from "../utilities/http-utils.js";

export class IncomeCategoryService {
  /**
   * Получить категории.
   * @returns {Array} Коллекция категорий.
   */
  static async getCategories() {
    const returnObject = {
      error: false,
      redirect: null,
      categories: null,
    };

    const result = await HttpUtils.request("/categories/income");

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && !Array.isArray(result.response))
    ) {
      returnObject.error = "Возникла ошибка при запросе категорий доходов.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.categories = result.response;

    return returnObject;
  }

  /**
   * Получить категорию.
   * @param {Number} id Ид категории.
   * @returns {Object} Результат запроса.
   */
  static async getCategory(id) {
    const returnObject = {
      error: false,
      redirect: null,
      category: null,
    };

    const result = await HttpUtils.request(`/categories/income/${id}`);

    if (result.redirect || result.error || !result.response) {
      returnObject.error = "Возникла ошибка при запросе категории доходов.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.category = result.response;

    return returnObject;
  }

  /**
   * Удалить категорию.
   * @param {Number} id Ид категории.
   * @returns {Object} Результат удаления.
   */
  static async deleteCategory(id) {
    const returnObject = {
      error: false,
      redirect: null,
    };

    const result = await HttpUtils.request(
      `/categories/income/${id}`,
      "DELETE",
      true
    );

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      returnObject.error = "Возникла ошибка при удалении категории.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    return returnObject;
  }

  /**
   * Обновить категорию.
   * @param {Number} id Ид категории.
   * @param {Object} data Данные для обновления.
   * @returns {Object} Результат обновления.
   */
  static async updateCategory(id, data) {
    const returnObject = {
      error: false,
      redirect: null,
      category: null,
    };

    const result = await HttpUtils.request(
      `/categories/income/${id}`,
      "PUT",
      true,
      data
    );

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && !result.response.id && !result.response.title)
    ) {
      returnObject.error = "Возникла ошибка при редактировании категории.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.category = result.response;

    return returnObject;
  }

  /**
   * Создать категорию.
   * @param {Object} data Данные для создания категории.
   * @returns {Object} Категория.
   */
  static async createCategory(data) {
    const returnObject = {
      error: false,
      redirect: null,
      category: null,
    };

    const result = await HttpUtils.request(
      `/categories/income`,
      "POST",
      true,
      data
    );

    if (
      result.redirect ||
      result.error ||
      !result.response ||
      (result.response && !result.response.id && !result.response.title)
    ) {
      returnObject.error = "Возникла ошибка при создании категории.";
      if (result.redirect) {
        returnObject.redirect = result.redirect;
      }
      return returnObject;
    }

    returnObject.category = result.response;

    return returnObject;
  }
}
