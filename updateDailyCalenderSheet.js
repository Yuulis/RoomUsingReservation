const days = ["日", "月", "火", "水", "木", "金", "土"];


// 前日分までのデータを削除して、1年後までの日付を入力
function updateCalenderSheet() {
  // トリガーの削除
  delTrigger();

  let count = 0;
  let today = new Date(new Date().setHours(0, 0, 0, 0));
  while (true) {
    let pre_date = new Date(RESERVATION_STATUS.getRange(count + 3, 1).getValue());
    if (pre_date.getTime() >= today.getTime()) {
      break;
    }

    count++;
  }

  // すでに更新済みならストップ
  if (count == 0) {
    return;
  }

  // 履歴に追加
  for (let i = 0; i < count; i++) {
    RESERVATION_RECORD.insertRowBefore(3);
    const values = RESERVATION_STATUS.getRange(3, 1, 3, RESERVATION_STATUS.getLastColumn()).getValues();
    RESERVATION_RECORD.getRange(3, 3, 3, RESERVATION_RECORD.getLastColumn()).setValues(values);
  }

  // データ削除
  RESERVATION_STATUS.deleteRows(3, count);

  // データ追加
  let date = new Date(RESERVATION_STATUS.getRange(RESERVATION_STATUS.getLastRow(), 1).getValue());
  for (let i = 0; i < count; i++) {
    RESERVATION_STATUS.insertRowAfter(RESERVATION_STATUS.getLastRow());
    date.setDate(date.getDate() + 1);
    RESERVATION_STATUS.appendRow([Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd"), days[date.getDay()]]);
  }
}


// カレンダーを初期化
// =====このコード実行後は、それまでの入力データがすべて消えるので注意 =====
function initializeCalenderSheet() {
  let date = new Date();
  RESERVATION_STATUS.appendRow([Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd"), days[date.getDay()]]);

  // データ削除
  RESERVATION_STATUS.deleteRows(4, RESERVATION_STATUS.getLastRow() - 3);

  // 新規にカレンダー作成
  for (let i = 0; i < 365; i++) {
    RESERVATION_STATUS.insertRowAfter(RESERVATION_STATUS.getLastRow());
    date.setDate(date.getDate() + 1);
    RESERVATION_STATUS.appendRow([Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd"), days[date.getDay()]]);
  }
}