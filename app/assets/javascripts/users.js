$(function(){

  // チャットメンバーリストの親要素を取得
  const member_list = $('#chat-group-users');
  
  // チャットメンバー追加時のhtml生成処理
  function appendMember(user_name, user_id){
    let html = `<div class='chat-group-user clearfix'>
                  <input name='group[user_ids][]' type='hidden' value='${user_id}'>
                  <p class='chat-group-user__name'>${user_name}</p>
                  <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn' data-user-id="${user_id}" data-user-name="${user_name}">削除</div>
                </div>`
    member_list.append(html)
  }

  //ユーザーリストの親要素を取得
  const user_list = $('#user-search-result');

  //ユーザーリストの追加用HTMLの生成
  function appendUser(user_name, user_id) {
    let html = `<div class='chat-group-user clearfix'>
                  <p class='chat-group-user__name'>${user_name}</p>
                  <div class='user-search-add chat-group-user__btn chat-group-user__btn--add' data-user-id='${user_id}' data-user-name='${user_name}'>追加</div>
                </div>`
    user_list.append(html);
  }
  
  //ユーザーが見つからなかった時の追加用HTMLの生成
  function appendErrMsgToHTML(msg) {
    let html = `<div class='chat-group-user clearfix'>
                  <p class='chat-group-user__name'>${msg}</p>
                </div>`
    user_list.append(html);
  }

  // チャットメンバー検索テキストでのキー入力イベント処理
  $('#user-search-field').on('keyup', function() {
    let input = $('#user-search-field').val();
    const act = $('.edit_group').attr('action');
    const group_id = act.slice(-1);
    $.ajax({
      url: '/users',
      type: 'GET',
      data: { keyword: input, group_id: group_id },
      dataType: 'json'
    })
    .done(function(users) {
      user_list.empty();
      if (users.length !== 0) {
        users.forEach(function(user) {
          appendUser(user.name, user.id);
        });
      } else if (input.length == 0) {
        return false;
      } else {
        appendErrMsgToHTML("一致するユーザーが見つかりません。");
      }
    })
    .fail(function() {
      alert("通信エラーです。ユーザーが表示できません。");
    });
  });

  // チャットメンバー候補の追加ボタンclick処理
  $(document).on('click', '.chat-group-user__btn--add', function() {
    //追加ボタンが押された要素のデータを取得
    const user_name = $(this).attr('data-user-name');
    const user_id = $(this).attr('data-user-id');
    //追加ボタンが押された親要素を削除
    $(this)
      .parent()
      .remove();
    //追加ボタンが押された要素をチャットメンバーに追加
    appendMember(user_name, user_id);
  });
  
  // チャットメンバー一覧の削除ボタンclick処理
  $(document).on('click', '.chat-group-user__btn--remove', function() {
    // //削除ボタンが押された要素のデータを取得
    const user_name = $(this).attr('data-user-name');
    const user_id = $(this).attr('data-user-id');
    //削除ボタンが押された親要素を削除
    $(this)
      .parent()
      .remove();
    //削除ボタンが押された要素をユーザーリストに追加
    appendUser(user_name, user_id);
  });
});