class AddImageToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :image, :string
  end
end
