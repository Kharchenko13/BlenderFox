/* ══════════════════════════════════════
   BLENDERFOX — MEDALS LOGIC
   checkMedal, checkAllMedals
══════════════════════════════════════ */

/**
 * Проверяет медаль и выдаёт её если ещё не получена.
 * showToast = false при синхронизации (медаль уже была получена ранее).
 */
function checkMedalById(id, earnedSet, showToast = true) {
  if (!earnedSet.has(id)) {
    earnedSet.add(id);

    // Sync to Supabase
    const u = getUser();
    if (u && typeof sbSaveMedal === 'function') {
      sbSaveMedal(u.id, id).catch(() => {});
    }

    // Toast — только при реальном новом получении, не при загрузке
    if (showToast && typeof showMedalToast === 'function') {
      showMedalToast(id);
    }

    return true;
  }
  return false;
}

function checkAllMedals() {
  const completedTasks = getCompletedTasks();
  const earnedMedals   = getEarnedMedals();
  const done = completedTasks.size;

  if (done >= 1)  checkMedalById('lesson1',   earnedMedals);
  if (done >= 5)  checkMedalById('half',       earnedMedals);
  if (done >= 10) checkMedalById('all',        earnedMedals);

  MODULES.forEach(m => {
    if (m.tasks.every(t => completedTasks.has(t.id))) {
      if (m.id === 'intro')      checkMedalById('module1',   earnedMedals);
      if (m.id === 'materials')  checkMedalById('materials', earnedMedals);
      if (m.id === 'animation')  checkMedalById('animator',  earnedMedals);
      if (m.id === 'render')     checkMedalById('renderer',  earnedMedals);
    }
  });

  const savedWorks = getSavedWorks();
  const allSaved = getAllTasks().every(t => (savedWorks[t.id] || []).length > 0);
  if (allSaved) checkMedalById('detail', earnedMedals);

  saveEarnedMedals(earnedMedals);
}
