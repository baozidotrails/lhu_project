class AddIntroToSpaces < ActiveRecord::Migration
  def change
    add_column :spaces, :intro, :string
  end
end
