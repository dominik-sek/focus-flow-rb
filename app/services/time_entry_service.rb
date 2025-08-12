class TimeEntryService
  def self.call(user:, date_from: nil, date_to: nil, group_by: nil)
    from, to = date_from, date_to
    entries = TimeEntry
        .where(user_id: user)
        .where(started_at: from..to)
        .select(:id, :name, :duration, :started_at, :finished_at, :project_id)
        .order(started_at: :desc)

    result = {
      range: { from: from, to: to },
      total_duration: entries.sum(:duration),
      entries: entries
    }

    if group_by == :day
      grouped_rows = TimeEntry
              .where(user_id: user, started_at: from..to)
              .group(Arel.sql("DATE(started_at)"))
              .order(Arel.sql("DATE(started_at)"))
              .pluck(Arel.sql("DATE(started_at)"), Arel.sql("SUM(duration)"))

      result[:grouped_by_day] = grouped_rows.map { |date, total| { date: date, total_duration: total } }
    end

    result
  end

  def self.new_time_entry(attrs)
    attrs[:name] = "No task name" if attrs[:name].blank?
    attrs[:user_id] = session[:current_user_id]
    attrs[:project_id].to_i

    @time_entry = TimeEntry.create(attrs)
  end
end
