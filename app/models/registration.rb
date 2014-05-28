class Registration < ActiveRecord::Base

  has_many :orders, dependent: :destroy

  belongs_to :space
  belongs_to :block
  belongs_to :user

end
