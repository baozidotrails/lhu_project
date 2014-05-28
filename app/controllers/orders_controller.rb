class OrdersController < ApplicationController

  def create
    @order = Order.new(orders_params)
    if @order.save

    end
  end

  def update
  end

  def destroy
  end

  def pass

  end

  private

    def orders_params
      params.require(:order).permit(:space_id, :block_id, :user_id, :registration_id, :is_activated)
    end

end
