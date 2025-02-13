import { AuthUtils } from "../../utilities/auth-utils.js";
import { ValidationUtils } from "../../utilities/validation-utils.js";
import { AuthService } from "../../services/auth-service.js";

export class Signup {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/");
    }

    this.findElements();

    this.validations = [
      { element: this.fullNameElement },
      {
        element: this.emailElement,
        options: { pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ },
      },
      { element: this.passwordElement },
      {
        element: this.passwordRepeatElement,
        options: { compareTo: this.passwordElement.value },
      },
    ];

    document
      .getElementById("process-button")
      .addEventListener("click", this.signUp.bind(this));
  }

  findElements() {
    this.fullNameElement = document.getElementById("full-name");
    this.emailElement = document.getElementById("email");
    this.passwordElement = document.getElementById("password");
    this.passwordRepeatElement = document.getElementById("password-repeat");
  }

  async signUp() {
    for (let i = 0; i < this.validations.length; i++) {
      if (
        this.passwordRepeatElement &&
        this.validations[i].element === this.passwordRepeatElement
      ) {
        this.validations[i].options.compareTo =
          this.passwordRepeatElement.value;
      }
    }

    if (ValidationUtils.validateForm(this.validations)) {
      const [lastName, name] = this.fullNameElement.value
        .split(" ")
        .map((x) => x.trim());
      const signupResult = await AuthService.signup({
        name: name,
        lastName: lastName,
        email: this.emailElement.value,
        password: this.passwordElement.value,
        passwordRepeat: this.passwordRepeatElement.value,
      });

      if (signupResult) {
        return this.openNewRoute("/login");
      } else {
        alert("Не удалось создать аккаунт.");
      }
    }
  }
}
