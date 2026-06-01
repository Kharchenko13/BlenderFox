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
          <span data-i18n="task.panel.back">Назад</span>
        </button>
        <div class="task-panel-title" id="panel-title">${t('task.panel.title')}</div>
      </div>
      <div class="task-panel-body">
        <div class="task-banner" id="panel-banner"></div>
        <div class="task-desc-box">
          <div id="panel-video-wrap"></div>
          <div class="task-desc-txt" id="panel-desc"></div>
          <div class="steps-label" data-i18n="task.panel.steps">📋 Инструкция</div>
          <div id="panel-steps"></div>
        </div>
      </div>
      <div class="task-panel-footer">
        <button class="btn-primary" id="panel-btn" style="margin-top:0">${t('task.btn.start')}</button>
      </div>
    </div>
  `);
}

function openTask(id) {
  const task = getAllTasksI18n().find(x => x.id === id);
  if (!task) return;

  // Медаль "Первый шаг"
  const earned = getEarnedMedals();
  if (!earned.has('start')) {
    earned.add('start');
    saveEarnedMedals(earned);
    if (typeof showMedalToast === 'function') showMedalToast('start');
    const u = getUser();
    if (u && typeof sbSaveMedal === 'function') sbSaveMedal(u.id, 'start').catch(() => {});
  }
  document.getElementById('panel-title').textContent = task.title;
  document.getElementById('panel-desc').textContent  = task.desc;

  // Видео урока
  const videoWrap = document.getElementById('panel-video-wrap');
  if (task.video) {
    videoWrap.innerHTML = `
      <div class="task-video-wrap">
        <video class="task-video" controls preload="metadata" src="${task.video}">
          <p class="task-video-fallback">
            Ваш браузер не поддерживает воспроизведение этого формата.
            <a href="${task.video}" download>Скачать видео</a>
          </p>
        </video>
        <div class="task-video-label">🎬 Видеоурок</div>
      </div>`;
  } else {
    videoWrap.innerHTML = '';
  }

  const banner = document.getElementById('panel-banner');
  banner.style.background = `linear-gradient(135deg,${task.bg},${task.bg})`;
  banner.style.border = `1px solid ${task.color}30`;
  banner.innerHTML = `
    <div class="task-banner-emoji">${task.emoji}</div>
    <div>
      <div class="task-banner-info-title">${task.title}</div>
      <span class="task-level-tag" style="background:${task.color}">${task.level}</span>
    </div>`;

  document.getElementById('panel-steps').innerHTML = task.steps.map((s, i) => `
    <div class="task-step">
      <div class="step-num">${i + 1}</div>
      <div class="step-body">
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
        ${s.img ? `<img src="${s.img}" class="step-img" alt="${s.title}" loading="lazy">` : ''}
        ${s.tip ? `<div class="step-tip">${s.tip}</div>` : ''}
      </div>
    </div>`).join('');

  const done = getCompletedTasks().has(id);
  const btn  = document.getElementById('panel-btn');
  btn.textContent = done ? t('task.btn.done') : t('task.btn.complete');
  btn.style.opacity = done ? '.65' : '1';
  btn.onclick = done ? null : () => completeTask(id);

  document.getElementById('task-backdrop').classList.add('open');
  document.getElementById('task-panel').classList.add('open');
}

function closeTask() {
  // Останавливаем видео при закрытии
  const video = document.querySelector('.task-video');
  if (video) { video.pause(); video.currentTime = 0; }

  document.getElementById('task-backdrop').classList.remove('open');
  document.getElementById('task-panel').classList.remove('open');
}

/* Лайтбокс для картинок шагов */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('step-img')) {
    const lb = document.createElement('div');
    lb.className = 'step-img-lightbox';
    lb.innerHTML = `<img src="${e.target.src}" alt="${e.target.alt}">`;
    lb.addEventListener('click', () => lb.remove());
    document.body.appendChild(lb);
  }
});

function completeTask(id) {
  const completedTasks = getCompletedTasks();
  completedTasks.add(id);
  saveCompletedTasks(completedTasks);

  const u = getUser();
  if (u && typeof sbCompleteTask === 'function') sbCompleteTask(u.id, id).catch(() => {});

  // Повышение уровня: каждые 2 выполненных задания +1 уровень (макс 5)
  let levelUp = false;
  let newLevel = 1;
  if (u) {
    newLevel = Math.min(5, Math.floor(completedTasks.size / 2) + 1);
    if (newLevel > (u.level || 1)) {
      const updated = { ...u, level: newLevel };
      localStorage.setItem('lc_user', JSON.stringify(updated));
      if (typeof sbUpdateProfile === 'function') {
        sbUpdateProfile(u.id, { level: newLevel }).catch(() => {});
      }
      levelUp = true;
    }
  }

  // Сначала медали, потом через 1 сек после последней медали — уровень
  checkAllMedals();

  if (levelUp) {
    // Ждём пока закончится медальный тост + 1 секунда
    const medalEndsIn = (typeof getMedalToastEndsIn === 'function') ? getMedalToastEndsIn() : 0;
    const delay = medalEndsIn > 0 ? medalEndsIn + 1000 : 1000;
    setTimeout(() => _showLevelUpToast(newLevel), delay);
  }

  closeTask();
  if (typeof onTaskCompleted === 'function') onTaskCompleted();
}

function _showLevelUpToast(level) {
  const existing = document.getElementById('levelup-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'levelup-toast';
  toast.innerHTML = `
    <img class="levelup-fox" src="../assets/fox_with_tongue.png" alt="fox">
    <div class="levelup-text">Уровень повышен до <strong>${level}</strong>!</div>
  `;
  toast.className = 'levelup-toast';
  document.body.appendChild(toast);

  // Анимация появления
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('levelup-toast--show'));
  });

  setTimeout(() => {
    toast.classList.remove('levelup-toast--show');
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

// openMedalPopup и closeMedalPopup определены в medals.ui.js
