function createHash(length) {
  const source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const hash_data = reservationApplication.getRange(2, 1, reservationApplication.getLastRow()).getValues();

  let hash = '';
  for (let i = 0; i < length; i++) {
    hash += source[Math.floor(Math.random() * source.length)]
  }

  while (hash_data.flat().includes(hash)) {
    for (let i = 0; i < length; i++) {
      hash += source[Math.floor(Math.random() * source.length)]
    }
  }

  return hash;
}