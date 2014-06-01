class BlocksController < ApplicationController

  before_action :set_block, only: [:show, :edit, :update, :destroy, :rent]
  before_action :loged_in_user, only: [:rent]


  # GET /blocks
  # GET /blocks.json
  def index

    @blocks = Block.order(:name)

    @blocks = @blocks.where("name like ?", "%#{params[:search]}%") if params[:search].present?

    @blocks = @blocks.where("start_at >= ?", params[:start_at]) if params[:start_at].present?

    @blocks = @blocks.where("end_at <= ?", params[:end_at]) if params[:end_at].present?

  end

  # GET /blocks/1
  # GET /blocks/1.json
  def show

    @blocks = Block.where(parent_id: params[:id]).order('name DESC')


    render layout: false

  end

  # GET /blocks/new
  def new
    @block = Block.new
  end

  # GET /blocks/1/edit
  def edit
    @blocks = Block.where(parent_id: params[:id]).order('name DESC')



    render layout: false
  end

  # POST /blocks
  # POST /blocks.json
  def create
    @block = Block.new(block_params)

    respond_to do |format|
      if @block.save
        format.html { render @block, notice: "#{@block.id}" }
        format.json { render action: 'show', status: :created, location: @block }
      else
        format.html { render action: 'new' }
        format.json { render json: @block.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /blocks/1
  # PATCH/PUT /blocks/1.json
  def update
     respond_to do |format|
      if @block.update(block_params)
        format.html { redirect_to :back, notice: '場地資料成功設定。' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @block.errors, status: :unprocessable_entity }
      end
    end
  end


  # DELETE /blocks/1
  # DELETE /blocks/1.json
  def destroy

    # delete associate block
    Block.where(parent_id: params[:id]).each do |block|
      Block.where(parent_id: block.id).destroy_all
      block.destroy
    end

    # delete the main block
    @block.destroy

    redirect_to :back
  end

  def blockinfo
    @block = Block.find(params[:id])
    render layout: false
  end

  def blockview
    @blocks = Block.where(parent_id: params[:id]).order('name DESC')
    @block = Block.find(params[:id])
    render layout: false
  end

  def block_preview
    @blocks = Block.where(parent_id: params[:id]).order('name DESC')
    @block = Block.find(params[:id])
    render layout: false
  end

  def rent

    the_child = @block

    until the_child.space_id?
      parent_block = Block.find(the_child.parent_id)
      the_child = parent_block
    end

    the_reg = @block.create_registration(user: current_user, space: the_child.space)
    Order.create!(space: the_reg.space, block: the_reg.block, user: the_reg.space.user, registration: the_reg)
    @block.update(is_available: false)
    redirect_to account_rents_path
  end

  private


    # Use callbacks to share common setup or constraints between actions.
    def set_block
      @block = Block.find(params[:id])


    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def block_params
      params.require(:block).permit(:name, :left, :top, :width, :height, :space_id, :block_type, :parent_id, :is_floor, :max_head_cap, :footage, :equipment, :fee, :photo, :start_at, :end_at, :image, :intro, :user_id, :registration_id, :color, :unit_id)
    end
end
