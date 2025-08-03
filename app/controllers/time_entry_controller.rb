class TimeEntryController < ApplicationController
  def index
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
