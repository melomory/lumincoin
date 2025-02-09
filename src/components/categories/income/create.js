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
      .addEventListener("click", () => this.openNewRoute("/income"));

    this.validations = [{ element: this.categoryNameElement }];
  }

  /**
   * Найти элементы на странице.
   */
  findElements() {
    this.categoryNameElement = document.getElementById("category-name");
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
}
