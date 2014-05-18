class RegistrationsController < ApplicationController



  def new

  end

  def create
    @registration = Registration.new(registration_params)

    if @registration.save
      redirect_to current_user
    end

  end

  def destroy

  end

  private



    def registration_params
      params.require(:registration).permit(:name, :email, :is_pass, :user_id, :block_id)
    end

end
