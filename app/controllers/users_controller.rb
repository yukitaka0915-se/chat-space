class UsersController < ApplicationController

  def index
    return nil if params[:keyword] == ""
    if params[:group_id] == ""
      # カレントグループのメンバー以外のユーザーを検索する
      @users = User.has_without_currentuser("#{params[:keyword]}", current_user.id).limit(10)
    else
      # カレントグループのメンバー以外のユーザーを検索する
      @users = User.has_without_current_groupuser("#{params[:keyword]}", "#{params[:group_id]}").limit(10)
    end
    respond_to do |format|
      format.html
      format.json
    end
  end

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end

end
