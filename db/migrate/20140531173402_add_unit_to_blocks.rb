class AddUnitToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :unit_id, :integer
  end
end
