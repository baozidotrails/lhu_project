class AddDefaultToOrders < ActiveRecord::Migration
  def change
    remove_column :orders, :is_activated
    add_column :orders, :is_activated, :boolean, default: false
  end
end
