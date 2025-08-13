import { Controller } from "@hotwired/stimulus"
import * as echarts from 'echarts';
import { formatDuration } from "../helpers/formatDuration";
type EChartsOption = echarts.EChartsOption;

// Connects to data-controller="project-chart"
export default class extends Controller {
  static targets = ["chartContainer"];
  declare readonly chartContainerTarget: HTMLDivElement;
  chart!: echarts.ECharts;
  option?: EChartsOption;

  async refresh() {
    this.chart.showLoading('default')
    await this.getProjectHours();
  }

  connect() {
    this.chart = echarts.init(this.chartContainerTarget);
    window.addEventListener("time-entry:submitted", this.refresh.bind(this));
    this.refresh();
  }
  disconnect(): void {
    window.removeEventListener("time-entry:submitted", this.refresh);

  }



  showLoader() {
    this.chartContainerTarget.innerHTML =
      `
      
      `;
  }

  async getProjectHours() {
    try {
      const res = await fetch('api/projects/summary');
      const json = await res.json();
      if (!json || json.length === 0) {
        this.chart.hideLoading();
        this.chart.clear();
        return;
      }
      const data = json.map((item: unknown) => ({ value: item.duration, name: item.name }));
      const legend = json.map((item: unknown) => item.name);
      const formatter = (params: unknown) => { return `${params.name}: ${formatDuration(params.value)} hours`; };
      const option: EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: formatter
        },
        legend: {
          type: 'scroll',
          data: legend
        },
        series: [
          {
            name: "Project hours",
            type: 'pie',
            radius: '60%',
            data: data
          }

        ]
      };
      this.option = option
      this.chart.hideLoading()
      this.chart.setOption(option, { notMerge: true })
      this.chart.resize()
    } catch (e) {
      this.chart.hideLoading()
      this.chart.clear()
            this.chartContainerTarget.insertAdjacentHTML(
        "beforeend",
        `<p class="mt-2 text-sm text-red-600">Failed to load data</p>`
            )
      console.error(e)
    }

  }
}

