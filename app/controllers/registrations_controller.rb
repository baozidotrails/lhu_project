class RegistrationsController < ApplicationController



  def create

  end

  def update

  end

  def destroy
    @registration = Registration.find(params[:id])
    @registration.destroy
    redirect_to :back
  end


  private

    def registration_params
      params.require(:registration).permit(:is_pass, :user_id, :block_id, :space_id)
    end

end
