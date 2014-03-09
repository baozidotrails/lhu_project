class IssssBlock < ActiveRecord::Migration
  def change
    remove_column :blocks, :is_floor
    add_column :blocks, :is_floor, :boolean, default: false
  end
end
