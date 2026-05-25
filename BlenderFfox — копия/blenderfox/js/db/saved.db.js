/* ══════════════════════════════════════
   BLENDERFOX — DB: saved_works
   localStorage-геттеры определены в router.js
   (привязаны к userId через userKey)
══════════════════════════════════════ */

/* ── Supabase ── */

async function sbSaveWork(userId, taskId, title, tag, imageUrl) {
  const sb = getSupabase();
  const { data, error } = await sb.from('saved_works').insert({
    user_id:    userId,
    task_id:    taskId,
    title,
    tag,
    image_url:  imageUrl || null,
    created_at: new Date().toISOString()
  }).select().single();
  if (error) throw error;
  return data;
}

async function sbGetSavedWorks(userId) {
  const sb = getSupabase();
  const { data, error } = await sb.from('saved_works')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.warn('Fetch works error:', error.message); return []; }
  return data;
}

async function sbDeleteWork(workId) {
  const sb = getSupabase();
  const { error } = await sb.from('saved_works').delete().eq('id', workId);
  if (error) throw error;
}
