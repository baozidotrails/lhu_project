class PagesController < ApplicationController
  def home
    @blocks = Block.all
  end
end
