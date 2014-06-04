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

  searchable do
    text :name, :address, :intro, :phone

    text :blocks do
      blocks.map(&:name)
    end

    text :user do
      user.name
    end

    integer :category_id, :references => Category

    time :created_at
    time :updated_at
    boolean :is_public
  end

end
