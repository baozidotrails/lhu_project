class AddIspostedToSpaces < ActiveRecord::Migration
  def change
    add_column :spaces, :isposted, :boolean, default: false
    add_column :spaces, :isrented, :boolean, default: false
  end
end
