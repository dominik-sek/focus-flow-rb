import { Controller } from "@hotwired/stimulus"

type ToastKind = "success" | "info" | "error"
type ToastDetail = { message: string; type?: ToastKind; duration?: number; }

export default class extends Controller {
  static targets = ["toastDefault", "messageText"]
  declare readonly toastDefaultTarget: HTMLElement
  declare readonly messageTextTarget: HTMLElement
  private onShow = (e: Event) => this.show(e as CustomEvent<ToastDetail>)
  private timeout?: ReturnType <typeof window.setTimeout>
  connect() {
    window.addEventListener("toast:show", this.onShow)
  }

  disconnect() {
    window.removeEventListener("toast:show", this.onShow)
  }

  show(event: CustomEvent<ToastDetail>) {
    const { message, type = "success", duration = 3000 } = event.detail

    this.toastDefaultTarget.classList.remove("toast-closed", "hidden")
    this.toastDefaultTarget.classList.add("flex", "toast-visible")

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
    this.toastDefaultTarget.classList.add("toast-closed")

  }
}
