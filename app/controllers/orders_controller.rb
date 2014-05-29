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

  def activate
    @order = Order.find(params[:id])
    @order.update(is_activated: true)
    @order.registration.update(is_pass: true)
    redirect_to :back
  end

  private

    def orders_params
      params.require(:order).permit(:space_id, :block_id, :user_id, :registration_id, :is_activated)
    end

end
