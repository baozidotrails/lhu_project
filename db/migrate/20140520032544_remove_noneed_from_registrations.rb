class RemoveNoneedFromRegistrations < ActiveRecord::Migration
  def change
    remove_column :registrations, :name
    remove_column :registrations, :email
  end
end
