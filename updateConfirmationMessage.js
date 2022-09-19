function updateConfirmationMessage(check, hash, group_name, room, time) {
  let message = "";
  if (check) {
    message = `予約が完了しました。\n予約コードは以下の通りです。予約変更の際に必要となりますので、この画面をスクリーンショットしておくことをお勧めします。\n \n【予約コード】\n${hash}\n\n【予約内容】\n使用団体 : ${group_name}\n使用教室 : ${room}\n使用日時 : ${time}\n`;
  } else {
    message = `予約を受け付けできませんでした。\n条件を変えて再度予約してください。\n`;
  }

  FORM.setConfirmationMessage(message);
}