# app/services/report_service.rb
class ReportService
  def initialize
    @package = Axlsx::Package.new
    @wb = @package.workbook
  end

  def call(format:)
    @wb.add_worksheet(name: "Report") do |sheet|
      (1..7).each do
        sheet.add_row (1..8).to_a
      end



      sheet.merge_cells("A1:H1")
      sheet.merge_cells("A1:A7")
    end

    @package  # return the package to the caller
  end
end
