class AddAttrToBlock < ActiveRecord::Migration
  def change
    add_column :blocks, :max_head_cap, :integer
    add_column :blocks, :footage, :integer
    add_column :blocks, :equipment, :string
    add_column :blocks, :fee, :integer
    add_column :blocks, :photo_id, :integer
  end
end
