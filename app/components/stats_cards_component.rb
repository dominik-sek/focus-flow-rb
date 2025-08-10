# frozen_string_literal: true

class StatsCardsComponent < ViewComponent::Base
  def initialize(titles:)
    @titles = titles
  end
end
