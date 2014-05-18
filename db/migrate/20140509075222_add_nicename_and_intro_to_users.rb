class AddNicenameAndIntroToUsers < ActiveRecord::Migration
  def change
    add_column :users, :nickname, :string
    add_column :users, :intro, :string
  end
end
