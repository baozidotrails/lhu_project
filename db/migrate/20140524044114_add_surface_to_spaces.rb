class AddSurfaceToSpaces < ActiveRecord::Migration
  def change
    add_column :spaces, :surface, :string
  end
end
