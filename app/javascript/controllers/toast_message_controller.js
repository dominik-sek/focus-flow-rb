import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toastDefault", "messageText"]

  connect() {
    window.addEventListener("toast:show", this.show.bind(this))
  }

  disconnect() {
    window.removeEventListener("toast:show", this.show.bind(this))
  }

  show(event) {
    const { message, type = "success", duration = 3000 } = event.detail

    this.toastDefaultTarget.classList.remove("hidden")
    this.toastDefaultTarget.classList.add("flex")

    this.messageTextTarget.textContent = message

    this.toastDefaultTarget.classList.remove("bg-green-600", "bg-red-600", "bg-blue-600")
    if (type === "error") {
      this.toastDefaultTarget.classList.add("bg-red-600")
    } else if (type === "info") {
      this.toastDefaultTarget.classList.add("bg-blue-600")
    } else {
      this.toastDefaultTarget.classList.add("bg-green-600")
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => this.close(), duration)
  }

  close() {
    this.toastDefaultTarget.classList.add("hidden")
    this.toastDefaultTarget.classList.remove("flex")
  }
}
