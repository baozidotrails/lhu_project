class ChangeLeaseTimeTypeFromBlock < ActiveRecord::Migration
  def change
    remove_column :blocks, :lease_time
    remove_column :blocks, :end_time
    add_column :blocks, :lease_time, :string
    add_column :blocks, :end_time, :string
  end
end
