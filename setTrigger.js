function setTrigger() {
  // 通知時刻
  const time = new Date();
  time.setHours(4);
  time.setMinutes(0);
  
  ScriptApp.newTrigger('updateDailyCalenderSheet').timeBased().at(time).create();
}

function delTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  
  for(const trigger of triggers){
    if(trigger.getHandlerFunction() === "updateDailyCalenderSheet") ScriptApp.deleteTrigger(trigger);
  }
}
