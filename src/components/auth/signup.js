export class Signup {
  constructor() {
    this.findElements();

    this.validations = [
      { element: this.fullNameElement },
      {
        element: this.emailElement,
        options: { pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
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
    this.validateForm(this.validations);
  }

  validateForm(validations) {
    let isValid = true;

    for (let i = 0; i < validations.length; i++) {
      if (!this.validateField(validations[i].element, validations[i].options)) {
        isValid = false;
      }
    }

    return isValid;
  }

  validateField(element, options) {
    if (!element) {
      return false;
    }

    let condition = element.value;
    if (options) {
      if (options.hasOwnProperty("pattern")) {
        condition = element.value && element.value.match(options.pattern);
      } else if (options.hasOwnProperty("compareTo")) {
        condition = element.value && element.value === options.compareTo;
      }
    }

    if (condition) {
      element.classList.remove("is-invalid");
      return true;
    }

    element.classList.add("is-invalid");
    return false;
  }
}

// TODO: удалить после реализации маршрутизации.
new Signup();
