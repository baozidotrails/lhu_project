class RemovePhhFromBlock < ActiveRecord::Migration
  def change
    remove_column :blocks, :photo_file_name
    remove_column :blocks, :photo_content_type
    remove_column :blocks, :photo_file_size
    remove_column :blocks, :photo_updated_at
  end
end
