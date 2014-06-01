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

  attr_accessor :crop_x, :crop_y, :crop_w, :crop_h, :remove_surface
  after_update :crop_surface

  def crop_surface
    surface.recreate_versions! if crop_x.present?
  end

end
