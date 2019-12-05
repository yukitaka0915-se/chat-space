class MessagesController < ApplicationController
  mount_uploader :image, ImageUploader
  
  def index
  end

  def create

  end

  private

  def message_params
  end

end
