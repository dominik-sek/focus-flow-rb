class AddUserProjectToTimeEntries < ActiveRecord::Migration[8.0]
  def change
    add_reference :time_entries, :user, null: false, foreign_key: true
    add_reference :time_entries, :project, null: true, foreign_key: true
  end
end
