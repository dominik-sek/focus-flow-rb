import { Controller } from "@hotwired/stimulus"
import { createGrid, GridApi, themeQuartz } from "ag-grid-community"
import dayjs from "dayjs"
import { formatDuration } from "../helpers/formatDuration"

// Connects to data-controller="time-table"
export default class extends Controller {
  static targets = ['tableGrid']
  declare readonly tableGridTarget: HTMLDivElement

  gridApi!: GridApi
  gridOptions = {
    theme: themeQuartz,
    suppressServerSideFullWidthLoadingRow: true,
    rowData: [],
        autoSizeStrategy: {
        type: 'fitGridWidth',
    },
    columnDefs: [
      { field: "name", headerName: 'Task name' },
      { field: "duration", headerName: 'Duration' },
      { field: "started_at", headerName: 'Started at' },
      { field: "project", headerName: "Project name" }
    ]
  }

  connect() {
    this.loadEntries()
    window.addEventListener("time-entry:submitted", this.refresh.bind(this))
    this.gridApi = createGrid(
      this.tableGridTarget,
      this.gridOptions,
    );
  }

  disconnect() {
    window.removeEventListener("time-entry:submitted", this.refresh.bind(this))
  }

  refresh() {
    this.loadEntries()
  }

  async loadEntries() {

    try {
      const response = await fetch("/api/time_entry/stats")
      const json = await response.json()
      const entries = json.entries || json
      const formattedEntries = entries.slice(0, 5).map((entry) => {

        return {
          ...entry,
          duration: formatDuration(entry.duration),
          started_at: dayjs(entry.started_at).format('YYYY/MM/DD, HH:mm:ss'),
          project: entry.project?.name || "No project"
        }

      })

      this.gridApi.setGridOption('rowData', formattedEntries)
      this.tableGridTarget.classList.remove('h-[100px]')
      this.gridApi.setGridOption('domLayout', 'autoHeight')

    } catch (e) {
      console.error("Failed to load entries", e)
      this.gridApi.setGridOption('domLayout', 'normal')

    } 
  }

}
