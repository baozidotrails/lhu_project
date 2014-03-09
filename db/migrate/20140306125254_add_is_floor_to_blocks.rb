class AddIsFloorToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :is_floor, :boolean, default: false
  end
end
