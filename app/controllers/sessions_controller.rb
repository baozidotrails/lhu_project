class SessionsController < ApplicationController
  def new

  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      flash[:notice] = "歡迎您，#{current_user.name}。"
      redirect_back_or user
    else
      flash[:danger] = 'E-mail 或密碼不正確，無法登入。'
      render 'new'
    end
  end

  def destroy
    flash[:notice] = "#{current_user.name}，歡迎下次再度光臨。"
    log_out
    redirect_to root_url
  end
end
