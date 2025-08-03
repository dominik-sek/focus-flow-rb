class CreateTimeEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :time_entries do |t|
      t.string :name
      t.timestamp :started_at
      t.timestamp :finished_at
      t.integer :duration

      t.timestamps
    end
  end
end
