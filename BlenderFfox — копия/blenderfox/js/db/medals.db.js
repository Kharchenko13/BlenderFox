/* ══════════════════════════════════════
   BLENDERFOX — DB: medals
   
   Таблица medals в Supabase:
     id        uuid  PK
     user_id   uuid  → auth.users.id
     medal_id  text  → medal_definitions.medal_id
     earned_at timestamptz

   Каждая медаль имеет строковый id:
   'start' | 'lesson1' | 'saver' | 'module1' |
   'materials' | 'animator' | 'renderer' |
   'half' | 'all' | 'week' | 'speed' | 'detail'
══════════════════════════════════════ */

function getMedals() {
  const earned = getEarnedMedals();
  return MEDALS_DATA.map(m => ({ ...m, earned: earned.has(m.id) }));
}

/* ── Supabase: записать полученную медаль ──
   Сохраняет: user_id + medal_id + earned_at
   upsert — не дублирует если уже есть        */
async function sbSaveMedal(userId, medalId) {
  const sb = getSupabase();
  const { error } = await sb.from('medals').upsert(
    {
      user_id:   userId,
      medal_id:  medalId,                        // строковый id медали
      earned_at: new Date().toISOString()
    },
    { onConflict: 'user_id,medal_id' }           // не дублировать
  );
  if (error) console.warn('Medal save error:', error.message);
}

/* ── Supabase: получить все медали пользователя ── */
async function sbGetMedals(userId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('medals')
    .select('medal_id, earned_at')
    .eq('user_id', userId)
    .order('earned_at', { ascending: true });

  if (error) { console.warn('Medal fetch error:', error.message); return []; }
  return data.map(r => r.medal_id);
}
