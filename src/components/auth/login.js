export class Login {
  constructor() {
    this.findElements();

    this.validations = [
      {
        element: this.emailElement,
        options: { pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
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
  }

  async login() {
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
