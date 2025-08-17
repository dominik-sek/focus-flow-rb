  class TimeEntryRowMapper
    def self.call(entries)
      entries.map do |e|
        {
          date: e[:date],
          day: I18n.l(e[:date].to_date, format: "%A", locale: :pl),
          start: e[:day_start].strftime("%H:%M"),
          finish: e[:day_end].strftime("%H:%M"),
          duration: seconds_to_hms(e[:total_duration]),
          duration_decimal: duration_to_decimal(e[:total_duration]),
          is_weekend: check_if_weekend(e[:date])
        }
      end
    end

    def self.seconds_to_hms(seconds)
      Time.at(seconds).utc.strftime "%H:%M:%S"
    end

    def self.duration_to_decimal(seconds)
      (seconds/3600.0).round(2)
    end

    def self.date_tz_to_ymd(date)
      date.to_date.strftime("%d/%m/%Y")
    end

    def self.check_if_weekend(date)
      if date.saturday? || date.sunday?
        return true
      end
      false
    end
  end
