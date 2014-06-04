class UsersController < ApplicationController

  before_action :set_user,      only: [:show, :edit, :update]
  before_action :loged_in_user, only: [:edit, :update]
  before_action :correct_user,  only: [:edit, :update]

  def show

  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      flash.now[:notice] = "#{@user.name}，歡迎您的加入！"
      redirect_to root_path
    else
      flash.now[:notice] = '星號欄位為必填，請再次檢查。'
      render 'new'
    end
  end

  def edit

  end

  def update
    if @user.update(user_params)
      redirect_to @user
    else
      render 'edit'
    end
  end

  def destroy

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :nickname, :intro, :website, :avatar)
    end

    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end
end
