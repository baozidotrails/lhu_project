class AddEndAtStartAtToBlocks < ActiveRecord::Migration
  def change
    remove_column :blocks, :lease_date
    remove_column :blocks, :end_date
    remove_column :blocks, :lease_time
    remove_column :blocks, :end_time
    remove_column :spaces, :isposted
    remove_column :spaces, :isrented
    remove_column :spaces, :city_id
    remove_column :spaces, :county_id

    add_column :blocks, :start_at, :datetime
    add_column :blocks, :end_at,   :datetime
    add_column :spaces, :is_public,:boolean, default: false
    add_column :spaces, :is_ava,   :boolean, default: false
  end
end
