class AccountController < ApplicationController

  before_action :loged_in_user

  def spaces
    @spaces = current_user.spaces
  end

  def rents
    @registrations = current_user.registrations
  end
end
