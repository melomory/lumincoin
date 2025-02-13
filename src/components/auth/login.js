import { AuthUtils } from "../../utilities/auth-utils.js";
import { ValidationUtils } from "../../utilities/validation-utils.js";
import { AuthService } from "../../services/auth-service.js";

export class Login {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/");
    }

    this.findElements();

    this.validations = [
      {
        element: this.emailElement,
        options: { pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ },
      },
      { element: this.passwordElement },
    ];

    document
      .getElementById("process-button")
      .addEventListener("click", this.login.bind(this));
  }

  findElements() {
    this.emailElement = document.getElementById("email");
    this.passwordElement = document.getElementById("password");
    this.rememberMeElement = document.getElementById("remember-me");
  }

  async login() {
    if (ValidationUtils.validateForm(this.validations)) {
      const loginResult = await AuthService.login({
        email: this.emailElement.value,
        password: this.passwordElement.value,
        rememberMe: this.rememberMeElement.checked,
      });

      if (loginResult) {
        AuthUtils.setAuthInfo(
          loginResult.tokens.accessToken,
          loginResult.tokens.refreshToken,
          {
            id: loginResult.user.id,
            name: loginResult.user.name,
            lastName: loginResult.user.lastName
          }
        );

        return this.openNewRoute("/");
      } else {
        alert("Неверный логин или пароль.");
      }
    }
  }
}
