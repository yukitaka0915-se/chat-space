class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :group_users
  has_many :groups, through: :group_users
  has_many :messages

  # カレントユーザー以外を検索する。
  scope :has_without_currentuser, -> (keyword, user_id){
    where(['name LIKE ?', "%#{keyword}%"]).where.not(id: user_id)
  }

  # チャットメンバー以外のユーザーを検索する。
  scope :has_without_current_groupuser, -> (keyword, group_id){
    joins(
      "LEFT OUTER JOIN group_users ON group_id = #{group_id} and user_id = users.id"
    ).where(['name LIKE ?', "%#{keyword}%"]).where(group_users: { user_id: nil })
   }

end
