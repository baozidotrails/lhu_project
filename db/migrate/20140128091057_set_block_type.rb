class SetBlockType < ActiveRecord::Migration
  def change
    remove_column :blocks, :block_type_cd
    add_column :blocks, :type, :integer, default: 0
  end
end
