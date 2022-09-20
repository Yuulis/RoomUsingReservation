function sendEmail(email, check, hash, group_name, room, dateTime_str) {
  const mailTitle = "教室使用の予約結果について";

  let mailBody = "";
  if (check) {
    mailBody += "以下の内容で予約が完了しました。\n";
    mailBody += "予約コードは予約の変更時に必要なので、メモをしておくことをお勧めします。\n\n";
    mailBody += "【予約内容】\n";
    mailBody += `使用団体 : ${group_name}\n`;
    mailBody += `使用教室 : ${room}\n`;
    mailBody += `使用団体 : ${dateTime_str}\n\n`;
    mailBody += "【予約コード】\n";
    mailBody += `${hash}`;
  } else {
    mailBody += "予約を受け付けできませんでした。\nお手数ですが、条件を変えて再度予約してください。\n";
  }

  let draft = GmailApp.createDraft(email, mailTitle, mailBody);
  let draftID = draft.getId();

  GmailApp.getDraft(draftID).send();
}