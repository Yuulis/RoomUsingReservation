function sendEmail(email, check, rebook_flag, hash, group_name, room, dateTime_str) {
  const recipient = email;
  const subject = "教室使用の予約結果について";

  let body = "";
  if (check) {
    body += (rebook_flag) ? "以下の内容に予約内容を変更しました。\n" : "以下の内容で予約が完了しました。\n";
    body += "予約コードは予約の変更時に必要なので、メモをしておくことをお勧めします。\n\n";
    body += "【予約内容】\n";
    body += `使用団体 : ${group_name}\n`;
    body += `使用教室 : ${room}\n`;
    body += `使用団体 : ${dateTime_str}\n\n`;
    body += "【予約コード】\n";
    body += `${hash}`;
  } else {
    body += "予約を受け付けできませんでした。\nお手数ですが、条件を変えて再度予約してください。\n";
  }

  const fromAddress = PropertiesService.getScriptProperties().getProperty("fromAddress")
  const options = {
    from : fromAddress
  };

  let draft = GmailApp.createDraft(email, subject, body, options);
  let draftID = draft.getId();

  GmailApp.getDraft(draftID).send();
}