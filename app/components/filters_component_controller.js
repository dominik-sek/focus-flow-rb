import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["filterButton"]
  connect() {

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
