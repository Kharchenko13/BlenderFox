/* ══════════════════════════════════════
   BLENDERFOX — UI: PROFILE
══════════════════════════════════════ */

/* ── Рендер страницы профиля ── */
function renderProfile() {
  const u     = getUser();
  const stats = getStats();
  if (!u) return;

  // Аватар
  const avatarEl = document.getElementById('p-avatar-letter');
  if (u.avatar_url) {
    avatarEl.innerHTML = `<img src="${u.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    avatarEl.textContent = u.avatar || u.name[0].toUpperCase();
  }

  document.getElementById('p-name').textContent  = u.name;
  document.getElementById('p-email').textContent = u.email;
  document.getElementById('p-level').textContent = `${t('profile.student')} · ${t('profile.level')} ${u.level || 1}`;

  document.getElementById('pstat-done').textContent    = stats.done;
  document.getElementById('pstat-modules').textContent = stats.modsDone;
  document.getElementById('pstat-medals').textContent  = stats.meds;
  document.getElementById('profile-medals-new').textContent = stats.meds;

  // Переводимые статичные тексты
  _setTxt('profile-page-title',    'profile.title');
  _setTxt('profile-page-sub',      'profile.sub');
  _setTxt('p-stat-tasks-lbl',      'profile.stat.tasks');
  _setTxt('p-stat-modules-lbl',    'profile.stat.modules');
  _setTxt('p-stat-medals-lbl',     'profile.stat.medals');
  _setTxt('profile-sec-notif',     'profile.sec.notif');
  _setTxt('profile-sec-settings',  'profile.sec.settings');
  _setTxt('profile-notif-remind',  'profile.notif.remind');
  _setTxt('profile-notif-medals',  'profile.notif.medals');
  _setTxt('profile-personal-title','profile.settings.personal');
  _setTxt('profile-personal-sub',  'profile.settings.personal.sub');
  _setTxt('profile-lang-title',    'profile.settings.lang');
  _setTxt('profile-progress-title','profile.settings.progress');
  _setTxt('profile-logout-title',  'profile.logout');

  // Динамические подписи
  const lang = getLang();
  _setTxt('profile-lang-sub', null, lang === 'kz' ? 'Қазақша' : 'Русский');
  _setTxt('profile-medals-sub', null,
    `${stats.meds} ${lang === 'kz' ? 'медаль алынды' : 'медалей получено'}`);
  _setTxt('progress-sub', null,
    `${stats.done} ${t('profile.progress.sub')} ${stats.total} ${t('profile.progress.tasks')}`);

  updateReminderSub();
}

function _setTxt(id, key, override) {
  const el = document.getElementById(id);
  if (el) el.textContent = override !== undefined ? override : t(key);
}

/* ══════════════════════════════════════
   EDIT PROFILE MODAL
══════════════════════════════════════ */

let _avatarFile = null;

function openEditProfile() {
  const u = getUser();
  if (!u) return;

  if (!document.getElementById('edit-modal-backdrop')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="edit-modal-backdrop" id="edit-modal-backdrop" onclick="closeEditProfile(event)">
        <div class="edit-modal" onclick="event.stopPropagation()">
          <div class="edit-modal-title" id="edit-modal-title"></div>

          <div class="avatar-picker">
            <div class="avatar-preview" id="edit-avatar-preview">
              <span id="edit-avatar-letter"></span>
            </div>
            <div class="avatar-picker-actions">
              <label class="btn-upload" id="edit-upload-label">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span id="edit-upload-txt"></span>
                <input type="file" id="edit-avatar-input" accept="image/*" style="display:none" onchange="onAvatarSelected(this)">
              </label>
              <div class="avatar-hint" id="edit-avatar-hint"></div>
            </div>
          </div>

          <div class="edit-form-group">
            <label class="edit-form-label" id="edit-name-label"></label>
            <input class="edit-form-input" id="edit-name" type="text">
          </div>
          <div class="edit-form-group">
            <label class="edit-form-label" id="edit-email-label"></label>
            <input class="edit-form-input" id="edit-email" type="email" disabled>
          </div>

          <div class="edit-modal-error"   id="edit-error"></div>
          <div class="edit-modal-success" id="edit-success"></div>

          <div class="edit-modal-actions">
            <button class="btn-cancel" id="edit-cancel-btn" onclick="closeEditProfile()"></button>
            <button class="btn-save"   id="btn-save-profile" onclick="saveProfile()"></button>
          </div>
        </div>
      </div>
    `);
  }

  // Заполняем переводы
  document.getElementById('edit-modal-title').textContent  = t('edit.title');
  document.getElementById('edit-upload-txt').textContent   = t('edit.upload');
  document.getElementById('edit-avatar-hint').textContent  = t('edit.hint');
  document.getElementById('edit-name-label').textContent   = t('edit.name.label');
  document.getElementById('edit-email-label').textContent  = t('edit.email.label');
  document.getElementById('edit-cancel-btn').textContent   = t('edit.cancel');
  document.getElementById('btn-save-profile').textContent  = t('edit.save');

  // Данные
  _avatarFile = null;
  document.getElementById('edit-name').value           = u.name;
  document.getElementById('edit-name').placeholder     = t('edit.name.placeholder');
  document.getElementById('edit-email').value          = u.email;
  document.getElementById('edit-error').textContent    = '';
  document.getElementById('edit-success').textContent  = '';

  const preview = document.getElementById('edit-avatar-preview');
  if (u.avatar_url) {
    preview.innerHTML = `<img src="${u.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    preview.innerHTML = `<span id="edit-avatar-letter">${u.avatar || u.name[0].toUpperCase()}</span>`;
  }

  document.getElementById('edit-modal-backdrop').classList.add('open');
}

function closeEditProfile(e) {
  if (e && e.target !== document.getElementById('edit-modal-backdrop')) return;
  document.getElementById('edit-modal-backdrop').classList.remove('open');
}

function onAvatarSelected(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    document.getElementById('edit-error').textContent = t('edit.err.size');
    return;
  }
  _avatarFile = file;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById('edit-avatar-preview').innerHTML =
      `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  };
  reader.readAsDataURL(file);
}

