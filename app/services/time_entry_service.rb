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
      agg_rows = TimeEntry
        .where(user_id: user, started_at: from..to)
        .select(
          "DATE(started_at) AS day",
          "SUM(duration) AS total_duration",
          "MIN(started_at) AS day_start",
          "MAX(finished_at) AS day_end"
        ).group("DATE(started_at)")
        .order("day")
      entries_by_day = entries.group_by { |e| e.started_at.to_date }

      result[:grouped_by_day] = agg_rows.map do |row|
  day = row.read_attribute("day") # Date
  {
    date: day,
    total_duration: row.read_attribute("total_duration"),
    day_start: row.read_attribute("day_start"),   # earliest started_at that day
    day_end: row.read_attribute("day_end"),       # latest finished_at that day
    entries: entries_by_day[day] || []            # raw records with HH:MM preserved
  }
end
    end

    result
  end

  def self.new_time_entry(attrs:, user:)
    attrs[:name] = "No task name" if attrs[:name].blank?
    attrs[:user_id] = user
    attrs[:project_id].to_i

    @time_entry = TimeEntry.create(attrs)
  end
end
