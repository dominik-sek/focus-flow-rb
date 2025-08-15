import { Controller } from "@hotwired/stimulus"
import {
  themeQuartz,
  createGrid,
  GridApi,
} from "ag-grid-community";
import dayjs from "dayjs";

// Connects to data-controller="report-table"
export default class extends Controller {
  static targets = ["table", "grid"]
  declare readonly gridTarget: HTMLDivElement
  filterRange = "today"
  gridApi!: GridApi 
  gridOptions = {
    theme: themeQuartz,
    suppressServerSideFullWidthLoadingRow: true,
        autoSizeStrategy: {
        type: 'fitGridWidth'
        },
    pagination:true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50, 100],

    rowData: [],
    columnDefs: [
        { field: "name", headerName: 'Task name' },
        { field: "duration", headerName: 'Duration' },
        { field: "started_at", headerName: 'Started at' },
    ]
  }

  connect() {
    this.getEntriesFromQuery()
    window.addEventListener("reportFilter:change", this.refreshTable.bind(this))
    this.gridApi = createGrid(
        this.gridTarget,
        this.gridOptions,
      );
  }

  refreshTable() {
    this.getEntriesFromQuery()
  }

  async getEntriesFromQuery() {
    const qs = new URLSearchParams(window.location.search).toString()
    const resp = await fetch(`/api/time_entry/stats?${qs}`)
    const data = await resp.json()
    

    let dataEntriesDateFormatted = data.entries.map((entry)=>({
      ...entry,
      started_at: dayjs(entry.started_at).format('YYYY/MM/DD, HH:mm:ss')
    }))
    console.log(dataEntriesDateFormatted)
    this.gridApi.setGridOption('rowData', dataEntriesDateFormatted)
  }
}
