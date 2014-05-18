class AddIntroToBlocks < ActiveRecord::Migration
  def change
    add_column :blocks, :intro, :string
  end
end
