function updateReservationApplication(hash, email, group_name, room, time) {
  RESERVATION_APPLICATION.appendRow([hash, email, room, group_name, time]);
}