function checkCode(pre_code) {
  const reservation_application_data = RESERVATION_APPLICATION.getRange(2, 1, RESERVATION_APPLICATION.getLastRow(), RESERVATION_APPLICATION.getLastColumn()).getValues();

  let pre_code_data = [];
  for (let i = 0; i < reservation_application_data.length; i++) {
    pre_code_data.push(reservation_application_data[i][0]);
  }

  let data_index = pre_code_data.indexOf(pre_code);

  // 予約コードが発行されているか
  if (data_index != -1) {
    const room = reservation_application_data[data_index][2];
    const date = reservation_application_data[data_index][4].slice(0, 10);
    deletePreviousReservation(room, date, data_index);
  } else {
    ErrorCode = "EA100-001";
  }
}


function deletePreviousReservation(room, date, data_index) {
  // 予約申請データから削除
  RESERVATION_APPLICATION.deleteRow(data_index + 2);

  // 予約カレンダーから削除
  const reservation_status_data = RESERVATION_STATUS.getRange(3, 1, RESERVATION_STATUS.getLastRow(), RESERVATION_STATUS.getLastColumn()).getValues();
  let date_data = [];
  for (let i = 0; i < reservation_status_data.length; i++) {
    date_data.push(Utilities.formatDate(new Date(reservation_status_data[i][0]), "Asia/Tokyo", "yyyy-MM-dd"));
  }
  let date_index = date_data.indexOf(date);
  let room_index = ROOM_LIST.indexOf(room);
  RESERVATION_STATUS.getRange(date_index + 3, room_index + 3).setValue("");
}