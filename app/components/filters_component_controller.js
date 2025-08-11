import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["filterButton"]
  fromDate = null
  toDate = null
  connect() {

  }
  setFromDate(event) {
    event.target.valueAsDate = new Date(event.target.value);
    this.fromDate = event.target.value
    this.toDate = new Date().toISOString().split('T')[0];
    window.dispatchEvent(new CustomEvent("reportFilter:change", {
      detail: {
        filter: `custom&date_from=${this.fromDate}&date_to=${this.toDate}`
      },
      bubbles: false
    }))
  }
  setToDate(event) {
    this.toDate = event.target.value
    if (!this.fromDate) {
      this.fromDate = new Date().toISOString().split('T')[0];
    }
    window.dispatchEvent(new CustomEvent("reportFilter:change", {
      detail: {
        filter: `custom&date_from=${this.fromDate}&date_to=${this.toDate}`
      },
      bubbles: false
    }))
  }
  changeFilter(event) {
    const range = event.target.dataset.filter
    this.filterButtonTargets.forEach((el) => {
      el.dataset.active = false;
    })
    
    event.target.dataset.active = true;
    window.dispatchEvent(new CustomEvent("reportFilter:change", {
      detail: {
        filter: range
      },
      bubbles: false
    }))
  }

}
