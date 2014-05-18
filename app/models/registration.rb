class Registration < ActiveRecord::Base

  belongs_to :space
  belongs_to :block
  belongs_to :user

end
