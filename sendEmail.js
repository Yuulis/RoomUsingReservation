function sendEmail(id, email, changeReservation_flag, code, group_name, room, dateTime_str) {
  // デフォルト引数の設定
  if (changeReservation_flag === undefined) {
    changeReservation_flag = null;
  }
  if (code === undefined) {
    code = null;
  }
  if (group_name === undefined) {
    group_name = null;
  } 
  if (room === undefined) {
    room = null;
  }
  if (dateTime_str === undefined) {
    dateTime_str = null;
  }

  // メールの構築
  const subject = "教室使用の予約結果について";

  let body = "";

  // エラー検出時
  if (id == 0) {
    body += "予約を受け付けできませんでした。\nお手数ですが、条件を変えて再度予約してください。\n\n";
    body += "【エラーコード】\n";
    body += `${ErrorCode} : `;

    const errorCode_data = ERRORCODES.getRange(2, 1, ERRORCODES.getLastRow(), 2).getValues();
    for (let i = 0; i < errorCode_data.length; i++) {
      if (errorCode_data[i][0] == ErrorCode) {
        body += errorCode_data[i][1];
      }
    }
  }
  else if (id == 1) {
    body += (changeReservation_flag) ? "以下の内容に予約内容を変更しました。\n" : "以下の内容で予約が完了しました。\n";
    body += "予約コードは予約の変更時に必要なので、メモをしておくことをお勧めします。\n\n";
    body += "【予約内容】\n";
    body += `使用団体 : ${group_name}\n`;
    body += `使用教室 : ${room}\n`;
    body += `使用時間 : ${dateTime_str}\n\n`;
    body += "【予約コード】\n";
    body += `${code}`;
  }

  const fromAddress = PropertiesService.getScriptProperties().getProperty("fromAddress")
  const options = {
    from : fromAddress
  };

  let draft = GmailApp.createDraft(email, subject, body, options);
  let draftID = draft.getId();

  GmailApp.getDraft(draftID).send();
}