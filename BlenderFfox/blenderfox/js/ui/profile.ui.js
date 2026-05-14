/* ══════════════════════════════════════
   BLENDERFOX — UI: PROFILE
══════════════════════════════════════ */

function renderProfile() {
  const u     = getUser();
  const stats = getStats();
  if (!u) return;

  document.getElementById('p-avatar-letter').textContent = u.avatar || u.name[0].toUpperCase();
  document.getElementById('p-name').textContent  = u.name;
  document.getElementById('p-email').textContent = u.email;
  document.getElementById('p-level').textContent = `Студент · Уровень ${u.level || 1}`;

  document.getElementById('pstat-done').textContent    = stats.done;
  document.getElementById('pstat-modules').textContent = stats.modsDone;
  document.getElementById('pstat-medals').textContent  = stats.meds;
  document.getElementById('profile-medals-sub').textContent = `${stats.meds} медалей получено`;
  document.getElementById('profile-medals-new').textContent = stats.meds;
  document.getElementById('progress-sub').textContent  = `${stats.done} из ${stats.total} заданий выполнено`;
}
