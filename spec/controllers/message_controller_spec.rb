require 'rails_helper'

describe MessagesController do
  let(:group) { create(:group) }
  let(:user) { create(:user) }

  describe '#index' do
    # ログインしている場合
    context 'log in' do
      before do
        login user
        get :index, params: { group_id: group.id }
      end
      # アクション内で定義しているインスタンス変数を確認する(@message)
      it 'assigns @message' do
        # Messageクラスのインスタンスかつ未保存かどうかをチェック
        expect(assigns(:message)).to be_a_new(Message)
      end

      # アクション内で定義しているインスタンス変数を確認する(@group)
      it 'assigns @group' do
        # assigns(:group)とgroupが同じかをチェック
        expect(assigns(:group)).to eq group
      end

      # 該当するビューが描画されているかどうかをテスト
      it 'renders index' do
        # index画面が描画されてるかをテスト
        expect(response).to render_template :index
      end

    end

    # ログインしていない場合
    context 'not log in' do
      before do
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        # ログイン画面が描画されているかをテスト
        expect(response).to redirect_to(new_user_session_path)
      end

    end
  end
  
  
end
