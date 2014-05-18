class Block < ActiveRecord::Base

  has_one :registration
  belongs_to :space

  mount_uploader :image, ImageUploader

end


