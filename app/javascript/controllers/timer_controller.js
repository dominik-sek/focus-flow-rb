import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["timerDisplay", "taskName", "toggleButton"]
  timerInterval = null
  hours = 0
  minutes = 0
  seconds = 0
  isRunning = false

  started_at = 0
  finished_at = 0
  duration = 0

  reset() {
    this.hours = 0
    this.minutes = 0
    this.seconds = 0

    this.duration = 0
    this.started_at = 0
    this.finished_at = 0
    this.timerDisplayTarget.textContent = "00:00:00";

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
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    
    this.reset()
    this.toggleButtonTarget.textContent = "Stop";
    this.isRunning = true;

    this.started_at = new Date().toISOString()


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

  async stop() {
    this.finished_at = new Date().toISOString()
    const durationSeconds = Math.floor((new Date(this.finished_at) - new Date(this.started_at)) / 1000)
    this.duration = durationSeconds
    window.clearInterval(this.timerInterval);
    this.isRunning = false;
    this.toggleButtonTarget.textContent = "Start";
    
    const taskName = this.taskNameTarget.value;
    this.taskNameTarget.value="";
    this.submit(taskName, this.started_at, this.finished_at, this.duration)

    this.reset()
  }

  async submit(taskName, started_at, finished_at, duration) {
    const data = {
      name: taskName,
      started_at: this.started_at,
      finished_at: this.finished_at,
      duration: this.duration
    }

    await fetch('/api/time_entry', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content

      },
      body: JSON.stringify(data)
    }).then(response => {
      if (!response.ok) throw new Error("Network error")
      return response.json()
    })
      .then(data => {
        window.dispatchEvent(new CustomEvent("toast:show", {
          detail: {
            message: "Entry saved!",
            type: "success",
            duration: 3000
          }
        }))

        window.dispatchEvent(new CustomEvent("time-entry:submitted"))
      })
      .catch(error => {
        console.error("Error:", error)
      })

  }

}
