class ReportController < ApplicationController
    before_action :authenticate_user!

  def index
  end

  def generate
  end

  private

  def generate_report_params
    params.require().permit()
  end
end
