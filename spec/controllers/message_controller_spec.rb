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

  describe '#create' do
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }

    # ログインしている場合
    context 'log in' do
      before do
        login user
      end

      # 保存に成功した場合
      context 'can save' do
        subject {
          post :create,
          params: params
        }

        # メッセージが保存されたかどうか
        it 'count up message' do
          # Messageモデルのレコードの総数が1個増えたかどうか
          expect{ subject }.to change(Message, :count).by(1)
        end
        
        # 意図した画面に遷移しているかどうか
        it 'redirects to group_messages_path' do
          subject
          expect(response).to redirect_to(group_messages_path(group))
        end
      end

      # 保存に失敗した場合
      context 'can not save' do
        # メッセージの保存に失敗する場合を再現するための定義(attributes_for(:message, body: nil, image: nil))
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, body: nil, image: nil) } }

        subject {
          post :create,
          params: invalid_params
        }

        # メッセージの保存が失敗したかどうか
        it 'does not count up' do
          expect{ subject }.not_to change(Message, :count)
        end

        # 意図した画面に遷移しているかどうか
        it 'renders index' do
          subject
          expect(response).to render_template :index
        end
      end
    end

    # ログインしていない場合
    context 'not log in' do
      
      # 意図した画面に遷移しているかどうか
      it 'redirects to new_user_session_path' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
      end

    end

  end

end