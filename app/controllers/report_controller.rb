class ReportController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_range!

  def index
    @range = params[:range]
  end

  def generate_report
    stats = TimeEntryService.call(user: session[:current_user_id], date_from: params[:date_from], date_to: params[:date_to], group_by: :day)
    rows = TimeEntryRowMapper.call(stats[:grouped_by_day])


    pkg = ReportService.new.call(format: :xlsx, rows: rows)

    send_data pkg.to_stream.read,
              filename: "report.xlsx",
              disposition: "attachment",
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  end

  def ensure_range!
    has_any =
      params[:date_from].present? ||
      params[:date_to].present?

    return if has_any

    qp = request.query_parameters.symbolize_keys
    redirect_to reports_path(qp.except(:filter).merge(date_from: Date.today.beginning_of_day, date_to: Date.today.end_of_day))
  end
end
