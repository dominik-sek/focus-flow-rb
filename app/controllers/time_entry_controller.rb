class TimeEntryController < ApplicationController
  def index
  end

  def current_month
    current_month_range = Time.current.beginning_of_month..Time.current.end_of_month
    time_entries = TimeEntry.where(started_at: current_month_range).order(started_at: :desc)

    if params[:limit].present?
      limit = params[:limit].to_i
      time_entries = time_entries.limit(limit)
    end
    render json: time_entries
  end



  def show
  end

  def create
    attrs = time_entry_params
    attrs[:name] = "No task name" if attrs[:name].blank?
    @time_entry = TimeEntry.create(attrs)
    render json: @time_entry, status: :created
  end

  def destroy
  end

  private
  def time_entry_params
    params.require(:time_entry).permit(:name, :started_at, :finished_at, :duration)
  end
end
