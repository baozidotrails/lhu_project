class AddCategoryIdToSpaces < ActiveRecord::Migration
  def change
    add_column :spaces, :category_id, :integer
  end
end
