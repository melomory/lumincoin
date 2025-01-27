export class MainLayout {
  constructor() {
    this.findElements();

    Array.from(this.navigationLinks).forEach((link) =>
      link.addEventListener("click", () => {
        Array.from(this.navigationLinks).forEach((link) => {
          link.classList.remove("active");
          link.classList.add("sidebar-item-color");
        });
        link.classList.add("active");
        link.classList.remove("sidebar-item-color");
      })
    );
  }

  findElements() {
    this.navigationLinks = document.querySelectorAll(".sidebar :not(#categories-group) .nav-link");
  }
}

// TODO: удалить после реализации маршрутизации.
new MainLayout();
