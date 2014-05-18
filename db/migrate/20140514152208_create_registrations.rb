class CreateRegistrations < ActiveRecord::Migration
  def change
    create_table :registrations do |t|
      t.string :name
      t.string :email
      t.boolean :is_pass
      t.integer :user_id

      t.timestamps
    end
  end
end