async function saveProfile() {
  const name = document.getElementById('edit-name').value.trim();
  if (!name) { document.getElementById('edit-error').textContent = t('edit.err.name'); return; }

  const btn = document.getElementById('btn-save-profile');
  btn.disabled = true;
  btn.textContent = t('edit.saving');
  document.getElementById('edit-error').textContent   = '';
  document.getElementById('edit-success').textContent = '';

  const u = getUser();
  try {
    let avatar_url = u.avatar_url || null;

    // Сжимаем до 256px и конвертируем в base64 — без Supabase Storage, без RLS
    if (_avatarFile) {
      avatar_url = await _resizeToBase64(_avatarFile, 256);
    }

    const avatar_letter = name[0].toUpperCase();
    await sbUpdateProfile(u.id, { name, avatar: avatar_letter, avatar_url });

    const updated = { ...u, name, avatar: avatar_letter, avatar_url };
    localStorage.setItem('lc_user', JSON.stringify(updated));

    document.getElementById('edit-success').textContent = t('edit.success');
    renderProfile();
    if (typeof renderSidebar === 'function') renderSidebar('profile');

    setTimeout(() => {
      document.getElementById('edit-modal-backdrop').classList.remove('open');
    }, 1000);
  } catch(err) {
    document.getElementById('edit-error').textContent = err.message || t('edit.err.name');
  } finally {
    btn.disabled = false;
    btn.textContent = t('edit.save');
  }
}

/**
 * Сжимает изображение до maxSize×maxSize и возвращает base64 JPEG.
 * Обходит Supabase Storage и его RLS-политики полностью.
 */
function _resizeToBase64(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const scale  = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error('Не удалось прочитать изображение'));
    img.src = url;
  });
}

/* ══════════════════════════════════════
   LANGUAGE MODAL — Язык интерфейса
══════════════════════════════════════ */

