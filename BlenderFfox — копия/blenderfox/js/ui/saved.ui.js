/* ══════════════════════════════════════
   BLENDERFOX — UI: SAVED WORKS
══════════════════════════════════════ */

const CARD_COLORS = ['sc-orange','sc-amber','sc-warm','sc-peach','sc-brown','sc-sand','sc-rose','sc-cream'];
let _colorIndex = 0;
function nextColor() { return CARD_COLORS[(_colorIndex++) % CARD_COLORS.length]; }

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function _worksLabel(n) {
  if (getLang() === 'kz') return `${n} ${t('saved.works.1')}`;
  return `${n} ${n === 1 ? t('saved.works.1') : n < 5 ? t('saved.works.2') : t('saved.works.5')}`;
}

function _esc(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ══════════════════════════════════════
   РЕНДЕР СЕТКИ
══════════════════════════════════════ */
function renderSaved() {
  _colorIndex = 0;
  const savedWorks = getSavedWorks();

  document.getElementById('saved-body').innerHTML = getModules().map(m => {
    const totalWorks = m.tasks.reduce((s, task) => s + (savedWorks[task.id] || []).length, 0);

    const tasksHtml = m.tasks.map(task => {
      const works = savedWorks[task.id] || [];

      const uploadCard = `
        <div style="aspect-ratio:4/3">
          <div class="upload-card" style="height:100%"
               onclick="openAddWorkModal(${task.id}, '${_esc(task.title)}', '${task.emoji}')">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div class="upload-txt">${t('saved.add')}<br>
              <span style="opacity:.65;font-weight:600">${_esc(task.title)}</span>
            </div>
          </div>
        </div>`;

      const workCards = works.map(w => {
        const col = nextColor();
        const hasPhoto = !!w.image_url;
        const thumb = hasPhoto
          ? `<img src="${w.image_url}" class="saved-card-photo" alt="">`
          : `<div class="saved-card-emoji">${task.emoji}</div>`;
        const wIdAttr  = _esc(w.id  || '');
        const wTitle   = _esc(w.title);
        const wDate    = _esc(w.date);
        const tTitle   = _esc(task.title);
        return `
        <div class="saved-card"
             onclick="openWorkDetail('${wIdAttr}','${wTitle}','${task.emoji}','${wDate}','${tTitle}',${task.id})">
          <div class="saved-card-thumb ${hasPhoto ? 'has-photo' : col}">
            ${thumb}
            <div class="saved-card-tag">${w.tag || 'WIP'}</div>
          </div>
          <div class="saved-card-body">
            <div class="saved-card-title">${_esc(w.title)}</div>
            <div class="saved-card-meta">${_esc(task.title)}</div>
            <div class="saved-card-date">${_esc(w.date)}</div>
          </div>
        </div>`;
      }).join('');

      return uploadCard + workCards;
    }).join('');

    return `
    <div class="saved-module-block fade-up">
      <div class="saved-module-header">
        <div class="saved-module-icon">${m.icon}</div>
        <div class="saved-module-title">${m.title}</div>
        <div class="saved-module-count">${_worksLabel(totalWorks)}</div>
      </div>
      <div class="saved-grid">${tasksHtml}</div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   ADD WORK MODAL
══════════════════════════════════════ */

let _addWorkTaskId   = null;
let _addWorkImageB64 = null;

function openAddWorkModal(taskId, taskTitle, taskEmoji) {
  _addWorkTaskId   = taskId;
  _addWorkImageB64 = null;

  // Переводы
  document.getElementById('aw-title').textContent      = t('saved.modal.title');
  document.getElementById('aw-task-label').textContent = taskTitle;
  document.getElementById('aw-photo-hint').textContent = t('saved.modal.photo.hint');
  document.getElementById('aw-name-label').textContent = t('saved.modal.name.label');
  document.getElementById('aw-name').placeholder       = t('saved.modal.name.placeholder');
  document.getElementById('aw-cancel-btn').textContent = t('edit.cancel');
  document.getElementById('aw-save-btn').textContent   = t('edit.save');

  // Сброс
  document.getElementById('aw-name').value          = '';
  document.getElementById('aw-error').textContent   = '';
  document.getElementById('aw-success').textContent = '';
  document.getElementById('aw-file-input').value    = '';
  _resetPhotoUI();

  // Открыть
  document.getElementById('add-work-backdrop').classList.add('open');
  setTimeout(() => document.getElementById('aw-name').focus(), 150);
}

function closeAddWorkModal() {
  document.getElementById('add-work-backdrop').classList.remove('open');
}

// Закрыть по клику на фон
document.addEventListener('click', function(e) {
  if (e.target.id === 'add-work-backdrop')  closeAddWorkModal();
  if (e.target.id === 'work-detail-backdrop') closeWorkDetail();
});

function _resetPhotoUI() {
  document.getElementById('aw-photo-preview').src          = '';
  document.getElementById('aw-photo-preview').style.display = 'none';
  document.getElementById('aw-photo-placeholder').style.display = 'flex';
  document.getElementById('aw-photo-remove').style.display  = 'none';
  document.getElementById('aw-photo-area').style.cursor     = 'pointer';
}

// Клик по зоне фото → открыть выбор файла
document.addEventListener('DOMContentLoaded', function() {
  const area = document.getElementById('aw-photo-area');
  if (area) {
    area.addEventListener('click', function() {
      if (!_addWorkImageB64) {
        document.getElementById('aw-file-input').click();
      }
    });
  }
});

function onWorkPhotoSelected(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    document.getElementById('aw-error').textContent = t('saved.modal.photo.toobig');
    return;
  }
  document.getElementById('aw-error').textContent = '';

  _resizeWorkPhoto(file, 1200).then(b64 => {
    _addWorkImageB64 = b64;
    const img = document.getElementById('aw-photo-preview');
    img.src = b64;
    img.style.display = 'block';
    document.getElementById('aw-photo-placeholder').style.display = 'none';
    document.getElementById('aw-photo-remove').style.display = 'flex';
  }).catch(() => {
    document.getElementById('aw-error').textContent = t('saved.modal.photo.err');
  });
}

function removeWorkPhoto() {
  _addWorkImageB64 = null;
  _resetPhotoUI();
  document.getElementById('aw-file-input').value = '';
}

function _resizeWorkPhoto(file, maxW) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale   = Math.min(maxW / img.width, 1);
      const canvas  = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = () => reject(new Error('read error'));
    img.src = url;
  });
}

async function submitAddWork() {
  const name = document.getElementById('aw-name').value.trim();
  if (!name) {
    document.getElementById('aw-error').textContent = t('saved.modal.err.name');
    return;
  }

  const btn = document.getElementById('aw-save-btn');
  btn.disabled    = true;
  btn.textContent = t('edit.saving');
  document.getElementById('aw-error').textContent   = '';
  document.getElementById('aw-success').textContent = '';

  const u    = getUser();
  const date = new Date().toLocaleDateString('ru', { day: 'numeric', month: 'short' });

  try {
    let savedId = null;

    if (u && typeof sbSaveWork === 'function') {
      showToast(t('saved.toast.saving'));
      const row = await sbSaveWork(u.id, _addWorkTaskId, name, 'WIP', _addWorkImageB64);
      savedId = row?.id || null;
    }

    // Сохраняем локально
    const savedWorks = getSavedWorks();
    const key = String(_addWorkTaskId);
    if (!savedWorks[key]) savedWorks[key] = [];
    savedWorks[key].unshift({ id: savedId, title: name, tag: 'WIP', image_url: _addWorkImageB64, date });
    saveSavedWorks(savedWorks);

    // Медаль "Архивариус"
    const earned = getEarnedMedals();
    if (!earned.has('saver')) {
      earned.add('saver');
      saveEarnedMedals(earned);
      if (u && typeof sbSaveMedal === 'function') sbSaveMedal(u.id, 'saver').catch(() => {});
    }
    checkAllMedals();

    document.getElementById('aw-success').textContent = t('saved.toast.saved');
    showToast(t('saved.toast.saved'));

    setTimeout(() => {
      closeAddWorkModal();
      renderSaved();
    }, 600);

  } catch(err) {
    // Supabase упал — сохраняем только локально
    const savedWorks = getSavedWorks();
    const key = String(_addWorkTaskId);
    if (!savedWorks[key]) savedWorks[key] = [];
    savedWorks[key].unshift({ title: name, tag: 'WIP', image_url: _addWorkImageB64, date });
    saveSavedWorks(savedWorks);
    showToast(t('saved.toast.local'));

    setTimeout(() => { closeAddWorkModal(); renderSaved(); }, 800);
  } finally {
    btn.disabled    = false;
    btn.textContent = t('edit.save');
  }
}

/* ══════════════════════════════════════
   WORK DETAIL MODAL
══════════════════════════════════════ */

let _detailWorkId = null;
let _detailTaskId = null;

function openWorkDetail(workId, title, emoji, date, taskTitle, taskId) {
  _detailWorkId = workId;
  _detailTaskId = taskId;

  // Фото или эмодзи
  const savedWorks = getSavedWorks();
  const work = (savedWorks[String(taskId)] || [])
    .find(w => (w.id && w.id === workId) || w.title === title);

  const photoWrap = document.getElementById('wd-photo-wrap');
  if (work?.image_url) {
    photoWrap.innerHTML = `<img src="${work.image_url}" class="sw-detail-photo" alt="${_esc(title)}">`;
  } else {
    photoWrap.innerHTML = `<div class="sw-detail-emoji">${emoji}</div>`;
  }

  document.getElementById('wd-title').textContent = title;
  document.getElementById('wd-meta').textContent  = taskTitle;
  document.getElementById('wd-date').textContent  = date;

  document.getElementById('work-detail-backdrop').classList.add('open');
}

function closeWorkDetail() {
  document.getElementById('work-detail-backdrop').classList.remove('open');
}

async function deleteWork() {
  if (!confirm('Удалить эту работу?')) return;

  const savedWorks = getSavedWorks();
  const key = String(_detailTaskId);
  if (savedWorks[key]) {
    savedWorks[key] = savedWorks[key].filter(w => w.id !== _detailWorkId);
    saveSavedWorks(savedWorks);
  }

  if (_detailWorkId && typeof sbDeleteWork === 'function') {
    try { await sbDeleteWork(_detailWorkId); } catch(e) { console.warn('Delete error:', e.message); }
  }

  closeWorkDetail();
  renderSaved();
}
