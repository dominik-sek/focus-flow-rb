import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    console.log("Hello, Stimulus!", this.element);
    window.addEventListener("reportFilter:change", this.refreshData.bind(this))
  }
  refreshData(event){
    console.log(event)
  }
}
