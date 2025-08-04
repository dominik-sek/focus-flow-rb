class UsersController < ApplicationController
  before_action :redirect_if_authenticated, only: [ :create, :new ]
  # before_action :authenticate_user!, only: [ :edit, :destroy, :update ]

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to root_path, notice: "Success!"
    end
  end

  private
  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
