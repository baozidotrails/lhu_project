class SpacesController < ApplicationController

  before_action :authenticate_user!
  before_action :set_space, only: [:show, :edit, :update]


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
      redirect_to edit_space_path(@space)
    end
  end

  def update
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
    redirect_to new_space_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_space
      @space = Space.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def space_params
      params.require(:space).permit(:name, :address, :city_id, :county_id, :user_id)
    end

end
