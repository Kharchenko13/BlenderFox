/* ══════════════════════════════════════
   BLENDERFOX — UI: MEDALS
   Toast работает на любой странице —
   вызывай initMedalUI() при загрузке.
══════════════════════════════════════ */

const TOAST_DURATION = 4200; // мс

/* ── Инициализация попапа и toast ── */
function initMedalUI() {
  // Попап с информацией о медали
  if (!document.getElementById('medal-backdrop')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="medal-popup-backdrop" id="medal-backdrop" onclick="closeMedalPopup()">
        <div class="medal-popup" onclick="event.stopPropagation()">
          <div class="medal-popup-icon" id="mp-icon">🏅</div>
          <div class="medal-popup-name" id="mp-name">Медаль</div>
          <div class="medal-popup-status" id="mp-status">Получена</div>
          <div class="medal-popup-desc" id="mp-desc"></div>
          <div class="medal-popup-how"><strong>Как получить:</strong><span id="mp-how"></span></div>
          <button class="btn-close" onclick="closeMedalPopup()">Закрыть</button>
        </div>
      </div>
    `);
  }

  // Toast-уведомление
  if (!document.getElementById('medal-toast')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="medal-toast" id="medal-toast">
        <div class="medal-toast-text">
          <div class="medal-toast-label">🏅 Новая медаль!</div>
          <div class="medal-toast-name" id="toast-medal-name">—</div>
          <div class="medal-toast-desc" id="toast-medal-desc">—</div>
        </div>
        <img class="medal-toast-fox" src="../assets/SmileFox.png"
             onerror="this.style.display='none'" alt="SmileFox">
      </div>
    `);
  }
}

/* ── Toast при получении медали ── */
let _toastTimer = null;

function showMedalToast(medalId) {
  // Убедимся что toast существует (на случай если initMedalUI ещё не вызван)
  if (!document.getElementById('medal-toast')) initMedalUI();

  const medal    = MEDALS_DATA.find(m => m.id === medalId);
  const toast = document.getElementById('medal-toast');
  if (!medal || !toast) return;

  document.getElementById('toast-medal-name').textContent = `${medal.icon} ${medal.name}`;
  document.getElementById('toast-medal-desc').textContent = medal.desc;

  // Сбросить предыдущий таймер
  if (_toastTimer) {
    clearTimeout(_toastTimer);
    toast.classList.remove('show');
  }

  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  _toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    _toastTimer = null;
  }, TOAST_DURATION);
}

/* ── Рендер сетки медалей ── */
function renderMedals() {
  const medals = getMedals();
  const earned = medals.filter(m => m.earned).length;
  const locked = medals.length - earned;

  const earnedEl = document.getElementById('medals-earned-num');
  const lockedEl = document.getElementById('medals-locked-num');
  const totalEl  = document.getElementById('medals-total');
  if (earnedEl) earnedEl.textContent = earned;
  if (lockedEl) lockedEl.textContent = locked;
  if (totalEl)  totalEl.textContent  = medals.length;

  const grid = document.getElementById('medals-grid');
  if (!grid) return;

  grid.innerHTML = medals.map(m => `
    <div class="medal-card ${m.earned ? 'earned' : 'locked'} fade-up"
         onclick="openMedalPopup('${m.id}')">
      ${m.earned ? '<div class="medal-earned-badge"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>' : ''}
      <div class="medal-icon">${m.icon}</div>
      <div class="medal-name">${m.name}</div>
      <div class="medal-cond">${m.earned ? '✅ Получена' : 'Не получена'}</div>
    </div>`).join('');
}

/* ── Попап с деталями медали ── */
function openMedalPopup(id) {
  if (!document.getElementById('medal-backdrop')) initMedalUI();
  const m = getMedals().find(x => x.id === id);
  if (!m) return;
  document.getElementById('mp-icon').textContent = m.icon;
  document.getElementById('mp-name').textContent = m.name;
  document.getElementById('mp-desc').textContent = m.desc;
  document.getElementById('mp-how').textContent  = m.how;
  const st = document.getElementById('mp-status');
  st.textContent = m.earned ? '✅ Получена' : '🔒 Не получена';
  st.className   = 'medal-popup-status ' + (m.earned ? 'earned' : 'locked');
  document.getElementById('medal-backdrop').classList.add('open');
}

function closeMedalPopup() {
  const el = document.getElementById('medal-backdrop');
  if (el) el.classList.remove('open');
}
