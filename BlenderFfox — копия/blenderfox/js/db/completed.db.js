/* ══════════════════════════════════════
   BLENDERFOX — DB: completed_tasks

   Таблица tasks в Supabase (справочник):
     task_id     integer  PK  — числовой id: 0..9
     title       text         — название задания
     level       text         — уровень сложности
     module_id   text         — id модуля
     module_name text         — название модуля
     emoji       text
     sort_order  integer

   Таблица completed_tasks (факт выполнения):
     id           uuid  PK
     user_id      uuid  → auth.users.id
     task_id      integer → tasks.task_id
     completed_at timestamptz
     UNIQUE(user_id, task_id)

   localStorage-геттеры определены в router.js
   (привязаны к userId через userKey)
══════════════════════════════════════ */

/* ── Supabase: записать выполненное задание ──
   Сохраняет: user_id + task_id + completed_at
   upsert — не дублирует если уже выполнено    */
async function sbCompleteTask(userId, taskId) {
  const sb = getSupabase();
  const { error } = await sb.from('completed_tasks').upsert(
    {
      user_id:      userId,
      task_id:      taskId,              // числовой id задания (0-9)
      completed_at: new Date().toISOString()
    },
    { onConflict: 'user_id,task_id' }   // не дублировать
  );
  if (error) console.warn('Complete task error:', error.message);
}

/* ── Supabase: получить все выполненные задания пользователя ── */
async function sbGetCompletedTasks(userId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('completed_tasks')
    .select('task_id, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: true });

  if (error) { console.warn('Fetch tasks error:', error.message); return []; }
  return data.map(r => r.task_id);   // возвращаем массив числовых id
}

/* ── Supabase: получить справочник всех заданий ──
   Используется если нужно показать задания из БД  */
async function sbGetAllTasks() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('tasks')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) { console.warn('Fetch all tasks error:', error.message); return []; }
  return data;
}
