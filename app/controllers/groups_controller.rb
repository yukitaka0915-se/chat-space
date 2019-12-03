class GroupsController < ApplicationController

  def new
  end

  def create
    if current_user.create(group_params)
      redirect_to root_path
    else
      render :new
    end
  end

  def edit
  end

  def update
    if current_user.update(group_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def group_params
    params.require(:group).permit(:name).merge(user_id: current_user.id, group_id: params[:group_id])
  end

end
