class ResetIsPassToRegistrations < ActiveRecord::Migration
  def change
    remove_column :registrations, :is_pass
    add_column :registrations, :is_pass, :boolean, default: false
  end
end
