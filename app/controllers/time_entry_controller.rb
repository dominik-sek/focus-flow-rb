class TimeEntryController < ApplicationController
  def index
  end

  def show
  end

  def create
    @time_entry = TimeEntry.create(time_entry_params)
    flash[:notice] = "Time entry created successfully"
    render json: @time_entry, status: :created
  end

  def destroy
  end

  private
  def time_entry_params
    params.require(:time_entry).permit(:name, :started_at, :finished_at, :duration)
  end
end
