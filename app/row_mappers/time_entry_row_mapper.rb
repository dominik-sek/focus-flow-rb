  class TimeEntryRowMapper
    def self.call(entries)
      entries.map do |e|
        {
          date: e[:date],
          day: e[:date].strftime("%A"),
          start: e[:date],
          finish: e[:date],
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
