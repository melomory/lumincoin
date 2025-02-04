import { Login } from "./components/auth/login.js";
import { Logout } from "./components/auth/logout.js";
import { Signup } from "./components/auth/signup.js";
import { ExpensesCategoryCreate } from "./components/categories/expenses/create.js";
import { ExpensesCategoryDelete } from "./components/categories/expenses/delete.js";
import { ExpensesCategoryEdit } from "./components/categories/expenses/edit.js";
import { ExpensesCategoryList } from "./components/categories/expenses/list.js";
import { IncomeCategoryCreate } from "./components/categories/income/create.js";
import { IncomeCategoryDelete } from "./components/categories/income/delete.js";
import { IncomeCategoryEdit } from "./components/categories/income/edit.js";
import { IncomeCategoryList } from "./components/categories/income/list.js";
import { IncomeAndExpensesCreate } from "./components/income-and-expenses/create.js";
import { IncomeAndExpensesDelete } from "./components/income-and-expenses/delete.js";
import { IncomeAndExpensesEdit } from "./components/income-and-expenses/edit.js";
import { IncomeAndExpensesList } from "./components/income-and-expenses/list.js";
import { Main } from "./components/main.js";
import { AuthUtils } from "./utilities/auth-utils.js";

export class Router {
  constructor() {
    this.titlePageElement = document.getElementById("title");
    this.contentPageElement = document.getElementById("content");
    this.userName = null;

    this.initEvents();

    this.routes = [
      {
        route: "/404",
        title: "Страница не найдена",
        filePathPage: "/pages/404.html",
      },
      {
        route: "/",
        title: "Главная",
        filePathPage: "/pages/main.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new Main(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/login",
        title: "Вход в систему",
        filePathPage: "/pages/auth/login.html",
        useLayout: "",
        load: () => {
          new Login(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/signup",
        title: "Регистрация",
        filePathPage: "/pages/auth/signup.html",
        useLayout: "",
        load: () => {
          new Signup(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/logout",
        load: () => {
          new Logout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-and-expenses",
        title: "Доходы & Расходы",
        filePathPage: "/pages/income-and-expenses/list.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new IncomeAndExpensesList(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-and-expenses/create",
        title: "Создание дохода/расхода",
        filePathPage: "/pages/income-and-expenses/create.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new IncomeAndExpensesCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-and-expenses/edit",
        title: "Редактирование дохода/расхода",
        filePathPage: "/pages/income-and-expenses/edit.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new IncomeAndExpensesEdit(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income-and-expenses/delete",
        load: () => {
          new IncomeAndExpensesDelete(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income",
        title: "Доходы",
        filePathPage: "/pages/categories/income/list.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new IncomeCategoryList(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income/create",
        title: "Создание категории доходов",
        filePathPage: "/pages/categories/income/create.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new IncomeCategoryCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income/edit",
        title: "Редактирование категории доходов",
        filePathPage: "/pages/categories/income/edit.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new IncomeCategoryEdit(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/income/delete",
        load: () => {
          new IncomeCategoryDelete(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses",
        title: "Расходы",
        filePathPage: "/pages/categories/expenses/list.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new ExpensesCategoryList(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses/create",
        title: "Создание категории расходов",
        filePathPage: "/pages/categories/expenses/create.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new ExpensesCategoryCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses/edit",
        title: "Редактирование категории расходов",
        filePathPage: "/pages/categories/expenses/edit.html",
        useLayout: "/layouts/main.html",
        load: () => {
          new ExpensesCategoryEdit(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses/delete",
        load: () => {
          new ExpensesCategoryDelete(this.openNewRoute.bind(this));
        },
      },
    ];
  }

  /**
   * Инициализировать события после загрузки.
   */
  initEvents() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    window.addEventListener("click", this.clickHandler.bind(this));
  }

  /**
   * Перейти по новому пути.
   * @param {string} url - Путь.
   */
  async openNewRoute(url) {
    const currentRoute = window.location.pathname;
    history.pushState({}, "", url);
    await this.activateRoute(currentRoute);
  }

  /**
   * Установить маршрут.
   */
  async activateRoute() {
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => item.route === urlRoute);

    if (newRoute) {
      if (newRoute.title) {
        this.titlePageElement.innerText = newRoute.title + " | Lumincoin";
      }

      if (newRoute.filePathPage) {
        let contentBlock = this.contentPageElement;
        if (newRoute.useLayout) {
          this.contentPageElement.innerHTML = await fetch(
            newRoute.useLayout
          ).then((response) => response.text());
          contentBlock = document.getElementById("content-layout");
          contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(
            (response) => response.text()
          );

          this.profileNameElement = document.getElementById("profile-name");

          if (!this.userInfo) {
            let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
            if (!this.userName) {
              userInfo = JSON.parse(userInfo);
              if (userInfo.name || userInfo.lastName) {
                this.userName = [userInfo.name, userInfo.lastName].join(" ");
              }
            }
          }
          this.profileNameElement.innerText = this.userName;

          this.activateMenuItem(newRoute);
        }

        contentBlock.innerHTML = await fetch(newRoute.filePathPage).then(
          (response) => response.text()
        );
      }

      if (newRoute.load && typeof newRoute.load === "function") {
        newRoute.load();
      }
    } else {
      console.log("No route found");
      history.pushState({}, "", "/404");
      await this.activateRoute();
    }
  }

    /**
   * Активировать пункт меню.
   * @param {string} route - Маршрут.
   */
  activateMenuItem(route) {
    document.querySelectorAll(".sidebar .nav-link").forEach((item) => {
      const href = item.getAttribute("href");
      if (
        (new RegExp(`(^${href}$)|(^${href}\/)`).test(route.route) &&
          href !== "/") ||
        (route.route === "/" && href === "/")
      ) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  async clickHandler(e) {
    let element = null;
    if (e.target.nodeName === "A") {
      element = e.target;
    } else if (e.target.parentNode.nodeName === "A") {
      element = e.target.parentNode;
    }

    if (element) {
      e.preventDefault();

      const currentRoute = window.location.pathname;
      const url = element.href.replace(window.location.origin, "");
      if (
        !url ||
        currentRoute === url.replace("#", "") ||
        url.startsWith("javascript:void(0)")
      ) {
        return;
      }

      await this.openNewRoute(url);
    }
  }
}
