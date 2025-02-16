import { BalanceService } from "../../../services/balance-service";
import { ExpensesCategoryService } from "../../../services/expenses-category-service";

export class ExpensesCategoryList {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.balanceElement = document.getElementById("balance");

    this.getCategories();
    this.getBalance().then();
  }

  /**
   * Получить категории.
   * @returns {string} Маршрут перенаправления.
   */
  async getCategories() {
    const response = await ExpensesCategoryService.getCategories();

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    this.show(response.categories);
  }

  /**
   * Отобразить категории на странице.
   * @param {Object} categories Категории.
   */
  show(categories) {
    const categoriesElement = document.getElementById("categories");
    for (let i = 0; i < categories.length; i++) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card", "p-1");

      const cardBodyElement = document.createElement("div");
      cardBodyElement.classList.add("card-body");

      const cardTitleElement = document.createElement("h2");
      cardTitleElement.classList.add("card-title", "fs-3");
      cardTitleElement.setAttribute("data-bs-toggle", "tooltip");
      cardTitleElement.setAttribute("title", "Депозиты");
      cardTitleElement.innerText = categories[i].title;

      const cardEditButtonElement = document.createElement("a");
      cardEditButtonElement.classList.add("btn", "btn-primary", "me-2");
      cardEditButtonElement.href = `/expenses/edit?id=${categories[i].id}`;
      cardEditButtonElement.innerText = "Редактировать";

      const cardDeleteButtonElement = document.createElement("a");
      cardDeleteButtonElement.classList.add("btn", "btn-danger");
      cardDeleteButtonElement.href = `/expenses/delete?id=${categories[i].id}`;
      cardDeleteButtonElement.setAttribute("data-bs-toggle", "modal");
      cardDeleteButtonElement.setAttribute("data-bs-target", "#delete-action");
      cardDeleteButtonElement.innerText = "Удалить";

      cardBodyElement.appendChild(cardTitleElement);
      cardBodyElement.appendChild(cardEditButtonElement);
      cardBodyElement.appendChild(cardDeleteButtonElement);
      cardElement.appendChild(cardBodyElement);

      categoriesElement.appendChild(cardElement);
    }

    const cardEmptyElement = document.createElement("div");
    cardEmptyElement.classList.add(
      "card",
      "p-1",
      "blank",
      "fs-3",
      "d-flex",
      "align-items-center",
      "justify-content-center"
    );
    cardEmptyElement.onclick = () => this.openNewRoute("/income/create");

    const signElement = document.createElement("p");
    signElement.classList.add("add-sign");
    signElement.innerText = "+";

    cardEmptyElement.appendChild(signElement);
    categoriesElement.appendChild(cardEmptyElement);
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
