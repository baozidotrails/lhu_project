class AddHeightToSpaces < ActiveRecord::Migration
  def change
    add_column :spaces, :height, :string, default: '72vh'
  end
end
