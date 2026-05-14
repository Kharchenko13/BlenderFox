/* ══════════════════════════════════════
   BLENDERFOX — DB: tasks (local data)
   Задания хранятся в data.js как константы.
   Этот файл — хелперы для работы с ними.
══════════════════════════════════════ */

function getStats() {
  const completedTasks = getCompletedTasks();
  const earnedMedals   = getEarnedMedals();
  const total    = MODULES.reduce((s, m) => s + m.tasks.length, 0);
  const done     = completedTasks.size;
  const modsDone = MODULES.filter(m => m.tasks.every(t => completedTasks.has(t.id))).length;
  const meds     = earnedMedals.size;
  return { done, total, modsDone, meds };
}
