class TimeEntryController < ApplicationController
  def new
    @time_entry = TimeEntry.new
  end
end
