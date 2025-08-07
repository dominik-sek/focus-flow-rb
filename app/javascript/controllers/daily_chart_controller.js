import { Controller } from "@hotwired/stimulus"
import * as echarts from "echarts"
import { formatDuration } from "../helpers/formatDuration";
import dayjs from 'dayjs';

// Connects to data-controller="daily-chart"
export default class extends Controller {
  static targets=["chartContainer"]
  connect() {
    dayjs().format()
    this.weekOffset = 0
    this.chart = echarts.init(this.chartContainerTarget)
    window.addEventListener("time-entry:submitted", this.refresh.bind(this))
    this.getDailyChartData()
  }
  async getDailyChartData() {
    await fetch(`api/time_entry/daily_hours?week_offset=${this.weekOffset}`).then(async (res) => {
      const rawData = await res.json()
      const filledData = this.fillRemainingDays(rawData)

      const days = filledData.map(entry => entry.day)

      const duration = filledData.map(entry => entry.total_duration)
      console.log(filledData)
      this.renderChart(days, duration)
    })

  }

  renderChart(days, duration) {
    console.log(duration)
    const options = {
      tooltip:{
        trigger: 'axis',
        formatter: function(params){
          const duration = params[0].data
          return `${formatDuration(duration)}`
        }
      },
      xAxis: {
        type: 'category',
        data: days
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value) => formatDuration(value)
        }
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
  refresh() {
    this.getDailyChartData()
  }

  previousWeek() {
    console.log('previous')
    this.weekOffset += 1
    this.refresh()
  }

  nextWeek() {
    if (this.weekOffset > 0) {
      this.weekOffset -= 1
      this.refresh()
    }
  }

  fillRemainingDays(data) {
    const dataMap = new Map(data.map(entry => [entry.day, entry.total_duration]))

    const startOfWeek = dayjs().subtract(this.weekOffset, 'week').startOf('week').add(1, 'day') 
    const filled = []

    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day')
      const iso = day.format("YYYY-MM-DD")
      const duration = dataMap.get(iso) || 0
      filled.push({ day: iso, total_duration: duration })
    }

    return filled
  }

  
}



