import { Controller } from "@hotwired/stimulus"
import {
  themeQuartz,
  createGrid,
} from "ag-grid-community";

// Connects to data-controller="report-table"
export default class extends Controller {
  static targets = ["table", "grid"]
  filterRange = null
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
    window.addEventListener("reportFilter:change", this.refreshTable.bind(this))
    console.log('ReportTableController connected');
    this.gridApi = createGrid(
        document.querySelector('#tableGrid'),
        this.gridOptions,
      );
  }

  refreshTable(event) {
    const filter = event.detail.filter
    console.log("Refreshing table with filter:", filter)
    this.getFilteredEntries(filter)
  }
  async getFilteredEntries(filterRange) {
    await fetch(`/api/time_entry/stats?range=${filterRange}`)
      .then(response => response.json())
      .then((data) => this.gridApi.setGridOption('rowData', data.entries))
  }
}