function openLangModal() {
  if (!document.getElementById('lang-backdrop')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="edit-modal-backdrop" id="lang-backdrop" onclick="closeLangModal(event)">
        <div class="edit-modal lang-modal" onclick="event.stopPropagation()">
          <div class="edit-modal-title" id="lang-modal-title"></div>

          <div class="lang-options">
            <button class="lang-option" id="lang-opt-ru" onclick="selectLang('ru')">
              <span class="lang-flag">🇷🇺</span>
              <span class="lang-name">Русский</span>
              <span class="lang-check" id="lang-check-ru">✓</span>
            </button>
            <button class="lang-option" id="lang-opt-kz" onclick="selectLang('kz')">
              <span class="lang-flag">🇰🇿</span>
              <span class="lang-name">Қазақша</span>
              <span class="lang-check" id="lang-check-kz">✓</span>
            </button>
          </div>

          <div class="edit-modal-actions" style="margin-top:24px">
            <button class="btn-cancel" id="lang-cancel-btn" onclick="closeLangModal()"></button>
            <button class="btn-save"   id="lang-save-btn"   onclick="applyLang()"></button>
          </div>
        </div>
      </div>
    `);
  }

  _langSelected = getLang();
  _refreshLangModal();
  document.getElementById('lang-backdrop').classList.add('open');
}

let _langSelected = 'ru';

function _refreshLangModal() {
  document.getElementById('lang-modal-title').textContent = t('lang.title');
  document.getElementById('lang-cancel-btn').textContent  = t('lang.cancel');
  document.getElementById('lang-save-btn').textContent    = t('lang.save');

  ['ru', 'kz'].forEach(code => {
    const opt   = document.getElementById(`lang-opt-${code}`);
    const check = document.getElementById(`lang-check-${code}`);
    if (opt)   opt.classList.toggle('active', _langSelected === code);
    if (check) check.style.visibility = _langSelected === code ? 'visible' : 'hidden';
  });
}

function selectLang(code) {
  _langSelected = code;
  _refreshLangModal();
}

function closeLangModal(e) {
  const backdrop = document.getElementById('lang-backdrop');
  if (!backdrop) return;
  if (e && e.target !== backdrop) return;
  backdrop.classList.remove('open');
}

function applyLang() {
  setLang(_langSelected);
  // Перезагружаем страницу — самый надёжный способ применить язык везде
  location.reload();
}

/* ══════════════════════════════════════
   REMINDER MODAL — Напоминания об уроках
══════════════════════════════════════ */

const REMINDER_KEY = 'bf_reminder';

function loadReminder() {
  try { return JSON.parse(localStorage.getItem(REMINDER_KEY)) || null; }
  catch { return null; }
}

function saveReminder(data) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(data));
}

function updateReminderSub() {
  const el = document.getElementById('reminder-sub');
  if (!el) return;
  const r = loadReminder();
  if (!r || !r.enabled) {
    el.textContent = t('reminder.off');
    return;
  }
  const dayKeys = ['reminder.days.sun','reminder.days.mon','reminder.days.tue',
                   'reminder.days.wed','reminder.days.thu','reminder.days.fri','reminder.days.sat'];
  const days = (r.days || []).map(d => t(dayKeys[d])).join(', ') || '—';
  el.textContent = `${days} ${t('reminder.daily')} ${r.time}`;
}

function openReminderModal() {
  if (!document.getElementById('reminder-backdrop')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="edit-modal-backdrop" id="reminder-backdrop" onclick="closeReminderModal(event)">
        <div class="edit-modal reminder-modal" onclick="event.stopPropagation()">
          <div class="edit-modal-title" id="reminder-modal-title"></div>

          <div class="reminder-toggle-row">
            <span class="reminder-toggle-label" id="reminder-enable-label"></span>
            <label class="reminder-switch">
              <input type="checkbox" id="reminder-enabled">
              <span class="reminder-slider"></span>
            </label>
          </div>

          <div id="reminder-settings">
            <div class="edit-form-group" style="margin-top:20px">
              <label class="edit-form-label" id="reminder-time-label"></label>
              <input class="edit-form-input reminder-time-input" type="time" id="reminder-time" value="18:00">
            </div>
            <div class="edit-form-group">
              <label class="edit-form-label" id="reminder-days-label"></label>
              <div class="reminder-days" id="reminder-days-row"></div>
            </div>
            <div class="reminder-notif-hint" id="reminder-notif-hint"></div>
            <button type="button" class="btn-test-notif" onclick="testReminderNotification()" id="reminder-test-btn"></button>
          </div>

          <div class="edit-modal-actions" style="margin-top:24px">
            <button class="btn-cancel" id="reminder-cancel-btn" onclick="closeReminderModal()"></button>
            <button class="btn-save"   id="reminder-save-btn"   onclick="applyReminder()"></button>
          </div>
        </div>
      </div>
    `);

    document.getElementById('reminder-enabled').addEventListener('change', function() {
      document.getElementById('reminder-settings').style.display = this.checked ? '' : 'none';
    });
  }

  // Переводы
  document.getElementById('reminder-modal-title').textContent  = t('reminder.title');
  document.getElementById('reminder-enable-label').textContent = t('reminder.enable');
  document.getElementById('reminder-time-label').textContent   = t('reminder.time.label');
  document.getElementById('reminder-days-label').textContent   = t('reminder.days.label');
  document.getElementById('reminder-test-btn').textContent     = t('reminder.test');
  document.getElementById('reminder-cancel-btn').textContent   = t('reminder.cancel');
  document.getElementById('reminder-save-btn').textContent     = t('reminder.save');

  // Кнопки дней с переводом
  const dayKeys = [
    { day: 1, key: 'reminder.days.mon' },
    { day: 2, key: 'reminder.days.tue' },
    { day: 3, key: 'reminder.days.wed' },
    { day: 4, key: 'reminder.days.thu' },
    { day: 5, key: 'reminder.days.fri' },
    { day: 6, key: 'reminder.days.sat' },
    { day: 0, key: 'reminder.days.sun' },
  ];
  const daysRow = document.getElementById('reminder-days-row');
  daysRow.innerHTML = dayKeys.map(d =>
    `<button type="button" class="day-btn" data-day="${d.day}">${t(d.key)}</button>`
  ).join('');
  daysRow.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });

  // Текущие значения
  const r = loadReminder();
  const enabled = r && r.enabled;
  document.getElementById('reminder-enabled').checked = !!enabled;
  document.getElementById('reminder-settings').style.display = enabled ? '' : 'none';
  document.getElementById('reminder-time').value = (r && r.time) || '18:00';

  const activeDays = (r && r.days) || [1,2,3,4,5];
  daysRow.querySelectorAll('.day-btn').forEach(btn => {
    btn.classList.toggle('active', activeDays.includes(Number(btn.dataset.day)));
  });

  _updateNotifHint();
  document.getElementById('reminder-backdrop').classList.add('open');
}

