class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :group_users
  has_many :groups, through: :group_users
  has_many :messages

  scope :has_without_currentuser, -> (keyword, user_id, max){
    where(['name LIKE ?', "%#{keyword}%"]).where.not(id: user_id).limit(max)
    # joins(:group_users).merge(GroupUser.where.not(id: @group.id))
  }

  scope :has_without_current_groupuser, -> (keyword, ignoer_user, max){
    where(['name LIKE ?', "%#{keyword}%"]).where.not(id: [ignoer_user]).limit(max)
  }

end
