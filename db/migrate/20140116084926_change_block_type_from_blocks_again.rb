class ChangeBlockTypeFromBlocksAgain < ActiveRecord::Migration
  def change
    remove_column :blocks, :block_cd
    add_column :blocks, :block_type_cd, :integer, default: 0
  end
end
