class AddBlockIdToRegistrations < ActiveRecord::Migration
  def change
    add_column :registrations, :block_id, :integer
  end
end
