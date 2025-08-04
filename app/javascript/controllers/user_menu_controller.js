import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="user-menu"
export default class extends Controller {
  static targets = ["menu", "dropdownMenu"]
  isOpen = false

  connect() {
    console.log("UserMenuController connected")
  }
  toggle() {
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.dropdownMenuTarget.classList.remove("hidden")
      //this.dropdownMenuTarget.classList.add("absolute")
    } else {
      this.dropdownMenuTarget.classList.add("hidden")
      //this.dropdownMenuTarget.classList.remove("absolute")
    }
  }
}
