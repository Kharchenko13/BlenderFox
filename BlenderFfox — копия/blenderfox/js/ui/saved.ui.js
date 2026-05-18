/* ══════════════════════════════════════
   BLENDERFOX — UI: SAVED WORKS
══════════════════════════════════════ */

const CARD_COLORS = ['sc-orange','sc-amber','sc-warm','sc-peach','sc-brown','sc-sand','sc-rose','sc-cream'];
let _colorIndex = 0;
function nextColor() { return CARD_COLORS[(_colorIndex++) % CARD_COLORS.length]; }

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function renderSaved() {
  _colorIndex = 0;
  const savedWorks = getSavedWorks();
  document.getElementById('saved-body').innerHTML = MODULES.map(m => {
    const totalWorks = m.tasks.reduce((s, t) => s + (savedWorks[t.id] || []).length, 0);
    const tasksHtml  = m.tasks.map(t => {
      const works = savedWorks[t.id] || [];
      const uploadCard = `
        <div style="aspect-ratio:4/3">
          <div class="upload-card" style="height:100%" onclick="addWork(${t.id},'${t.title.replace(/'/g,"\\'")}')">
            <div class="upload-icon"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
            <div class="upload-txt">Добавить работу<br><span style="opacity:.65;font-weight:600">${t.title}</span></div>
          </div>
        </div>`;
      const workCards = works.map(w => {
        const col = nextColor();
        return `
        <div class="saved-card">
          <div class="saved-card-thumb ${col}">
            <div class="saved-card-emoji">${t.emoji}</div>
            <div class="saved-card-tag">${w.tag || 'WIP'}</div>
          </div>
          <div class="saved-card-body">
            <div class="saved-card-title">${w.title}</div>
            <div class="saved-card-meta">${t.title}</div>
            <div class="saved-card-date">${w.date}</div>
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
        <div class="saved-module-count">${totalWorks} ${totalWorks === 1 ? 'работа' : totalWorks < 5 ? 'работы' : 'работ'}</div>
      </div>
      <div class="saved-grid">${tasksHtml}</div>
    </div>`;
  }).join('');
}

async function addWork(taskId, taskTitle) {
  const name = prompt(`Название работы для "${taskTitle}":`);
  if (!name || !name.trim()) return;

  const u    = getUser();
  const date = new Date().toLocaleDateString('ru', { day: 'numeric', month: 'short' });

  const savedWorks = getSavedWorks();
  if (!savedWorks[taskId]) savedWorks[taskId] = [];
  savedWorks[taskId].push({ title: name.trim(), date, tag: 'WIP' });
  saveSavedWorks(savedWorks);

  if (u && typeof sbSaveWork === 'function') {
    showToast('💾 Сохраняем...');
    try {
      await sbSaveWork(u.id, taskId, name.trim(), 'WIP');
      showToast('✅ Работа сохранена!');
    } catch(e) { showToast('⚠️ Сохранено локально'); }
  }

  const earned = getEarnedMedals();
  if (!earned.has('saver')) {
    earned.add('saver'); saveEarnedMedals(earned);
    if (u && typeof sbSaveMedal === 'function') sbSaveMedal(u.id, 'saver').catch(() => {});
  }
  checkAllMedals();
  renderSaved();
}
