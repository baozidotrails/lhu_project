class AddDatetimeToBlock < ActiveRecord::Migration
  def change
    add_column :blocks, :lease_begin_at, :datetime
    add_column :blocks, :lease_end_at, :datetime
  end
end
