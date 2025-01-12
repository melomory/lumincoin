import { Login } from "./components/auth/login.js";
import { Signup } from "./components/auth/signup.js";
import { ExpensesCategoryCreate } from "./components/categories/expenses/create.js";
import { ExpensesCategoryEdit } from "./components/categories/expenses/edit.js";
import { ExpensesCategoryList } from "./components/categories/expenses/list.js";
import { IncomeCategoryCreate } from "./components/categories/income/create.js";
import { IncomeCategoryEdit } from "./components/categories/income/edit.js";
import { IncomeCategoryList } from "./components/categories/income/list.js";
import { IncomeAndExpenses } from "./components/income-and-expenses.js";
import { MainLayout } from "./components/main-layout.js";
import { Main } from "./components/main.js";

export class Router {
  constructor() {
    this.contentElement = document.getElementById("content");

    this.routes = [];

    // TODO: сделать маршруты.
    // new Signup();
    // new Login();
    // new MainLayout();
    // new Main();
    // new IncomeCategoryList();
    // new IncomeCategoryCreate();
    // new IncomeCategoryEdit();
    // new ExpensesCategoryList();
    // new ExpensesCategoryCreate();
    // new ExpensesCategoryEdit();
    new IncomeAndExpenses();
  }
}
