import { Controller } from "@hotwired/stimulus";
import { formatDuration } from "../javascript/helpers/formatDuration"

export default class extends Controller {
  static targets = ["statData"]
  filterValue = ""
  connect() {
    window.addEventListener("reportFilter:change", this.refreshData.bind(this))
  }
  refreshData(event) {
    this.filterValue = event.detail.filter;
    this.getFilteredEntries(this.filterValue).then((data) => {
      console.log(data.entries)
      this.statDataTargets.forEach((el) => {
          el.textContent = formatDuration(data[el.dataset.statName])
      })
    }).catch((error) => {
      console.error("Error fetching filtered entries:", error);
    })
  }

  async getFilteredEntries(filterRange) {
    let response = await fetch(`/api/time_entry/stats?range=${filterRange}`)
    let data = await response.json()
    return data;
  }
}
