class AddIsAvailableToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :is_available, :boolean
  end
end
