class SpacesController < ApplicationController


  before_action :set_space,     only: [:show, :edit, :update, :spaceinfo, :preview, :remove, :place, :detailize]
  before_action :loged_in_user, except: [:index, :preview]
  before_action :correct_user,  except: [:index, :preview, :new, :create]
  before_action :is_public_to_see, only: [:preview]


  def index
    @search = Space.search do
      fulltext params[:search]
      without(:is_public, false)
      with(:updated_at).greater_than_or_equal_to(params[:start_at].to_time) if params[:start_at].present?
      with(:updated_at).less_than_or_equal_to(params[:end_at].to_time) if params[:end_at].present?
      order_by(:updated_at, :desc)
    end

    @spaces = @search.results
  end

  def new
    @space = current_user.spaces.new
  end

  def edit
    @blocks = current_user.spaces.find(params[:id]).blocks
  end

  def detailize
    @blocks = current_user.spaces.find(params[:id]).blocks
  end

  def show
    @blocks = current_user.spaces.find(params[:id]).blocks
  end

  def create
    @space = current_user.spaces.new(space_params)

    if @space.save
      if params[:space][:surface].present?
        render :crop
      else
        redirect_to edit_space_path(@space)
      end
    else
      render 'new'
    end
  end

  def update
    if @space.update(space_params)
      if params[:space][:surface].present?
        render :crop
      else
        redirect_to edit_space_path
      end

    else
      flash.now[:notice] = "沒填的田一田"
      render 'spaceinfo'
    end
  end

  def destroy


    @space = current_user.spaces.find(params[:id])

    # find all sons
    @space.blocks.each do |block|
      Block.where(parent_id: block.id).each do |father|
        Block.where(parent_id: father.id).destroy_all
        father.destroy
      end
    end

    @space.destroy
    redirect_to :back
  end

  def spaceinfo

  end

  def preview
    @user = Space.find(params[:id]).user
    @blocks = @user.spaces.find(params[:id]).blocks
  end

  def place
    if @space.update(is_public: true)
      flash[:"#{@space.id}"] = "成功刊登場地「#{@space.name}」"
      redirect_to account_spaces_path
    end
  end

  def remove
    if @space.update(is_public: false)
      redirect_to :back
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_space
      @space = Space.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def space_params
      params.require(:space).permit(:name, :address, :city_id, :county_id, :user_id, :intro, :category_id, :is_public, :is_ava, :space_view, :surface, :height, :crop_x, :crop_y, :crop_w, :crop_h, :phone)
    end

    def correct_user
      unless Space.find(params[:id]).user == current_user
        redirect_to root_url
      end
    end

    def is_public_to_see
      @space = Space.find(params[:id])
      unless @space.is_public
        unless @space.user == current_user
          redirect_back_or root_path
        end
      end
    end

end
