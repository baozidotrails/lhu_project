class Block < ActiveRecord::Base

  has_one :registration, dependent: :destroy
  has_many :orders, dependent: :destroy

  belongs_to :space

  mount_uploader :image, ImageUploader

end


