class ChangeColumnFromBlock < ActiveRecord::Migration
  def change
    remove_column :blocks, :is_floor
    add_column :blocks, :is_floor, :integer, default: 0
  end
end
