import { ExpensesCategoryService } from "../../../services/expenses-category-service";
import { UrlUtils } from "../../../utilities/url-utils";

export class ExpensesCategoryDelete {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    const id = UrlUtils.getUrlParam("id");
    if (!id) {
      return this.openNewRoute("/expenses");
    }

    document
      .getElementById("confirm-button")
      .addEventListener("click", () => this.deleteCategory(id));
    document
      .getElementById("cancel-button")
      .addEventListener("click", this.cancel.bind(this));
  }

  /**
   * Удалить категорию.
   * @param {Number} id Ид категории.
   * @returns
   */
  async deleteCategory(id) {
    const response = await ExpensesCategoryService.deleteCategory(id);

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    return this.openNewRoute("/expenses");
  }

  /**
   * Отменить редактирование.
   * @param {Object} e Аргумент события.
   */
  cancel(e) {
    e.preventDefault();

    this.openNewRoute("/expenses");
  }
}
