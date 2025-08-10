# frozen_string_literal: true

class FiltersComponent < ViewComponent::Base
  def initialize(filters:, active_filter:)
    @filters = filters
    @active_filter = active_filter
  end
  def active?(filter)
    filter == @active_filter
  end
end
