class AddAttachmentPhotoToBlocks < ActiveRecord::Migration
  def self.up
    change_table :blocks do |t|
      t.attachment :photo
    end
  end

  def self.down
    drop_attached_file :blocks, :photo
  end
end
