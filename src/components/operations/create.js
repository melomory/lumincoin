import { ExpensesCategoryService } from "../../services/expenses-category-service.js";
import { IncomeCategoryService } from "../../services/income-category-service.js";
import { OperationsService } from "../../services/operations-service.js";
import { UrlUtils } from "../../utilities/url-utils.js";
import { ValidationUtils } from "../../utilities/validation-utils.js";

export class OperationsCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.findElements();

    document
      .getElementById("create-button")
      .addEventListener("click", this.createOperation.bind(this));

    document
      .getElementById("cancel-button")
      .addEventListener("click", this.cancel.bind(this));

    this.typeElement.addEventListener("change", async () => {
      const categories = await this.getCategories(this.typeElement.value);

      if (categories) {
        this.populateCategoryControl(categories);
      }
    });

    this.validations = [
      { element: this.typeElement, options: { pattern: /^(?!Тип...).*$/ } },
      {
        element: this.categoryElement,
        options: { pattern: /^(?!Категория...).*$/ },
      },
      {
        element: this.amountElement,
        options: { pattern: /^\d*(\.|,)?\d+$/ },
      },
      { element: this.dateElement },
      { element: this.commentElement },
    ];

    this.dateElement.addEventListener("focus", function () {
      if (this.value) {
        let date = this.value.split(".");
        this.value = `${date[2]}-${date[1]}-${date[0]}`;
      }

      this.type = "date";
    });

    this.dateElement.addEventListener("blur", function () {
      this.type = "text";
      if (this.value) {
        let date = this.value.split("-");
        this.value = `${date[2]}.${date[1]}.${date[0]}`;
      }
    });

    this.init().then();
  }

  /**
   * Найти элементы на странице.
   */
  findElements() {
    this.typeElement = document.getElementById("type");
    this.categoryElement = document.getElementById("category");
    this.amountElement = document.getElementById("amount");
    this.dateElement = document.getElementById("date");
    this.commentElement = document.getElementById("comment");
  }

  /**
   * Инициализировать значения на странице.
   */
  async init() {
    const type = UrlUtils.getUrlParam("type");
    if (type) {
      this.typeElement.value = type;

      const categories = await this.getCategories(type);

      if (categories) {
        this.populateCategoryControl(categories);
      }
    }
  }

  /**
   * Получить категории.
   * @param {String} type Тип.
   * @returns {Array} Категории.
   */
  async getCategories(type) {
    const response =
      type === "income"
        ? await IncomeCategoryService.getCategories()
        : await ExpensesCategoryService.getCategories();

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : [];
    }

    return response.categories;
  }

  /**
   * Заполнить контрол с категориями.
   * @param {Array} categories Категории.
   */
  populateCategoryControl(categories) {
    const optionsToRemove = this.categoryElement.getElementsByTagName("option");

    for (let i = optionsToRemove.length - 1; optionsToRemove.length > 1; --i) {
      this.categoryElement.removeChild(optionsToRemove[i]);
    }

    for (let i = 0; i < categories.length; ++i) {
      const optionElement = document.createElement("option");
      optionElement.value = categories[i].id;
      optionElement.innerText = categories[i].title;

      this.categoryElement.appendChild(optionElement);
    }
  }

  /**
   * Создать операцию.
   * @param {Object} e Аргумент события.
   * @returns {Object} Созданная операция.
   */
  async createOperation(e) {
    e.preventDefault();

    if (ValidationUtils.validateForm(this.validations)) {
      const date = this.dateElement.value.split(".");
      const dateISO = `${date[2]}-${date[1]}-${date[0]}`;

      const createData = {
        type: this.typeElement.value,
        category_id: parseInt(this.categoryElement.value),
        amount: this.amountElement.value,
        date: dateISO,
        comment: this.commentElement.value,
      };

      const response = await OperationsService.createOperation(createData);

      if (response.error) {
        alert(response.error);
        return response.redirect ? this.openNewRoute(response.redirect) : null;
      }

      return this.openNewRoute("/operations");
    }
  }

  /**
   * Отменить создание.
   * @param {Object} e Аргумент события.
   */
  cancel(e) {
    e.preventDefault();

    this.openNewRoute("/operations");
  }
}