function closeReminderModal(e) {
  const backdrop = document.getElementById('reminder-backdrop');
  if (!backdrop) return;
  if (e && e.target !== backdrop) return;
  backdrop.classList.remove('open');
}

function _updateNotifHint() {
  const hint = document.getElementById('reminder-notif-hint');
  if (!hint) return;
  if (!('Notification' in window)) {
    hint.innerHTML   = t('reminder.hint.noapi');
    hint.className   = 'reminder-notif-hint warn';
    return;
  }
  if (location.protocol === 'file:') {
    hint.innerHTML   = t('reminder.hint.file');
    hint.className   = 'reminder-notif-hint warn';
    return;
  }
  if (Notification.permission === 'granted') {
    hint.innerHTML   = t('reminder.hint.ok');
    hint.className   = 'reminder-notif-hint ok';
  } else if (Notification.permission === 'denied') {
    hint.innerHTML   = t('reminder.hint.denied');
    hint.className   = 'reminder-notif-hint warn';
  } else {
    hint.innerHTML   = t('reminder.hint.ask');
    hint.className   = 'reminder-notif-hint info';
  }
}

async function applyReminder() {
  const enabled = document.getElementById('reminder-enabled').checked;
  const time    = document.getElementById('reminder-time').value || '18:00';
  const days    = [...document.querySelectorAll('#reminder-days-row .day-btn.active')]
                    .map(b => Number(b.dataset.day));

  if (enabled && days.length === 0) {
    const hint = document.getElementById('reminder-notif-hint');
    hint.innerHTML = t('reminder.err.days');
    hint.className = 'reminder-notif-hint warn';
    return;
  }

  if (enabled && 'Notification' in window && Notification.permission !== 'granted') {
    const perm = await Notification.requestPermission();
    _updateNotifHint();
    if (perm !== 'granted') return;
  }

  saveReminder({ enabled, time, days });
  scheduleReminders();
  updateReminderSub();
  document.getElementById('reminder-backdrop').classList.remove('open');
}

let _reminderTimeout = null;

function scheduleReminders() {
  if (_reminderTimeout) clearTimeout(_reminderTimeout);
  const r = loadReminder();
  if (!r || !r.enabled) return;
  const [hh, mm] = r.time.split(':').map(Number);

  function tick() {
    if (_reminderTimeout) clearTimeout(_reminderTimeout);
    const now       = new Date();
    const todayFire = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0, 0);
    if (todayFire <= now) todayFire.setDate(todayFire.getDate() + 1);
    _reminderTimeout = setTimeout(() => {
      const fresh = loadReminder();
      if (fresh && fresh.enabled && fresh.days.includes(new Date().getDay())) {
        fireReminderNotification(fresh.time);
      }
      tick();
    }, todayFire - now);
  }
  tick();
}

function fireReminderNotification(time) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(t('reminder.notif.title'), {
      body:     t('reminder.notif.body', { time }),
      icon:     '../assets/SmileFox.png',
      tag:      'bf-lesson-reminder',
      renotify: true,
    });
  } catch(e) { console.warn('Notification error:', e); }
}

function testReminderNotification() {
  if (!('Notification' in window)) { alert(t('reminder.test.noapi')); return; }
  if (Notification.permission !== 'granted') { alert(t('reminder.test.noperm')); return; }
  fireReminderNotification(document.getElementById('reminder-time')?.value || '??:??');
}

/* Запуск при загрузке */
(function initReminders() {
  scheduleReminders();
  updateReminderSub();
})();
