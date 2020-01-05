$(function(){
  
  // ajaxでdoneの場合の共通終了処理。
  let resetmessageform = function (input, insertHTML, resetarea) {
    //メッセージが入ったHTMLに入れ物ごと追加して、一番下にスクロールする。
    $(input).append(insertHTML).animate({scrollTop: $(input)[0].scrollHeight});
    // メッセージテキスト、画像テキストの内容をクリアする。
    $(resetarea)[0].reset();
  };

  // ajaxで無効化されたsendボタンを有効化する。
  let sendButtonActivate = function (button) {
    $(button).removeAttr('disabled');
  };

  // 投稿メッセージhtml
  let bodyHTML = function(message) {
    let html = `<p class="message__lower-info__text">${message.body}</p>`
    return html;
  };

  // 画像ファイルhtml
  let imageHTML = function(message) {
    let html = `<img src="${message.image}" class="lower-message__image" alt="${message.imagename}">`
    return html;
  };

  // Message親要素
  let parentMessageHTML = function(buildhtml) {
    let html = `<div class="message">${buildhtml}</div>`
    return html;
  };

  // Message子要素
  let childMessageHTML = function(buildhtml, message) {
    //data-idが反映されるようにしている
    let html = `<div class="message" data-message-id=${message.id}>${buildhtml}</div>`
    return html;
  };

  // Message孫要素
  let mainMassageHTML = function(buildhtml) {
    let html = `<div class="message__lower-info">${buildhtml}</div>`
    return html;
  };
  
  // 投稿メッセージのhtmlを生成する
  let buildHTML = function(message) {
    // upper-infoの生成
    let upperhtml = `<div class="message__upper-info">`
                  + ` <p class="message__upper-info__talker">${message.user_name}</p>`
                  + ` <p class="message__upper-info__date">${message.created_at}</p>`
                  + `</div>`

    // lower-infoの生成
    let lowerhtml = ''
    if (message.body && message.image) {
      //メッセージと画像が両方あるhtml
      lowerhtml = bodyHTML(message) + imageHTML(message);
    } else if (message.body) {
      //メッセージのみのhtml
      lowerhtml = bodyHTML(message);
    } else if (message.image) {
      //画像のみのhtml
      lowerhtml = imageHTML(message);
    };
    lowerhtml = mainMassageHTML(lowerhtml);

    // メッセージ子要素htmlの生成
    let childhtml = childMessageHTML(upperhtml + lowerhtml, message);
    // メッセージ親要素htmlの生成
    let html = parentMessageHTML(childhtml);
    return html;
  };

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    let formData = new FormData(this);
    let url = $(this).attr('action');
    $.ajax({
      url: url,       //同期通信でいう『パス』
      type: 'POST',   //同期通信でいう『HTTPメソッド』
      data: formData, //取得したFormData  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      // 通信成功時の処理
      // 投稿されたメッセージをjsonからhtmlに生成する。
      let html = buildHTML(message);
      // 生成したhtmlをmessages要素の最後に追加して、一番下にスクロールする。
      // メッセージテキスト、画像テキストの内容をクリアする。
      resetmessageform('.messages', html, '#new_message');
    })
    .fail(function () {
      // 通信失敗時の処理
      alert('ファイルの取得に失敗しました。');
    })
    .always(function () {
      // submitボタンを有効化する。
      sendButtonActivate('.submit-btn');
    });
  })

  // 最新のメッセージidを送信する
  let reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        // 生成したhtmlをmessages要素の最後に追加して、一番下にスクロールする。
        // メッセージテキスト、画像テキストの内容をクリアする。
        resetmessageform('.messages', insertHTML, '#new_message');
      }
    })
    .fail(function() {
      console.log('error');
    })  
    .always(function () {
      // submitボタンを有効化する。
      sendButtonActivate('.submit-btn');
    });
  };

  // チャット投稿画面のみ再描画させる
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    // 7秒ごとに再描画
    setInterval(reloadMessages, 7000);
  }

});
