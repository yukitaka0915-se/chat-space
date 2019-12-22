$(function(){

  function buildHTML(message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.image.url != null) {
      //メッセージに画像が含まれる場合のHTMLを作る
      let html = `<div class="message">
                    <div class="message__upper-info">
                      <p class="message__upper-info__talker">${message.name}</p>
                      <p class="message__upper-info__date">${message.created_at}</p>
                    </div>
                    <p class="message__text">${message.body}
                    <img class="lower-message__image" src="${message.image.url}" alt="${message.imagename}">
                    </p>
                  </div>`
    } else {
      //メッセージに画像が含まれない場合のHTMLを作る
      let html = `<div class="message">
                    <div class="message__upper-info">
                      <p class="message__upper-info__talker">${message.name}</p>
                      <p class="message__upper-info__date">${message.created_at}</p>
                    </div>
                    <p class="message__text">${message.body}</p>
                  </div>`
    }
    return html
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault()
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
      // 生成したhtmlをmessages要素の最後に追加して、
      // 一番下にスクロールする。
      $('.messages').append(html).animate({scrollTop: $('.messages')[0].scrollHeight});
    })
    .fail(function () {
      // 通信失敗時の処理
      alert('ファイルの取得に失敗しました。');
    })
    .always(function () {
      // メッセージテキスト、画像テキストの内容をクリアする。
      $('#new_message')[0].reset();
      // submitボタンを有効化する。
      $('.submit-btn').removeAttr('disabled');
    });
  })
});
