function checkReservable(room, date, start_time, end_time) {
  // 予約状況シートからデータを取得
  const reservations_list = getDataOfReservationStatus(3, 1);

  // 予約状況と予約申請の整合性チェック
  for (let i = 0; i < reservations_list.length; i++) {
    if (Utilities.formatDate(new Date(reservations_list[i][0]), "Asia/Tokyo", "yyyy-MM-dd") == date) {
      for (let j = 0; j < ROOM_LIST.length; j++) {
        if (ROOM_LIST[j] === room) {
          // 希望する日時が予約されていないならOK
          if (reservations_list[i][j + 2] === "") {
            return [true, i + 3, j + 2 + 1];
          } else {
            // 予約済みの情報を取得
            const reservations_data = reservations_list[i][j + 2];
            const reservations = reservations_data.split(/\n/);
            for (let i = 0; i < reservations.length; i++) {
              const pre_start_time = reservations[i].slice(-11, -6);
              const pre_end_time = reservations[i].slice(-5);

              if (start_time < pre_end_time && pre_start_time < end_time) {
                return [false, null, null];
              }
            }

            return [true, i + 3, j + 2 + 1];
          }
        }
      }
    }
  }

  // 条件が合わないならNG
  return [false, null, null];
}


function getDataOfReservationStatus(start_row, start_col) {
  const last_row = RESERVATION_STATUS.getLastRow() - start_row + 1;
  const last_col = RESERVATION_STATUS.getMaxColumns() - start_col + 1;
  
  return RESERVATION_STATUS.getRange(start_row, start_col, last_row, last_col).getValues();
}