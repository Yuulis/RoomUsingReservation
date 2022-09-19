const days = ["日", "月", "火", "水", "木", "金", "土"];


// 前日分までのデータを削除して、1年後までの日付を入力
function updateCalenderSheet() {
  let count = 0;
  let today = new Date(new Date().setHours(0, 0, 0, 0));
  while (true) {
    let pre_date = new Date(reservationStatus.getRange(count + 3, 1).getValue());
    if (pre_date.getTime() >= today.getTime()) {
      break;
    }

    count++;
  }

  // すでに更新済みならストップ
  if (count == 0) {
    return;
  }

  // データ削除
  reservationStatus.deleteRows(3, count);

  // データ追加
  let date = new Date(reservationStatus.getRange(reservationStatus.getLastRow(), 1).getValue());
  for (let i = 0; i < count; i++) {
    reservationStatus.insertRowAfter(reservationStatus.getLastRow());
    date.setDate(date.getDate() + 1);
    reservationStatus.appendRow([Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd"), days[date.getDay()]]);
  }
}


// カレンダーを初期化
// =====このコード実行後は、それまでの入力データがすべて消えるので注意 =====
function initializeCalenderSheet() {
  let date = new Date();
  reservationStatus.appendRow([Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd"), days[date.getDay()]]);

  // データ削除
  reservationStatus.deleteRows(4, reservationStatus.getLastRow() - 3);

  // 新規にカレンダー作成
  for (let i = 0; i < 365; i++) {
    reservationStatus.insertRowAfter(reservationStatus.getLastRow());
    date.setDate(date.getDate() + 1);
    reservationStatus.appendRow([Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd"), days[date.getDay()]]);
  }
}