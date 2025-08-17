class ReportController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_range!

  def index
    @range = params[:range]
  end

  def generate_report
    stats = TimeEntryService.call(user: session[:current_user_id], date_from: params[:date_from], date_to: params[:date_to], group_by: :day)
    rows = TimeEntryRowMapper.call(stats[:grouped_by_day])
    parsed_date_from = TimeEntryRowMapper.date_tz_to_ymd(stats[:range][:from])
    parsed_date_to = TimeEntryRowMapper.date_tz_to_ymd(stats[:range][:to])
    sum_for_range_decimal = TimeEntryRowMapper.duration_to_decimal(stats[:total_duration])
    total_duration_hms = TimeEntryRowMapper.seconds_to_hms(stats[:total_duration])
    report_month = I18n.l(parsed_date_from.to_date, format: "%B-%Y", locale: :pl)

    pkg = ReportService.new.call(format: :xlsx, rows: rows, range_from: parsed_date_from, range_to: parsed_date_to, total_duration_hms: total_duration_hms, sum_for_range: sum_for_range_decimal)

    send_data pkg.to_stream.read,
              filename: "godziny-pracy-imie-nazwisko-#{report_month}.xlsx",
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
