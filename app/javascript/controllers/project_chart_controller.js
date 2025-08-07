import { Controller } from "@hotwired/stimulus"
import * as echarts from 'echarts';
// Connects to data-controller="project-chart"
export default class extends Controller {
  static targets = ["chartContainer"]
  chart = echarts.init(this.chartContainerTarget)
  option = {}
  connect() {
    this.getProjectHours()
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
          name: 'Access From',
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
  }
  async getProjectHours(){
    await fetch('api/projects/summary').then(async (res)=>{
      const json = await res.json()
      console.log(json)
    })

  }
}
