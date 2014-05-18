class AddAvatarToUsers < ActiveRecord::Migration
  def change
    remove_column :users, :image
    remove_column :spaces, :image
    add_column :users, :avatar, :string
    add_column :spaces, :space_view, :string
  end
end
