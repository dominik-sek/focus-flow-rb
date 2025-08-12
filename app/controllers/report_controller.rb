class ReportController < ApplicationController
    before_action :authenticate_user!

  def index
  end

  def generate_report
    puts "SELECTED FILTER: #{params}"
    # report_data = TimeEntryService.new.call(filter: selected_filter)
    pkg = ReportService.new.call(format: :xlsx, data: report_data)

    send_data pkg.to_stream.read,
              filename: "report.xlsx",
              disposition: "attachment",
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  end

  private
end
