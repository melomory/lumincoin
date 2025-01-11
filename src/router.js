import { Login } from "./components/auth/login.js";
import { Signup } from "./components/auth/signup.js";
import { MainLayout } from "./components/main-layout.js";

export class Router {
  constructor() {
    this.contentElement = document.getElementById("content");

    this.routes = [];

    // TODO: сделать маршруты.
    // new Signup();
    // new Login();
    new MainLayout();
  }
}
