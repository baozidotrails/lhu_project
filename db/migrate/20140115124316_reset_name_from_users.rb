class ResetNameFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :name
    add_column :users, :name, :string
  end
end
