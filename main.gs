const form = FormApp.getActiveForm();
const spreadSheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("sheet_id"));
const reservationApplication = spreadSheet.getSheetByName("予約申請");
const reservationStatus = spreadSheet.getSheetByName("予約状況");
const useableRoomList = [
  "大会議室",
  "講堂",
  "和室",
  "生徒相談室",
  "講義室1",
  "講義室2",
  "講義室3",
  "講義室A",
  "講義室B",
  "ゼミ室",
  "講義室4",
];


// フォーム送信時
function receivedApplication(e) {
  // フォームの送信内容の取得
  const email = (e !== undefined) ? e.response.getRespondentEmail() : FormApp.getActiveForm().getResponses()[0].getRespondentEmail();
  const responses = (e !== undefined) ? e.response.getItemResponses() : FormApp.getActiveForm().getResponses()[0].getItemResponses();
  const group_name = responses[0].getResponse();
  const room = responses[1].getResponse();
  const date = Utilities.formatDate(new Date(responses[2].getResponse()), "Asia/Tokyo", "yyyy-MM-dd");
  const start_time = responses[3].getResponse();
  const end_time = responses[4].getResponse();

  // 予約可能かチェック
  const results = checkAvailability(room, date, start_time, end_time);
  const check = results[0];
  const date_index = results[1];
  const room_index = results[2];

  // 予約可能なら
  if (check){
    // 予約申請シートに予約内容を書き込む
    addReservationApplication(email, group_name, room, date, start_time, end_time);

    // 予約状況シートの更新
    updateReserationStatus(group_name, start_time, end_time, date_index, room_index);
  }

  // メール送信
  // sendEmail(email, group_name, check);
}

function addReservationApplication(email, group_name, room, date, start_time, end_time) {
  const time = date + " "  + start_time + "~" + end_time;
  reservationApplication.appendRow([email, room, group_name, time]);
}

function updateReserationStatus(group_name, start_time, end_time, date_index, room_index) {
  // 更新前のデータ取得
  const pre_value = reservationStatus.getRange(date_index, room_index).getValue();

  // 更新データ作成
  const time = start_time + "~" + end_time;
  const value = (pre_value === "") ? group_name + " " + time : pre_value + "\n" + group_name + " " + time;

  reservationStatus.getRange(date_index, room_index).setValue(value);
}


function checkAvailability(room, date, start_time, end_time) {
  // 予約状況シートからデータを取得
  const list = getDataOfReservationStatus(3, 1);

  // 予約状況と予約申請の整合性チェック
  for (let i = 0; i < list.length; i++) {
    if (Utilities.formatDate(new Date(list[i][0]), "Asia/Tokyo", "yyyy-MM-dd") == date) {
      for (let j = 0; j < useableRoomList.length; j++) {
        if (useableRoomList[j] == room) {
          // 希望する日時が予約されていないならOK
          if (list[i][j + 2] === "") {
            return [true, i + 3, j + 2 + 1];
          } else {
            return [false, null, null];
          }
        }
      }
    }
  }

  // 条件が合わないならNG
  return false; 
}

function getDataOfReservationStatus(start_row, start_col) {
  const last_row = reservationStatus.getLastRow() - start_row + 1;
  const last_col = reservationStatus.getMaxColumns() - start_col + 1;
  
  return reservationStatus.getRange(start_row, start_col, last_row, last_col).getValues();
}


function sendEmail(email, preferredDate, result){

  const mailTitle = "教室使用予約完了について";
  let mailBody;

  if ( result == "OK" ){
    mailBody = "予約が完了しました。\n"
             + `予約日：${preferredDate}`
  } else {
    mailBody = "定員超過のため予約できませんでした。\n"
             + "下記のフォームから再度申請してください\n"
             + form.getPublishedUrl();
  }

  // 結果メール送信
  GmailApp.sendEmail(email, mailTitle, mailBody);

}