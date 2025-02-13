import { BalanceService } from "../../services/balance-service.js";
import { ExpensesCategoryService } from "../../services/expenses-category-service.js";
import { IncomeCategoryService } from "../../services/income-category-service.js";
import { OperationsService } from "../../services/operations-service.js";
import { UrlUtils } from "../../utilities/url-utils.js";
import { ValidationUtils } from "../../utilities/validation-utils.js";

export class OperationsEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    const id = UrlUtils.getUrlParam("id");
    if (!id) {
      return this.openNewRoute("/operations");
    }

    this.findElements();

    document
      .getElementById("create-button")
      .addEventListener("click", this.saveOperation.bind(this));

    document
      .getElementById("cancel-button")
      .addEventListener("click", this.cancel.bind(this));

    this.typeElement.addEventListener("change", async () => {
      const categories = await this.getCategories(this.typeElement.value);

      if (categories) {
        this.populateCategoryControl(categories, null);
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
        options: { pattern: /^\d*([.,])?\d+$/ },
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

    this.init(id).then();
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
    this.balanceElement = document.getElementById("balance");
  }

  /**
   * Инициализировать значения на странице.
   * @param {Number} id Ид операции.
   */
  async init(id) {
    const operation = await this.getOperation(id);

    if (operation) {
      this.typeElement.value = operation.type; //= operation.type === "income" ? "Доход" : "Расход";
      this.amountElement.value = operation.amount;
      this.commentElement.value = operation.comment;

      const categories = await this.getCategories(operation.type);

      if (categories) {
        this.populateCategoryControl(categories, operation.category);
      }

      let date = operation.date.split("-");
      this.dateElement.value = `${date[2]}.${date[1]}.${date[0]}`;
    }

    await this.getBalance();
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
   * @param {Object} currentCategory Текущая категория.
   */
  populateCategoryControl(categories, currentCategory) {
    const optionsToRemove = this.categoryElement.getElementsByTagName("option");

    for (let i = optionsToRemove.length - 1; optionsToRemove.length > 1; --i) {
      this.categoryElement.removeChild(optionsToRemove[i]);
    }

    for (let i = 0; i < categories.length; ++i) {
      const optionElement = document.createElement("option");
      optionElement.value = categories[i].id;
      optionElement.innerText = categories[i].title;
      if (currentCategory === categories[i].title) {
        optionElement.selected = true;
      }

      this.categoryElement.appendChild(optionElement);
    }
  }

  /**
   * Получить операцию.
   * @param {Number} id Ид операции.
   * @returns {Object} Операция.
   */
  async getOperation(id) {
    const result = await OperationsService.getOperation(id);
    if (result.redirect) {
      return this.openNewRoute(result.redirect);
    }

    if (result.error || !result.operation) {
      return alert("Возникла ошибка при запросе категории доходов.");
    }

    this.operationOriginalData = result.operation;

    return result.operation;
  }

  /**
   * Сохранить операцию.
   * @param {Object} e Аргумент события.
   * @returns
   */
  async saveOperation(e) {
    e.preventDefault();

    if (ValidationUtils.validateForm(this.validations)) {
      const date = this.dateElement.value.split(".");
      const dateISO = `${date[2]}-${date[1]}-${date[0]}`;
      const changedData = {
        type: this.typeElement.value,
        amount: this.amountElement.value,
        date: dateISO,
        comment: this.commentElement.value,
        category_id: this.categoryElement.value,
      };

      if (Object.keys(changedData).length > 0) {
        const response = await OperationsService.updateOperation(
          this.operationOriginalData.id,
          changedData
        );

        if (response.error) {
          alert(response.error);
          return response.redirect
            ? this.openNewRoute(response.redirect)
            : null;
        }

        return this.openNewRoute("/operations");
      }

      return this.openNewRoute("/operations");
    }
  }

  /**
   * Отменить редактирование.
   * @param {Object} e Аргумент события.
   */
  cancel(e) {
    e.preventDefault();

    this.openNewRoute("/operations");
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
