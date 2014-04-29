class LeaseResetToBlocks < ActiveRecord::Migration
  def change
    remove_column :blocks, :lease_time
    add_column :blocks, :lease_date, :date
    add_column :blocks, :lease_time, :time
  end
end
