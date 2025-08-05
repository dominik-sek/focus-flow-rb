class TimeEntryController < ApplicationController
  def index
  end

  def current_month
    current_month_range = Time.current.beginning_of_month..Time.current.end_of_month
    time_entries = TimeEntry.where(user_id: session[:current_user_id]).where(started_at: current_month_range).includes(:project).order(started_at: :desc)

    if params[:limit].present?
      limit = params[:limit].to_i
      time_entries = time_entries.limit(limit)
    end
    render json: time_entries, include: :project
  end



  def show
  end

  def create
    attrs = time_entry_params
    attrs[:name] = "No task name" if attrs[:name].blank?
    attrs[:user_id] = session[:current_user_id]

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
    params.require(:time_entry).permit(:name, :started_at, :finished_at, :duration)
  end
end
