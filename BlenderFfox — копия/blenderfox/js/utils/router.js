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
 * Делает MERGE: объединяет локальные данные с данными из базы.
 * Новый пользователь → Supabase вернёт пустые массивы → прогресс на нуле.
 * Существующий → данные из базы добавятся к локальным (union).
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

    // Сохранённые работы: добавляем из Supabase то чего нет локально
    const localSaved = getSavedWorks();
    sbWorks.forEach(w => {
      const key = String(w.task_id);
      if (!localSaved[key]) localSaved[key] = [];
      // Добавляем только если такой записи ещё нет (по id из Supabase)
      const exists = localSaved[key].some(x => x.id === w.id);
      if (!exists) {
        localSaved[key].push({
          id:    w.id,
          title: w.title,
          tag:   w.tag,
          date:  new Date(w.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })
        });
      }
    });
    saveSavedWorks(localSaved);

  } catch(e) {
    console.warn('Supabase sync failed, using local data:', e.message);
  }
}
