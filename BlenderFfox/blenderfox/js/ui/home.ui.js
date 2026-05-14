/* ══════════════════════════════════════
   BLENDERFOX — UI: HOME
══════════════════════════════════════ */

function renderHomeModules(completedTasks) {
  const el = document.getElementById('home-modules');
  if (!el) return;
  el.innerHTML = MODULES.map(m => {
    const done = m.tasks.filter(t => completedTasks.has(t.id)).length;
    const pct  = Math.round(done / m.tasks.length * 100);
    return `
    <a href="tasks.html" class="home-module-card fade-up">
      <div class="home-module-card-icon">${m.icon}</div>
      <div class="home-module-card-info">
        <div class="home-module-card-title">${m.title}</div>
        <div class="home-module-card-sub">${done} / ${m.tasks.length} заданий выполнено</div>
      </div>
      <div class="home-module-progress">
        <div class="home-module-progress-bar">
          <div class="home-module-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="home-module-progress-pct">${pct}%</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--stone)" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </a>`;
  }).join('');
}
