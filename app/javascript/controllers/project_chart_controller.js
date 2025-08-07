import { Controller } from "@hotwired/stimulus"
import * as echarts from 'echarts';
// Connects to data-controller="project-chart"
export default class extends Controller {
    static targets = ["chartContainer"]

  connect() {
  }
}
