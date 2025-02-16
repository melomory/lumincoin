import Chart from "chart.js/auto";
import { AuthUtils } from "../utilities/auth-utils.js";
import { BalanceService } from "../services/balance-service.js";
import { OperationsService } from "../services/operations-service.js";

export class Main {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }

    this.findElements();

    this.currentFilter = JSON.parse(localStorage.getItem("main-filter"));

    if (!this.currentFilter) {
      this.currentFilter = {
        period: null,
        dateFrom: null,
        dateTo: null,
      };
    } else {
      [...this.periodFilterElements].filter((item) =>
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

    [...this.periodFilterElements].forEach((item) =>
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

    this.init().then();
  }

  /**
   * Инициализировать данные на странице.
   */
  async init() {
    await this.setFilter();
    this.getBalance();
  }

  /**
   * Найти элементы на странице.
   */
  findElements() {
    this.incomeChartElement = document.getElementById("income-chart");
    this.expensesChartElement = document.getElementById("expenses-chart");
    this.periodFilterElements = document.querySelectorAll("[name=dates]");
    this.optionIntervalFromElement = document.getElementById(
      "option-interval-from"
    );
    this.optionIntervalToElement =
      document.getElementById("option-interval-to");
    this.balanceElement = document.getElementById("balance");
  }

  /**
   * Задать фильтр.
   */
  async setFilter() {
    const current = [...this.periodFilterElements].filter(
      (item) => item.checked
    )[0];
    this.currentFilter.period = current.id.replace("option-", "");

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

    localStorage.setItem("main-filter", JSON.stringify(this.currentFilter));

    await this.populateCharts();
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

  /**
   * Заполнить диаграммы.
   */
  async populateCharts() {
    const operations =
      (await OperationsService.getOperations(this.currentFilter))?.operations ||
      [];
    const income = operations.filter((item) => item.type === "income");
    const expenses = operations.filter((item) => item.type === "expense");
    const incomeGrouped = Object.groupBy(income, ({ category }) => category);
    const expensesGrouped = Object.groupBy(
      expenses,
      ({ category }) => category
    );

    const incomeData = {
      labels: Object.keys(incomeGrouped),
      datasets: [
        {
          label: "Доходы",
          data: Object.keys(incomeGrouped).map((key) =>
            incomeGrouped[key].reduce((result, item) => result + item.amount, 0)
          ),
          backgroundColor: this.getBackgroundColors(income.length),
          hoverOffset: 4,
        },
      ],
    };

    const incomeConfig = {
      type: "pie",
      data: incomeData,
    };

    const expensesData = {
      labels: Object.keys(expensesGrouped),
      datasets: [
        {
          label: "Расходы",
          data: Object.keys(expensesGrouped).map((key) =>
            expensesGrouped[key].reduce(
              (result, item) => result + item.amount,
              0
            )
          ),
          backgroundColor: this.getBackgroundColors(expenses.length),
          hoverOffset: 4,
        },
      ],
    };

    const expensesConfig = {
      type: "pie",
      data: expensesData,
    };

    if (this.incomeChartElement && this.expensesChartElement) {
      if (this.incomeChart) {
        this.incomeChart.destroy();
      }

      if (this.expensesChart) {
        this.expensesChart.destroy();
      }

      this.incomeChart = new Chart(this.incomeChartElement, incomeConfig);
      this.expensesChart = new Chart(this.expensesChartElement, expensesConfig);
    }
  }

  /**
   * Получить фоновые цвета для данных.
   * @param {Number} length Длина массива данных.
   * @returns {Array} Фоновые цвета.
   */
  getBackgroundColors(length) {
    let colors = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#0d6efd"];
    for (let i = colors.length - 1; i < length; ++i) {
      const red = Math.round(Math.random() * 255);
      const green = Math.round(Math.random() * 255);
      const blue = Math.round(Math.random() * 255);
      colors.push(`rgba(${red},${green},${blue}, 0.7)`);
    }

    return colors.slice(0, length);
  }
}
