class RegistrationSetting < ActiveRecord::Migration
  def change
    remove_column :blocks, :registration_id
    add_column :registrations, :space_id, :integer
    add_column :registrations, :block_id, :integer
  end
end
