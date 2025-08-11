import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["filterButton"]
  fromDate = null
  toDate = null

  connect() {
    console.log('filter component connected')
    this.setActiveByName("today")
    this.emitRange("today")
  }

  setFromDate(event) {
    this.fromDate = event.target.value
    this.toDate   = new Date().toISOString().split("T")[0]
    this.emitRange(`custom&date_from=${this.fromDate}&date_to=${this.toDate}`)
  }

  setToDate(event) {
    this.toDate = event.target.value
    if (!this.fromDate) this.fromDate = new Date().toISOString().split("T")[0]
    this.emitRange(`custom&date_from=${this.fromDate}&date_to=${this.toDate}`)
  }

  changeFilter(event) {
    const btn = event.currentTarget || event.target.closest("button")
    if (!btn) return
    const range = btn.dataset.filter
    this.setActive(btn)
    this.emitRange(range)
  }

  setActiveByName(name) {
    const btn = this.filterButtonTargets.find(el => el.dataset.filter === name)
    if (btn) this.setActive(btn)
  }

  emitRange(range) {

    window.dispatchEvent(new CustomEvent("reportFilter:change", {
      detail: { filter: range },
      bubbles: false
    }))
  }

   setActive(buttonEl) {
    this.filterButtonTargets.forEach(el => {
      el.dataset.active = "false"
      el.setAttribute("aria-pressed", "false")
    })
    buttonEl.dataset.active = "true"
    buttonEl.setAttribute("aria-pressed", "true")
  }

}
