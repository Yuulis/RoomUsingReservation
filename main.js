const ROOM_LIST = [
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
const SPREAD_SHEET = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("sheet_id"));
const RESERVATION_APPLICATION = SPREAD_SHEET.getSheetByName("予約申請");
const RESERVATION_STATUS = SPREAD_SHEET.getSheetByName("予約状況");


// フォーム送信時
function receivedApplication(e) {
  // フォームの送信内容の取得
  const email = (e !== undefined) ? e.response.getRespondentEmail() : FormApp.getActiveForm().getResponses()[0].getRespondentEmail();
  const responses = (e !== undefined) ? e.response.getItemResponses() : FormApp.getActiveForm().getResponses()[0].getItemResponses();
  // const email = e.response.getRespondentEmail();
  // const responses = e.response.getItemResponses();

  let rebook = 0;
  let pre_code = "";
  if (responses.length == 6) {
    rebook = 1;
    pre_code = responses[0].getResponse();
  }
  const group_name = responses[0 + rebook].getResponse();
  const room = responses[1 + rebook].getResponse();
  const date = Utilities.formatDate(new Date(responses[2 + rebook].getResponse()), "Asia/Tokyo", "yyyy-MM-dd");
  const start_time = responses[3 + rebook].getResponse();
  const end_time = responses[4 + rebook].getResponse();
  const dateTime_str = date + " "  + start_time + "~" + end_time;

  // 予約可能かチェック
  const results = checkReservable(room, date, start_time, end_time);
  const check = results[0];
  const date_index = results[1];
  const room_index = results[2];

  // 予約コード作成
  const code = createCode(4);

  // 予約可能なら
  if (check){
    // 予約申請シートに予約内容を書き込む
    addReservationApplication(code, email, group_name, room, dateTime_str);

    // 予約状況シートの更新
    updateReservationStatus(group_name, start_time, end_time, date_index, room_index);
  }

  sendEmail(email, check, code, group_name, room, dateTime_str);
}


function addReservationApplication(hash, email, group_name, room, time) {
  RESERVATION_APPLICATION.appendRow([hash, email, room, group_name, time]);
}


function updateReservationStatus(group_name, start_time, end_time, date_index, room_index) {
  // 更新前のデータ取得
  const pre_value =　RESERVATION_STATUS.getRange(date_index, room_index).getValue();

  // 更新データ作成
  const time_str = start_time + "~" + end_time;
  const value = (pre_value === "") ? group_name + " " + time_str : pre_value + "\n" + group_name + " " + time_str;

  RESERVATION_STATUS.getRange(date_index, room_index).setValue(value);
}