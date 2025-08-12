class TimeEntryController < ApplicationController
  before_action :authenticate_user!

  def stats
    @stats = TimeEntryService.call(user: session[:current_user_id], date_from: params[:date_from], date_to: params[:date_to])

    render json: {
      range: @stats[:range],
      total_duration: @stats[:total_duration],
      entries: @stats[:entries]
    }, include: :project
  end

  def create
    @time_entry = TimeEntryService.new_time_entry(time_entry_params)
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
end
