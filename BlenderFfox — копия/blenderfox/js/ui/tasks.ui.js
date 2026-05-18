/* ══════════════════════════════════════
   BLENDERFOX — UI: TASKS
   Панель задания (slide-over)
══════════════════════════════════════ */

function renderTaskPanel() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay-backdrop" id="task-backdrop" onclick="closeTask()"></div>
    <div class="task-panel" id="task-panel">
      <div class="task-panel-header">
        <button class="back-btn" onclick="closeTask()">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </button>
        <div class="task-panel-title" id="panel-title">Задание</div>
      </div>
      <div class="task-panel-body">
        <div class="task-banner" id="panel-banner"></div>
        <div class="task-desc-box">
          <div class="task-desc-txt" id="panel-desc"></div>
          <div class="steps-label">📋 Инструкция</div>
          <div id="panel-steps"></div>
        </div>
      </div>
      <div class="task-panel-footer">
        <button class="btn-primary" id="panel-btn" style="margin-top:0">Начать задание →</button>
      </div>
    </div>
  `);
}

function openTask(id) {
  const t = getAllTasks().find(x => x.id === id);
  if (!t) return;

  // Медаль "Первый шаг"
  const earned = getEarnedMedals();
  if (!earned.has('start')) {
    earned.add('start');
    saveEarnedMedals(earned);
    if (typeof showMedalToast === 'function') showMedalToast('start');
    const u = getUser();
    if (u && typeof sbSaveMedal === 'function') sbSaveMedal(u.id, 'start').catch(() => {});
  }
  document.getElementById('panel-title').textContent = t.title;
  document.getElementById('panel-desc').textContent  = t.desc;

  const banner = document.getElementById('panel-banner');
  banner.style.background = `linear-gradient(135deg,${t.bg},${t.bg})`;
  banner.style.border = `1px solid ${t.color}30`;
  banner.innerHTML = `
    <div class="task-banner-emoji">${t.emoji}</div>
    <div>
      <div class="task-banner-info-title">${t.title}</div>
      <span class="task-level-tag" style="background:${t.color}">${t.level}</span>
    </div>`;

  document.getElementById('panel-steps').innerHTML = t.steps.map((s, i) => `
    <div class="task-step">
      <div class="step-num">${i + 1}</div>
      <div class="step-body">
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
        ${s.tip ? `<div class="step-tip">${s.tip}</div>` : ''}
      </div>
    </div>`).join('');

  const done = getCompletedTasks().has(id);
  const btn  = document.getElementById('panel-btn');
  btn.textContent = done ? '✅ Задание выполнено' : 'Отметить как выполненное ✓';
  btn.style.opacity = done ? '.65' : '1';
  btn.onclick = done ? null : () => completeTask(id);

  document.getElementById('task-backdrop').classList.add('open');
  document.getElementById('task-panel').classList.add('open');
}

function closeTask() {
  document.getElementById('task-backdrop').classList.remove('open');
  document.getElementById('task-panel').classList.remove('open');
}

function completeTask(id) {
  const completedTasks = getCompletedTasks();
  completedTasks.add(id);
  saveCompletedTasks(completedTasks);

  const u = getUser();
  if (u && typeof sbCompleteTask === 'function') sbCompleteTask(u.id, id).catch(() => {});

  checkAllMedals();
  closeTask();
  if (typeof onTaskCompleted === 'function') onTaskCompleted();
}

// openMedalPopup и closeMedalPopup определены в medals.ui.js
