  class TimeEntryRowMapper
    def self.call(entries)
      entries.map do |e|
        {
          date: e[:date],
          day: e[:date].strftime("%A"),
          start: e[:day_start].strftime("%H:%M"),
          finish: e[:day_end].strftime("%H:%M"),
          duration: seconds_to_hms(e[:total_duration]),
          duration_decimal: duration_to_decimal(e[:total_duration])
        }
      end
    end



    def self.seconds_to_hms(seconds)
      # this only adds up to 24hrs:
      Time.at(seconds).utc.strftime "%H:%M:%S"
    end

    def self.duration_to_decimal(seconds)
      (seconds/3600.0).round(2)
    end
  end
