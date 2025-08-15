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
    this.chart.showLoading('default', {
      text: 'Loading...',
      textColor:'#ffffff',
      maskColor:'transparent'
    })
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
          orient: 'vertical',
          top:'3%',
          left:'0',
          height:'50px',
          data: legend
        },
        labelLine: {
          show: false
        },
        series: [
          {
            name: "Project hours",
            type: 'pie',
            radius: ['40%', '70%'],
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
      this.chartContainerTarget.innerHTML = `<p class="text-center">Data couldn't be loaded</p>`
      console.error(e)
    }

  }
}

