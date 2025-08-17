# app/services/report_service.rb
class ReportService
  def initialize
    @package = Axlsx::Package.new
    @wb = @package.workbook
    @s = @wb.styles

    # header + fills
    @header_style = @s.add_style bg_color: "5a3286", fg_color: "FFFFFF", alignment: { horizontal: :center }
    @weekend_fill = @s.add_style bg_color: "d9d9d9"

    # number formats
    @date_style          = @s.add_style format_code: "dd/mm/yyyy"
    @weekend_date_style  = @s.add_style format_code: "dd/mm/yyyy", bg_color: "d9d9d9"
    @time_style          = @s.add_style format_code: "hh:mm"
    @hms_style           = @s.add_style format_code: "hh:mm:ss"
  end

  def call(format:, rows:, range_from:, range_to:, total_duration_hms:, sum_for_range:)
    @wb.add_worksheet(name: "Report") do |sheet|
      sheet.add_row [ "Zakres", "#{range_from} - #{range_to}" ]
      sheet.add_row [ "Data wygenerowania raportu: ", Time.zone.now.strftime("%d/%m/%Y, %H:%M:%S") ]
      sheet.add_row [ "Data", "Dzień", "Start", "Koniec", "Łącznie godzin", "Łącznie (decymalnie)" ]
      rows.each do |row|
        cells = [
                  row[:date],
                  row[:day],
                  row[:start],
                  row[:finish],
                  row[:duration],
                  row[:duration_decimal]
                ]
        row_styles =
        if row[:is_weekend]
          styles = [ @weekend_date_style, @weekend_fill, @weekend_fill, @weekend_fill, @weekend_fill, @weekend_fill ]
        else
          styles = [ @date_style, nil, nil, nil, nil, nil ]
        end
        sheet.add_row cells, style: row_styles
      end
      sheet.add_row [ "Łącznie", "", "", "", total_duration_hms, sum_for_range ]

      sheet.row_style 2, @header_style
      sheet.row_style -1, @header_style
    end

    @package
  end

  private
    def add_empty_rows (sheet)
      sheet.add_row []
    end
end
