class Space < ActiveRecord::Base

  validates :name, presence: true
  validates :address, presence: true

  has_many :blocks, dependent: :destroy
  has_many :registrations, dependent: :destroy
  has_many :orders, dependent: :destroy

  belongs_to :user
  belongs_to :category

  mount_uploader :space_view, SpaceViewUploader
  mount_uploader :surface, SurfaceUploader

end
