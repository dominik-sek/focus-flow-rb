# app/services/report_service.rb
class ReportService
  def initialize
    @package = Axlsx::Package.new
    @wb = @package.workbook
  end

  def call(format:, rows:)
    @wb.add_worksheet(name: "Report") do |sheet|
      sheet.add_row [ "Data", "Dzień", "Start", "Koniec", "Łącznie godzin", "Łącznie (decymalnie)" ]
      rows.each do |row|
        sheet.add_row [ row[:date], row[:day], row[:start], row[:finish], row[:duration], row[:duration_decimal] ]
      end
    end

    @package
  end
end
