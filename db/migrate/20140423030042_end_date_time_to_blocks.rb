class EndDateTimeToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :end_date, :date
    add_column :blocks, :end_time, :time
  end
end
