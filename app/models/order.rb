class Order < ActiveRecord::Base

  belongs_to :space
  belongs_to :block
  belongs_to :user
  belongs_to :registration

end
