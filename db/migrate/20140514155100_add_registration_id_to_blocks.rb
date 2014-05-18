class AddRegistrationIdToBlocks < ActiveRecord::Migration
  def change
    remove_column :blocks, :user_id
    add_column :blocks, :registration_id, :integer
  end
end
