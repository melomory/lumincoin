import { BalanceService } from "../../../services/balance-service.js";
import { IncomeCategoryService } from "../../../services/income-category-service.js";
import { UrlUtils } from "../../../utilities/url-utils.js";
import { ValidationUtils } from "../../../utilities/validation-utils.js";

export class IncomeCategoryEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    const id = UrlUtils.getUrlParam("id");
    if (!id) {
      return this.openNewRoute("/income");
    }

    this.findElements();

    document
      .getElementById("save-button")
      .addEventListener("click", this.saveCategory.bind(this));

    document
      .getElementById("cancel-button")
      .addEventListener("click", this.cancel.bind(this));

    this.validations = [{ element: this.categoryNameElement }];

    this.init(id).then();
  }

  /**
   * Найти элементы на странице.
   */
  findElements() {
    this.categoryNameElement = document.getElementById("category-name");
    this.balanceElement = document.getElementById("balance");
  }

  /**
   * Инициализировать значения на странице.
   * @param {Number} id Ид категории.
   */
  async init(id) {
    const category = await this.getCategory(id);
    if (category) {
      this.categoryNameElement.value = category.title;
    }

    await this.getBalance();
  }

  /**
   * Получить категорию.
   * @param {Number} id Ид категории.
   * @returns
   */
  async getCategory(id) {
    const result = await IncomeCategoryService.getCategory(id);
    if (result.redirect) {
      return this.openNewRoute(result.redirect);
    }

    if (
      result.error ||
      !result.category ||
      (result.category && !result.category.title)
    ) {
      return alert("Возникла ошибка при запросе категории доходов.");
    }

    this.categoryOriginalData = result.category;

    return result.category;
  }

  /**
   * Сохранить категорию.
   * @param {*} e Аргумент события.
   * @returns
   */
  async saveCategory(e) {
    e.preventDefault();

    if (ValidationUtils.validateForm(this.validations)) {
      const changedData = {};

      if (this.categoryNameElement.value !== this.categoryOriginalData.title) {
        changedData.title = this.categoryNameElement.value;
      }

      if (Object.keys(changedData).length > 0) {
        const response = await IncomeCategoryService.updateCategory(
          this.categoryOriginalData.id,
          changedData
        );

        if (response.error) {
          alert(response.error);
          return response.redirect
            ? this.openNewRoute(response.redirect)
            : null;
        }

        return this.openNewRoute("/income");
      }

      return this.openNewRoute("/income");
    }
  }

  /**
   * Отменить редактирование.
   * @param {Object} e Аргумент события.
   */
  cancel(e) {
    e.preventDefault();

    this.openNewRoute("/expenses");
  }

  /**
   * Получить баланс.
   * @returns {Number} Баланс.
   */
  async getBalance() {
    const result = await BalanceService.getBalance();

    if (result.error || isNaN(result.balance)) {
      return alert("Возникла ошибка при запросе баланса.");
    }

    this.balanceElement.innerText = `${result.balance}$`;

    return result.balance;
  }
}
