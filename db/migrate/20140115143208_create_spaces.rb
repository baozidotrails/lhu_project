class CreateSpaces < ActiveRecord::Migration
  def change
    create_table :spaces do |t|
      t.string :name
      t.string :address
      t.integer :city_id
      t.integer :county_id
      t.integer :user_id

      t.timestamps
    end
  end
end
