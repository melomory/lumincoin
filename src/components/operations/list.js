import { OperationsService } from "../../services/operations-service.js";

export class OperationsList {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    this.findElements();

    this.currentFilter = JSON.parse(localStorage.getItem("operations"));

    if (!this.currentFilter) {
      this.currentFilter = {
        period: null,
        dateFrom: null,
        dateTo: null,
      };
    } else {
      [...this.periodFilters].filter((item) =>
        new RegExp(`${this.currentFilter.period ?? "day"}`, "gi").test(item.id)
      )[0].checked = true;
      if (this.currentFilter.dateFrom) {
        let date = this.currentFilter.dateFrom.split("-");
        this.optionIntervalFromElement.value = `${date[2]}.${date[1]}.${date[0]}`;
      } else {
        this.optionIntervalFromElement.value = this.currentFilter.dateFrom;
      }

      if (this.currentFilter.dateTo) {
        let date = this.currentFilter.dateTo.split("-");
        this.optionIntervalToElement.value = `${date[2]}.${date[1]}.${date[0]}`;
      } else {
        this.optionIntervalToElement.value = this.currentFilter.dateFrom;
      }
    }

    [this.optionIntervalFromElement, this.optionIntervalToElement].forEach(
      (item) => {
        item.addEventListener("focus", function () {
          if (this.value) {
            let date = this.value.split(".");
            this.value = `${date[2]}-${date[1]}-${date[0]}`;
          }

          this.type = "date";
        });
        item.addEventListener("blur", function () {
          this.type = "text";
          if (this.value) {
            let date = this.value.split("-");
            this.value = `${date[2]}.${date[1]}.${date[0]}`;
          }
        });
      }
    );

    [...this.periodFilters].forEach((item) =>
      item.addEventListener("change", this.setFilter.bind(this))
    );

    this.optionIntervalFromElement.addEventListener(
      "blur",
      this.setFilter.bind(this)
    );

    this.optionIntervalToElement.addEventListener(
      "blur",
      this.setFilter.bind(this)
    );

    this.setFilter().then();
  }

  /**
   * Найти элементы на странице.
   */
  findElements() {
    this.categoryNameElement = document.getElementById("category-name");
    this.periodFilters = document.querySelectorAll("[name=dates]");
    this.optionIntervalFromElement = document.getElementById(
      "option-interval-from"
    );
    this.optionIntervalToElement =
      document.getElementById("option-interval-to");
  }

  /**
   * Получить категории.
   * @returns {string} Маршрут перенаправления.
   */
  async getOperations() {
    const response = await OperationsService.getOperations(this.currentFilter);

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    this.showRecords(response.operations);
  }

  /**
   * Задать фильтр.
   */
  async setFilter() {
    const current = [...this.periodFilters].filter((item) => item.checked)[0];
    const periodType = current.id.replace("option-", "");
    this.currentFilter.period = periodType;

    if (this.currentFilter.period === "interval") {
      if (
        this.optionIntervalFromElement &&
        this.optionIntervalFromElement.value &&
        this.optionIntervalFromElement.value !== this.currentFilter.dateFrom
      ) {
        let date = this.optionIntervalFromElement.value.split(".");
        this.currentFilter.dateFrom = `${date[2]}-${date[1]}-${date[0]}`;
      } else {
        this.currentFilter.dateFrom = null;
      }

      if (
        this.optionIntervalToElement &&
        this.optionIntervalToElement.value &&
        this.optionIntervalToElement.value !== this.currentFilter.dateFrom
      ) {
        let date = this.optionIntervalToElement.value.split(".");
        this.currentFilter.dateTo = `${date[2]}-${date[1]}-${date[0]}`;
      } else {
        this.currentFilter.dateTo = null;
      }
    }

    localStorage.setItem("operations", JSON.stringify(this.currentFilter));

    await this.getOperations();
  }

  /**
   * Отобразить операции на странице.
   * @param {Object} operations Операции.
   */
  showRecords(operations) {
    const recordsElement = document.getElementById("records");
    recordsElement.replaceChildren();
    for (let i = 0; i < operations.length; i++) {
      const trElement = document.createElement("tr");

      const operationIdCell = trElement.insertCell();
      operationIdCell.classList.add("fw-bold");
      operationIdCell.innerText = operations[i].id;

      const operationTypeCell = trElement.insertCell();
      if (operations[i].type === "income") {
        operationTypeCell.classList.add("text-success");
        operationTypeCell.innerText = "доход";
      } else {
        operationTypeCell.classList.add("text-danger");
        operationTypeCell.innerText = "расход";
      }

      trElement.insertCell().innerText = operations[i].category;
      trElement.insertCell().innerText = `${operations[i].amount}$`;
      trElement.insertCell().innerText = operations[i].date;
      trElement.insertCell().innerText = operations[i].comment;

      const gridToolsCell = trElement.insertCell();
      const gridToolsWrapper = document.createElement("div");
      gridToolsWrapper.classList.add("d-flex", "gap-2", "tools");

      const deleteTool = document.createElement("a");
      deleteTool.href = `/operations/delete?id=${operations[i].id}`;
      deleteTool.setAttribute("data-bs-toggle", "modal");
      deleteTool.setAttribute("data-bs-target", "#delete-action");

      const deleteToolImage = document.createElement("img");
      deleteToolImage.src = "/assets/images/icons/trash.svg";

      deleteTool.appendChild(deleteToolImage);

      const editTool = document.createElement("a");
      editTool.href = `/operations/edit?id=${operations[i].id}`;

      const editToolImage = document.createElement("img");
      editToolImage.src = "/assets/images/icons/pen.svg";

      editTool.appendChild(editToolImage);

      gridToolsWrapper.appendChild(deleteTool);
      gridToolsWrapper.appendChild(editTool);
      gridToolsCell.appendChild(gridToolsWrapper);

      recordsElement.appendChild(trElement);
    }
  }
}
