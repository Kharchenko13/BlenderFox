/* ══════════════════════════════════════
   BLENDERFOX — SUPABASE CLIENT CONFIG
   Подключение через CDN (без npm/Node.js)
══════════════════════════════════════ */

const SUPABASE_URL = 'https://tsbbyrwafbytyozkjpat.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzYmJ5cndhZmJ5dHlvemtqcGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODI0MDYsImV4cCI6MjA5Mjg1ODQwNn0.gEEc0YAJJz36otSVhThJpI77RQrYbi_Uxtps_G45U3Q';

let _supabase = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return _supabase;
}

/* ── AUTH ── */

async function sbRegister(name, email, pass) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password: pass,
    options: { data: { name, avatar: name[0].toUpperCase(), level: 1 } }
  });
  if (error) throw error;
  return data.user;
}

async function sbLogin(email, pass) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) throw error;
  return data.user;
}

async function sbLogout() {
  const sb = getSupabase();
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

/* ── PROFILES ── */

async function sbGetProfile(userId) {
  const sb = getSupabase();
  const { data, error } = await sb.from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) { console.warn('Profile fetch error:', error.message); return null; }
  return data;
}

async function sbUpdateProfile(userId, fields) {
  const sb = getSupabase();
  const { error } = await sb.from('profiles')
    .update(fields)
    .eq('id', userId);
  if (error) console.warn('Profile update error:', error.message);
}

/* ── MEDALS ── */

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

/* ── SAVED WORKS ── */

async function sbSaveWork(userId, taskId, title, tag) {
  const sb = getSupabase();
  const { data, error } = await sb.from('saved_works').insert({
    user_id: userId,
    task_id: taskId,
    title,
    tag,
    created_at: new Date().toISOString()
  }).select().single();
  if (error) console.warn('Save work error:', error.message);
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

/* ── COMPLETED TASKS ── */

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
