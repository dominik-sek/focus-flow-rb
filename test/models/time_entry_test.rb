# == Schema Information
#
# Table name: time_entries
#
#  id          :bigint           not null, primary key
#  duration    :integer
#  finished_at :datetime
#  name        :string
#  started_at  :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  project_id  :bigint
#  user_id     :bigint           not null
#
# Indexes
#
#  index_time_entries_on_project_id  (project_id)
#  index_time_entries_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class TimeEntryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
