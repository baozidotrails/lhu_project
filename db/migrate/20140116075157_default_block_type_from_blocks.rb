class DefaultBlockTypeFromBlocks < ActiveRecord::Migration
  def change
    remove_column :blocks, :block_type
    add_column :blocks, :block_type, :integer, default: 1
  end
end
