import { OperationsService } from "../../services/operations-service.js";
import { UrlUtils } from "../../utilities/url-utils.js";

export class OperationsDelete {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    const id = UrlUtils.getUrlParam("id");
    if (!id) {
      return this.openNewRoute("/operations");
    }

    document
      .getElementById("confirm-button")
      .addEventListener("click", () => this.deleteOperation(id));
    document
      .getElementById("cancel-button")
      .addEventListener("click", this.cancel.bind(this));
  }

  /**
   * Удалить операцию.
   * @param {Number} id Ид операции.
   * @returns
   */
  async deleteOperation(id) {
    const response = await OperationsService.deleteOperation(id);

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    return this.openNewRoute("/operations");
  }

  /**
   * Отменить удаление.
   * @param {Object} e Аргумент события.
   */
  cancel(e) {
    e.preventDefault();

    window.history.pushState({}, null, "/operations");
  }
}
