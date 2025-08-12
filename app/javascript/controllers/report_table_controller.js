import { Controller } from "@hotwired/stimulus"
import {
  themeQuartz,
  createGrid,
} from "ag-grid-community";

// Connects to data-controller="report-table"
export default class extends Controller {
  static targets = ["table", "grid"]
  filterRange = "today"
  gridApi = null
  gridOptions = {
    theme: themeQuartz,
    rowData: [],
    columnDefs: [
        { field: "name" },
        { field: "duration" },
        { field: "started_at" },
    ]
}
  connect() {
    
    this.getEntriesFromQuery()
    window.addEventListener("reportFilter:change", this.refreshTable.bind(this))
    this.gridApi = createGrid(
        document.querySelector('#tableGrid'),
        this.gridOptions,
      );
  }

  refreshTable(event) {
    const filter = event.detail.filter
    this.getEntriesFromQuery(filter)
  }
  async getEntriesFromQuery() {
    const qs = new URLSearchParams(window.location.search).toString()
    const resp = await fetch(`/api/time_entry/stats?${qs}`)
    const data = await resp.json()
    this.gridApi.setGridOption('rowData', data.entries)
  }
}
