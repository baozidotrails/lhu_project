class CreateBlocks < ActiveRecord::Migration
  def change
    drop_table :blocks
    create_table :blocks do |t|
      t.string :name
      t.string :left
      t.string :top
      t.string :width
      t.string :height
      t.integer :space_id
      t.integer :block_type
      t.integer :parent_id

      t.timestamps
    end
  end
end
