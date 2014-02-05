class KillReserveWordFromBlock < ActiveRecord::Migration
  def change
    remove_column :blocks, :type
    add_column :blocks, :block_type, :integer, default: 0
  end
end
