class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
      t.string :keywords
      t.datetime :start_at
      t.datetime :end_at

      t.timestamps
    end
  end
end
