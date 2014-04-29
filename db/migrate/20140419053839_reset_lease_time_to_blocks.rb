class ResetLeaseTimeToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :lease_time, :datetime
    remove_column :blocks, :lease_begin_at
    remove_column :blocks, :lease_end_at
  end
end
