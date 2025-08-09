class ReportController < ApplicationController
  def index
    @reports = Report.all
    @time_entries = TimeEntry.all
    @projects = Project.all

    # Fetching the current month time entries for the chart
    @current_month_time_entries = TimeEntry.where(created_at: Time.current.beginning_of_month..Time.current.end_of_month)

    # Grouping by project and summing up the hours
    @project_hours = @current_month_time_entries.group(:project_id).sum(:hours)

    # Preparing data for the chart
    @chart_data = @project_hours.map do |project_id, hours|
      project = Project.find(project_id)
      { name: project.name, hours: hours }
    end
  end
end
