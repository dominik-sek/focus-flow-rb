import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="time-table"
export default class extends Controller {
  static targets = ['tbody', 'skeleton']
  connect() {
    this.loadEntries()
    window.addEventListener("time-entry:submitted", this.refresh.bind(this))
  }

  disconnect() {
    window.removeEventListener("time-entry:submitted", this.refresh.bind(this))
  }

  refresh() {
    this.loadEntries()
  }
  async loadEntries() {
    this.showLoader()

    try {
      const response = await fetch("/api/time_entry/current_month?limit=5")
      const json = await response.json()
      const entries = json.data || json
      console.log(entries)

      this.tbodyTarget.innerHTML = entries.map(entry => this.buildRow(entry)).join("")
      if (entries.length === 0) {
        this.tbodyTarget.innerHTML = "<tr><td colspan='4' class='px-6 py-4'>No entries yet, they will be added automatically after you stop the timer!</td></tr>"
      }
    } catch (e) {
      console.error("Failed to load entries", e)
      this.tbodyTarget.innerHTML = "<tr><td colspan='4' class='px-6 py-4'>Error loading data</td></tr>"
    } finally {
      this.hideLoader()
    }
  }

  showLoader() {
    this.skeletonTarget.classList.remove("hidden")
  }

  hideLoader() {
    this.skeletonTarget.classList.add("hidden")
  }

  buildRow(entry) {
    const formatTime = iso => new Date(iso).toLocaleString()
    const formatDuration = secs => {
      const h = Math.floor(secs / 3600).toString().padStart(2, '0')
      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0')
      const s = (secs % 60).toString().padStart(2, '0')
      return `${h}:${m}:${s}`
    }


    return `
      <tr class="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white max-w-xs truncate " title="${entry.name}">${entry.name}</td>
        <td class="px-6 py-4 whitespace-nowrap min-w-fit">${formatTime(entry.started_at)}</td>
        <td class="px-6 py-4 whitespace-nowrap min-w-fit">${formatTime(entry.finished_at)}</td>
        <td class="px-6 py-4">${formatDuration(entry.duration)}</td>
      </tr>
    `
  }
}
