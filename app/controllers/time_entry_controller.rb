class TimeEntryController < ApplicationController
  before_action :authenticate_user!

  def stats
    range = params[:range]
    from_range = params[:date_from]
    to_range = params[:date_to]
    puts(params.inspect())
    from, to = parse_range(range, from_range, to_range)
    entries = TimeEntry
        .where(user_id: session[:current_user_id])
        .where(started_at: from..to)
        .select(:id, :name, :duration, :started_at, :project_id)

    render json: {
      range: { from: from, to: to },
      total_duration: entries.sum(:duration),
      billable: entries.sum(:duration),
      average_per_day: entries.sum(:duration),
      entries: entries
    }
  end


  # def daily_hours
  #   week_offset = params[:week_offset].to_i || 0
  #   start_date = Date.today.beginning_of_week - week_offset.weeks
  #   end_date = start_date.end_of_week


  #   daily_hours_entries = TimeEntry
  #   .where(user_id: session[:current_user_id])
  #   .where(started_at: start_date.beginning_of_day..end_date.end_of_day)
  #   .group("DATE(started_at)")
  #   .sum(:duration)
  #   .map { |day, duration| { day: day, total_duration: duration.to_i } }

  #   render json: daily_hours_entries
  # end

  # def this_month_entries
  #   current_month_range = Time.current.beginning_of_month..Time.current.end_of_month
  #   time_entries = TimeEntry.where(user_id: session[:current_user_id]).where(started_at: current_month_range).includes(:project).order(started_at: :desc)

  #   if params[:limit].present?
  #     limit = params[:limit].to_i
  #     time_entries = time_entries.limit(limit)
  #   end
  #   render json: time_entries, include: :project
  # end


  def create
    attrs = time_entry_params
    attrs[:name] = "No task name" if attrs[:name].blank?
    attrs[:user_id] = session[:current_user_id]
    attrs[:project_id].to_i

    @time_entry = TimeEntry.create(attrs)
    if @time_entry.save
      render json: @time_entry, status: :created
    else
      render json: { errors: @time_entry.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
  end

  private
  def time_entry_params
    params.require(:time_entry).permit(:name, :started_at, :finished_at, :duration, :project_id)
  end

  def parse_range(range, date_from, date_to)
    case range
    when "today"
      [ Time.zone.today.beginning_of_day, Time.zone.today.end_of_day ]
    when "this_week"
      [ Time.zone.today.beginning_of_week, Time.zone.today.end_of_week ]
    when "this_month"
      [ Time.zone.today.beginning_of_month, Time.zone.today.end_of_month ]
    when "custom"
      [ Time.zone.parse(date_from), Time.zone.parse(date_to) ] # add possibility of not selecting end date
    else
      [ Time.zone.today.beginning_of_day, Time.zone.today.end_of_day ]
    end
  end
end
