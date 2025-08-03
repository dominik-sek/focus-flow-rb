import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["timerDisplay", "toggleButton"]
  timerInterval = null
  hours = 0
  minutes = 0
  seconds = 0
  isRunning = false

  reset() {
    this.hours = 0
    this.minutes = 0
    this.seconds = 0
    this.updateDisplay()
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
    this.isRunning = false
    this.toggleButtonTarget.textContent = "Start"
  }
  connect() {
    this.reset()
    console.log("TimerController connected", this.element);    
  }
  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    //this.isRunning = !this.isRunning;
  }
  start() {
    this.reset()
    this.toggleButtonTarget.textContent = "Stop";
    this.isRunning = true;
    this.timerInterval = setInterval(() => {
      this.seconds++;
      if (this.seconds >= 60) {
        this.seconds = 0;
        this.minutes++;
      }
      if (this.minutes >= 60) {
        this.minutes = 0;
        this.hours++;
      }
      this.updateDisplay();
    }, 1000);

  }
  updateDisplay() {
    const hours = String(this.hours).padStart(2, '0');
    const minutes = String(this.minutes).padStart(2, '0');
    const seconds = String(this.seconds).padStart(2, '0');
    this.timerDisplayTarget.textContent = `${hours}:${minutes}:${seconds}`;
  }

  stop() {
    window.clearInterval(this.timerInterval);
    this.isRunning = false;
    this.toggleButtonTarget.textContent = "Start";
  }
}
