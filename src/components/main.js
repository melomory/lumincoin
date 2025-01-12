import Chart from "chart.js/auto";

export class Main {
  constructor() {
    this.findElements();

    this.dateControlInputs.forEach((item) => {
      item.addEventListener("focus", function () {
        if (this.value) {
          let date = this.value.split('.');
          this.value = `${date[2]}-${date[1]}-${date[0]}`;
        }

        this.type = "date";
      });
      item.addEventListener("blur", function () {
        this.type = "text";
        if (this.value) {
          let date = this.value.split('-');
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
    new Chart(this.incomeChart, config);
    new Chart(this.expensesChart, config);
  }

  findElements() {
    this.incomeChart = document.getElementById("income-chart");
    this.expensesChart = document.getElementById("expenses-chart");
    this.dateControlInputs = document.querySelectorAll(".date-control input");
  }
}
