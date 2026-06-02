/* ══════════════════════════════════════
   BLENDERFOX — ROUTER
   Навигация + синхронизация прогресса
══════════════════════════════════════ */

const ROUTES = {
  home:    'home.html',
  auth:    'auth.html',
  tasks:   'tasks.html',
  saved:   'saved.html',
  medals:  'medals.html',
  profile: 'profile.html',
};

function navigate(page) {
  const file = ROUTES[page];
  if (file) window.location.href = file;
}

/**
 * Ключи localStorage привязаны к userId —
 * каждый пользователь хранит свой прогресс отдельно.
 */
function userKey(key) {
  const u = getUser();
  return u ? `${key}_${u.id}` : key;
}

/* Переопределяем геттеры/сеттеры чтобы использовать userKey */
function getCompletedTasks() {
  return new Set(JSON.parse(localStorage.getItem(userKey('lc_completed')) || '[]'));
}
function saveCompletedTasks(set) {
  localStorage.setItem(userKey('lc_completed'), JSON.stringify([...set]));
}
function getEarnedMedals() {
  return new Set(JSON.parse(localStorage.getItem(userKey('lc_medals')) || '[]'));
}
function saveEarnedMedals(set) {
  localStorage.setItem(userKey('lc_medals'), JSON.stringify([...set]));
}
function getSavedWorks() {
  return JSON.parse(localStorage.getItem(userKey('lc_saved')) || '{}');
}
function saveSavedWorks(obj) {
  localStorage.setItem(userKey('lc_saved'), JSON.stringify(obj));
}

/**
 * Синхронизация из Supabase при загрузке страницы.
 * На новом устройстве: localStorage пустой → берём всё из Supabase.
 * На старом устройстве: мержим локальное + Supabase.
 */
async function syncFromSupabase() {
  const u = getUser();
  if (!u || typeof sbGetCompletedTasks !== 'function') return;

  try {
    const [sbTasks, sbMedals, sbWorks] = await Promise.all([
      sbGetCompletedTasks(u.id),
      sbGetMedals(u.id),
      sbGetSavedWorks(u.id)
    ]);

    // Задания: объединяем локальные + из Supabase
    const localTasks = getCompletedTasks();
    sbTasks.forEach(id => localTasks.add(id));
    saveCompletedTasks(localTasks);

    // Медали: объединяем локальные + из Supabase
    const localMedals = getEarnedMedals();
    sbMedals.forEach(id => localMedals.add(id));
    saveEarnedMedals(localMedals);

    // Сохранённые работы: полный мерж с приоритетом данных из Supabase
    // (Supabase — единственный источник истины для image_url)
    const localSaved = getSavedWorks();

    sbWorks.forEach(w => {
      const key = String(w.task_id);
      if (!localSaved[key]) localSaved[key] = [];

      const existingIdx = localSaved[key].findIndex(x => x.id === w.id);
      const record = {
        id:        w.id,
        title:     w.title,
        tag:       w.tag || 'WIP',
        image_url: w.image_url || null,  // ← фото с Supabase
        date:      new Date(w.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })
      };

      if (existingIdx === -1) {
        // Записи нет локально — добавляем
        localSaved[key].push(record);
      } else {
        // Запись есть — обновляем image_url из Supabase если локально её нет
        if (!localSaved[key][existingIdx].image_url && record.image_url) {
          localSaved[key][existingIdx].image_url = record.image_url;
        }
      }
    });

    saveSavedWorks(localSaved);

  } catch(e) {
    console.warn('Supabase sync failed, using local data:', e.message);
  }
}
