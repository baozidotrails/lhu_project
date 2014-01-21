class ChangeBlockTypeFromBlocks < ActiveRecord::Migration
  def change
    remove_column :blocks, :block_type
    add_column :blocks, :block_cd, :integer, default: 0
  end
end
