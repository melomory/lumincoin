import { Signup } from "./components/auth/signup.js";

export class Router {
  constructor() {
    this.contentElement = document.getElementById("content");

    this.routes = [];

    // TODO: сделать маршруты.
    // Создание объектов сделано для корректной сборки.
    new Signup();
  }
}
