class RemovePhotoIdFromBlock < ActiveRecord::Migration
  def change
    remove_column :blocks, :photo_id
  end
end
