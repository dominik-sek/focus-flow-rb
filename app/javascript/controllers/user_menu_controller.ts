import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="user-menu"
export default class extends Controller {
  static targets = ["dropdownMenu"];
  declare readonly dropdownMenuTarget: HTMLButtonElement;
  isOpen = false;
  connect() {
    this.checkIfOutsideClick = this.checkIfOutsideClick.bind(this);
    console.log("UserMenuController connected");
  }

  disconnect() {
    document.removeEventListener("click", this.handleOutsideClick);

  }

  toggle() {
    event.stopPropagation();

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      document.addEventListener("click", this.checkIfOutsideClick);
      this.dropdownMenuTarget.classList.add("visible");
    } else {
      this.close();
    }
  }
  close() {
    this.isOpen = false;
    this.dropdownMenuTarget.classList.remove("visible");

    this.dropdownMenuTarget.classList.add("invisible");

    document.removeEventListener("click", this.checkIfOutsideClick);
  }
  checkIfOutsideClick(e) {
    if (!this.element.contains(e.target)) {
      this.close();
    }
  }

}
