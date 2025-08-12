  class TimeEntryRowMapper
    def self.call(entries)
      entries.map do |e|
        {
          date: e[:date],
          day: e[:date].strftime("%A"),
          start: e[:day_start].strftime("%H:%M"),
          finish: e[:day_end].strftime("%H:%M"),
          duration: duration_to_hours(e[:total_duration]),
          duration_decimal: e[:total_duration]
        }
      end
    end



    def self.duration_to_hours(seconds)
      hours, mins = (seconds/60).to_i.divmod(60)
      "#{hours}:#{mins}"
    end

    def self.duration_to_decimal
    end
  end
