/* ══════════════════════════════════════
   BLENDERFOX — DB: completed_tasks
   localStorage-геттеры определены в router.js
   (привязаны к userId через userKey)
══════════════════════════════════════ */

/* ── Supabase ── */

async function sbCompleteTask(userId, taskId) {
  const sb = getSupabase();
  const { error } = await sb.from('completed_tasks').upsert(
    { user_id: userId, task_id: taskId, completed_at: new Date().toISOString() },
    { onConflict: 'user_id,task_id' }
  );
  if (error) console.warn('Complete task error:', error.message);
}

async function sbGetCompletedTasks(userId) {
  const sb = getSupabase();
  const { data, error } = await sb.from('completed_tasks')
    .select('task_id')
    .eq('user_id', userId);
  if (error) { console.warn('Fetch tasks error:', error.message); return []; }
  return data.map(r => r.task_id);
}
