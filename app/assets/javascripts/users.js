$(function(){
  //ユーザーリストの親要素を取得
  let user_list = $('#user-search-result');

  //ユーザーリストの追加用HTMLの生成
  function appendUser(user_name, user_id) {
    let html = `
                <div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user_name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user_id}" data-user-name="${user_name}">追加</div>
                </div>
                `
    user_list.append(html);
  }
  
  //ユーザーが見つからなかった時の追加用HTMLの生成
  function appendErrMsgToHTML(msg) {
    let html = `
               <div class="chat-group-user clearfix">
                <p class="chat-group-user__name">ユーザーが見つかりません</p>
               </div>`
    user_list.append(html);
  }

  // チャットメンバー検索テキストでのキー入力イベント処理
  $('#user-search-field').on("keyup", function() {
    let input = $("#user-search-field").val();
    $.ajax({
      type: "GET",
      url: "/users",
      data: { keyword: input },
      dataType: "json"
    })
    .done(function(users) {
      user_list.empty();
      if (users.length !== 0) {
        users.forEach(function(user){
          appendUser(user.name, user.id);
        });
      }
      else {
        appendErrMsgToHTML("一致するユーザーが見つかりません。");
      }
    })
    .fail(function() {
      alert("ユーザー検索に失敗しました");
    })
  });
  
  function  appendMember(user_name, user_id){
    var html = `
            <div class='chat-group-user'>
              <input name='group[user_ids][]' type='hidden' value='${user_id}'>
              <p class='chat-group-user__name'>${user_name}</p>
              <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
            </div>
            `
    $('#chat-group-users').append(html)
  }

  // チャットメンバー候補の追加ボタンclick処理
  $('#user-search-result').on("click", '.chat-group-user__btn--add', function() {
    //追加ボタンが押された要素のデータを取得
    let user_id = $(this).attr('data-user-id');
    let user_name = $(this).attr('data-user-name');
    //追加ボタンが押された親要素を削除
    $(this).parent()[0].remove();
    //追加ボタンが押された要素をチャットメンバーに追加
    appendMember(user_name, user_id);
  })
  
  // // チャットメンバー一覧の削除ボタンclick処理
  // $('#chat-group-users').on("click", '.js-remove-btn', function() {
  //   //追加ボタンが押された要素のデータを取得
  //   console.log($(this).attr('[name="group[user_ids][]"]').val());
  //   // let user_id = $(this).children().attr('[name="group[user_ids][]"]').val();
  //   // let user_name = $('.chat-group-user__name').val();
  //   // console.log(user_id);
  //   // console.log(user_name);
  //   //追加ボタンが押された親要素を削除
  //   // $(this).parent()[0].remove();
  //   //追加ボタンが押された要素をチャットメンバーに追加
  //   // appendUser(user_name, user_id);
  // })

});