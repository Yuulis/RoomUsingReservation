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
const CALENDER_SHEET = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("calender_sheet_id"));
const APPLICATION_SHEET = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("application_sheet_id"));
const RECORD_SHEET = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("record_sheet_id"));
const ERRORCODE_SHEET = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("errorCode_sheet_id"));
const RESERVATION_STATUS = CALENDER_SHEET.getSheetByName("予約状況");
const RESERVATION_APPLICATION = APPLICATION_SHEET.getSheetByName("予約申請");
const RESERVATION_RECORD = RECORD_SHEET.getSheetByName("履歴");
const ERRORCODES = ERRORCODE_SHEET.getSheetByName("エラーコード");

let ErrorCode = "";


// フォーム送信時
function receivedApplication(e) {
  // フォームの送信内容の取得
  const email = (e !== undefined) ? e.response.getRespondentEmail() : FormApp.getActiveForm().getResponses()[0].getRespondentEmail();
  const responses = (e !== undefined) ? e.response.getItemResponses() : FormApp.getActiveForm().getResponses()[0].getItemResponses();
  // const email = e.response.getRespondentEmail();
  // const responses = e.response.getItemResponses();

  let changeReservation = 0;
  let pre_code = "";
  if (responses.length == 6) {
    changeReservation = 1;
    pre_code = responses[0].getResponse();
  }
  const group_name = responses[0 + changeReservation].getResponse();
  const room = responses[1 + changeReservation].getResponse();
  const date = Utilities.formatDate(new Date(responses[2 + changeReservation].getResponse()), "Asia/Tokyo", "yyyy-MM-dd");
  const start_time = responses[3 + changeReservation].getResponse();
  const end_time = responses[4 + changeReservation].getResponse();
  const dateTime_str = date + " "  + start_time + "~" + end_time;

  // 予約可能かチェック
  const results = checkReservable(room, date, start_time, end_time);

  // EA200-001 ~ EA202-001
  if (ErrorCode !== "") {
    sendEmail(0, email);
    return;
  }

  const check = results[0];
  const date_index = results[1];
  const room_index = results[2];

  let changeReservation_flag = false;
  if (pre_code !== "") {
    // 予約コードのチェック
    checkCode(pre_code);

    // EA100-001
    if (ErrorCode !== "") {
      sendEmail(0, email);
      return;
    }

    changeReservation_flag = true;
  }

  // 予約コード作成
  const code = createCode(4);

  // 予約可能なら
  if (check){
    // 予約申請シートに予約内容を書き込む
    updateReservationApplication(code, email, group_name, room, dateTime_str);

    // 予約状況シートの更新
    updateCalenderSheet(group_name, start_time, end_time, date_index, room_index);
  }

  sendEmail(1, email, changeReservation_flag, code, group_name, room, dateTime_str);
}