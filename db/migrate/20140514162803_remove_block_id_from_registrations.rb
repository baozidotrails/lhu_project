class RemoveBlockIdFromRegistrations < ActiveRecord::Migration
  def change
    remove_column :registrations, :block_id
  end
end
