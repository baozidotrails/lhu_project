class Block < ActiveRecord::Base

  has_one :registration, dependent: :destroy
  has_many :orders, dependent: :destroy

  belongs_to :space

  mount_uploader :image, ImageUploader

  searchable do
    text :name
    text :intro
    time :start_at
    time :end_at
    integer :fee
    boolean :is_floor
  end

end


