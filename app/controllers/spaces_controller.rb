class SpacesController < ApplicationController

  before_action :authenticate_user!

  def new
    @blocks = Block.all
  end

  def edit
  end

  def show
  end

  def create
  end

  def update
  end

  def destroy
  end
end
