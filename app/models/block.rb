class Block < ActiveRecord::Base


  # enum
  # as_enum :block_type, top_leaf: 0, f_container: 1, b_container: 2, bottom_leaf: 3

  belongs_to :space


end
