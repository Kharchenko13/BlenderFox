/* ══════════════════════════════════════
   BLENDERFOX — DB: medals
   localStorage-геттеры определены в router.js
   (привязаны к userId через userKey)
══════════════════════════════════════ */

function getMedals() {
  const earned = getEarnedMedals();
  return MEDALS_DATA.map(m => ({ ...m, earned: earned.has(m.id) }));
}

/* ── Supabase ── */

async function sbSaveMedal(userId, medalId) {
  const sb = getSupabase();
  const { error } = await sb.from('medals').upsert(
    { user_id: userId, medal_id: medalId, earned_at: new Date().toISOString() },
    { onConflict: 'user_id,medal_id' }
  );
  if (error) console.warn('Medal save error:', error.message);
}

async function sbGetMedals(userId) {
  const sb = getSupabase();
  const { data, error } = await sb.from('medals')
    .select('medal_id')
    .eq('user_id', userId);
  if (error) { console.warn('Medal fetch error:', error.message); return []; }
  return data.map(r => r.medal_id);
}
