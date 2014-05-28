class PagesController < ApplicationController

  def home
    @blocks = Block.all
  end

  def about

  end

  def contact

  end

  def decision
    render layout: false
  end

  def sandbox

  end

end
