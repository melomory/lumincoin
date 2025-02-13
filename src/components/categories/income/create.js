import { BalanceService } from "../../../services/balance-service";
import { IncomeCategoryService } from "../../../services/income-category-service";
import { ValidationUtils } from "../../../utilities/validation-utils";

export class IncomeCategoryCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.findElements();

    document
      .getElementById("create-button")
      .addEventListener("click", this.createCategory.bind(this));

    document
      .getElementById("cancel-button")
      .addEventListener("click", this.cancel.bind(this));

    this.validations = [{ element: this.categoryNameElement }];

    this.getBalance().then();
  }

  /**
   * Найти элементы на странице.
   */
  findElements() {
    this.categoryNameElement = document.getElementById("category-name");
    this.balanceElement = document.getElementById("balance");
  }

  /**
   * Создать категорию.
   * @param {Object} e Аргумент события.
   * @returns
   */
  async createCategory(e) {
    e.preventDefault();

    if (ValidationUtils.validateForm(this.validations)) {
      const createData = {
        title: this.categoryNameElement.value,
      };

      const response = await IncomeCategoryService.createCategory(createData);

      if (response.error) {
        alert(response.error);
        return response.redirect ? this.openNewRoute(response.redirect) : null;
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

    this.openNewRoute("/income");
  }

    /**
   * Получить баланс.
   * @returns {Number} Баланс.
   */
  async getBalance() {
    const result = await BalanceService.getBalance();

    if (
      result.error ||
      !result.balance ||
      (result.balance && !result.balance)
    ) {
      return alert("Возникла ошибка при запросе баланса.");
    }

    this.balanceElement.innerText = `${result.balance}$`;

    return result.balance;
  }
}
