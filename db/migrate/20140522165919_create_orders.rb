class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.integer :space_id
      t.integer :block_id
      t.integer :user_id
      t.integer :registration_id
      t.boolean :is_activated

      t.timestamps
    end
  end
end
