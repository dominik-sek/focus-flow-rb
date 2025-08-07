import { Controller } from "@hotwired/stimulus"
import * as echarts from "echarts"
import { formatDuration } from "../helpers/formatDuration";

// Connects to data-controller="daily-chart"
export default class extends Controller {
  connect() {
    this.chart = echarts.init(this.element)
    window.addEventListener("time-entry:submitted", this.refresh.bind(this))
    this.getDailyChartData()
  }
  async getDailyChartData() {
    await fetch('api/time_entry/daily_hours').then(async (res) => {
      const data = await res.json()
      const days = data.map(entry => entry['day'])
      const duration = data.map(entry => formatDuration(entry['total_duration']))
      console.log(data)
      this.renderChart(days, duration)
    })

  }

  renderChart(days, duration) {
    const options = {
      xAxis: {
        type: 'category',
        data: days
      },
      yAxis: {
        type: 'value',
      },

      series: [
        {
          data: duration,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    }

    this.chart.setOption(options)
  }
refresh(){
  this.getDailyChartData()
  
}
}



