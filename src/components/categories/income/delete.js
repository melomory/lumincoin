import { IncomeCategoryService } from "../../../services/income-category-service.js";
import { UrlUtils } from "../../../utilities/url-utils.js";

export class IncomeCategoryDelete {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    const id = UrlUtils.getUrlParam("id");
    if (!id) {
      return this.openNewRoute("/income");
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
    const response = await IncomeCategoryService.deleteCategory(id);

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    return this.openNewRoute("/income");
  }

  /**
   * Отменить удаление.
   * @param {Object} e Аргумент события.
   */
  cancel(e) {
    e.preventDefault();

    this.openNewRoute("/income");
  }
}
