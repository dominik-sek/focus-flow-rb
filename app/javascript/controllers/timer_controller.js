import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "timerDisplay" ]

  connect() {
    console.log("TimerController connected", this.element);
    console.log(this.timerDisplayTarget);
    
  }
  start() {
    console.log("Timer started");
    this.timerDisplayTarget.textContent = "00:00:01"
  }
}
