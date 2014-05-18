class AddContactAndPhoneToSpaces < ActiveRecord::Migration
  def change
    remove_column :spaces, :is_ava
    add_column :spaces, :contact, :string
    add_column :spaces, :phone, :string
  end
end
