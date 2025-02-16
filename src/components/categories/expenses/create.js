import { BalanceService } from "../../../services/balance-service";
import { ExpensesCategoryService } from "../../../services/expenses-category-service";
import { ValidationUtils } from "../../../utilities/validation-utils";

export class ExpensesCategoryCreate {
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

      const response = await ExpensesCategoryService.createCategory(createData);

      if (response.error) {
        alert(response.error);
        return response.redirect ? this.openNewRoute(response.redirect) : null;
      }

      return this.openNewRoute("/expenses");
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
