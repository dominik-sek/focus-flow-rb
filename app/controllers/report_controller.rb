class ReportController < ApplicationController
  def index
  end

  def generate
  end

  private

  def generate_report_params
    params.require().permit()
  end
end
