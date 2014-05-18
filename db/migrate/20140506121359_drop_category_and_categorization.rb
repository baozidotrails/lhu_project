class DropCategoryAndCategorization < ActiveRecord::Migration
  def change
    drop_table :categories
    drop_table :categorizations
  end
end
