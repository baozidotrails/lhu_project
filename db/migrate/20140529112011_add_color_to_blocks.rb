class AddColorToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :color, :string, default: '#efefef'
  end
end
