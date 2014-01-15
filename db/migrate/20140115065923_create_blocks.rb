class CreateBlocks < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.string :name
      t.string :left
      t.string :top
      t.string :width
      t.string :height
      t.integer :space_id
      t.boolean :is_leaf, default: true

      t.timestamps
    end
  end
end
