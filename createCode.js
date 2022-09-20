function createCode(length) {
  const source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code_data = RESERVATION_APPLICATION.getRange(2, 1, RESERVATION_APPLICATION.getLastRow()).getValues();

  let code = "";
  for (let i = 0; i < length; i++) {
    code += source[Math.floor(Math.random() * source.length)]
  }

  while (code_data.flat().includes(code)) {
    for (let i = 0; i < length; i++) {
      code += source[Math.floor(Math.random() * source.length)]
    }
  }

  return code;
}