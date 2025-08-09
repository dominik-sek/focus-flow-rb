import { Controller } from "@hotwired/stimulus"
import * as echarts from 'echarts';
import { formatDuration } from "../helpers/formatDuration";

// Connects to data-controller="project-chart"
export default class extends Controller {
  static targets = ["chartContainer"]
  chart = echarts.init(this.chartContainerTarget)
  option = {}

  refresh() {
    this.getProjectHours()
  }

  connect() {
    window.addEventListener("time-entry:submitted", this.refresh.bind(this))
    this.option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Loading',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 26,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
        }
      ]
    };
    this.chart.setOption(this.option)
    this.refresh()
  }



  async getProjectHours() {

    await fetch('api/projects/summary').then(async (res) => {
      const json = await res.json()
      this.option.series[0].data = json.map((item) => ({
        value: item.duration,
        name: item.name
      }))
      this.option.series[0].name = "Project Hours"
      this.option.legend.data = json.map((item) => item.name)
      this.option.tooltip.formatter = (params) => {
        return `${params.name}: ${formatDuration(params.value)} hours`
      }

      this.chart.setOption(this.option)
    })

  }
}
