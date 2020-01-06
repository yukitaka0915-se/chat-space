$(function(){

  //追加・削除ボタンが押された時のリスト削除処理
  function RemoveList(element) {
    //ボタンが押された親要素を削除
    $(element)
      .parent()
      .remove();
  }
  //追加・削除ボタンが押された時のユーザー名取得
  let user_name = function(elemnt) {
    return elemnt.attr('data-user-name');
  }
  //追加・削除ボタンが押された時のユーザーid取得
  let user_id = function(elemnt) {
    return elemnt.attr('data-user-id');
  }

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
    // 新規か編集かを判定
    const newact = $('.new_group').attr('action');
    const editact = $('.edit_group').attr('action');
    let group_id = null;
    if (newact === undefined) {
      // グループ編集画面ならgroup_idを取得
      group_id = editact.slice(-1);
    }
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
    //チャットメンバーデータの取得と親要素の削除
    RemoveList($(this));
    //追加ボタンが押された要素をチャットメンバーに追加
    appendMember(user_name($(this)), user_id($(this)));
  });
  
  // チャットメンバー一覧の削除ボタンclick処理
  $(document).on('click', '.chat-group-user__btn--remove', function() {
    //追加ユーザーデータの取得と親要素の削除
    RemoveList($(this));
    //削除ボタンが押された要素をユーザーリストに追加
    appendUser(user_name($(this)), user_id($(this)));
  });
  
});