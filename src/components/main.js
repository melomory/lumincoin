import Chart from "chart.js/auto";
import { AuthUtils } from "./../utilities/auth-utils.js";

export class Main {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }

    this.findElements();

    this.dateControlInputs.forEach((item) => {
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
    });

    // Add charts

    const data = {
      labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
      datasets: [
        {
          label: "Доходы",
          data: [25, 35, 25, 10, 5],
          backgroundColor: [
            "#dc3545",
            "#fd7e14",
            "#ffc107",
            "#20c997",
            "#0d6efd",
          ],
          hoverOffset: 4,
        },
      ],
    };
    const config = {
      type: "pie",
      data: data,
    };

    // TODO: добавить данные, выполнить рефакторинг.
    if (this.incomeChart && this.expensesChart) {
      new Chart(this.incomeChart, config);
      new Chart(this.expensesChart, config);
    }
  }

  findElements() {
    this.incomeChart = document.getElementById("income-chart");
    this.expensesChart = document.getElementById("expenses-chart");
    this.dateControlInputs = document.querySelectorAll(".date-control input");
  }
}
