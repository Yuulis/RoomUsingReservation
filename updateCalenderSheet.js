function updateCalenderSheet(group_name, start_time, end_time, date_index, room_index) {
  // 更新前のデータ取得
  const pre_value =　RESERVATION_STATUS.getRange(date_index, room_index).getValue();

  // 更新データ作成
  const time_str = start_time + "~" + end_time;
  const value = (pre_value === "") ? group_name + " " + time_str : pre_value + "\n" + group_name + " " + time_str;

  RESERVATION_STATUS.getRange(date_index, room_index).setValue(value);
}