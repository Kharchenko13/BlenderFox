/* ══════════════════════════════════════
   BLENDERFOX — SESSION
   getUser, checkAuth, restoreSession
══════════════════════════════════════ */

function getUser() {
  return JSON.parse(localStorage.getItem('lc_user') || 'null');
}

/**
 * Проверяет авторизацию. Если не залогинен — редиректит на auth.
 * Возвращает объект пользователя или null.
 */
function checkAuth(redirectToLogin = true) {
  const u = getUser();
  if (!u && redirectToLogin) {
    window.location.replace('../pages/auth.html');
  }
  return u;
}

/**
 * Восстанавливает Supabase-сессию из localStorage.
 *
 * На file:// браузер не сохраняет cookies, поэтому Supabase-клиент
 * при каждой загрузке страницы стартует без авторизации — auth.uid() = null,
 * что ломает RLS-политики (INSERT/DELETE блокируются).
 *
 * Supabase JS v2 сам хранит токены в localStorage под ключом
 * `sb-<ref>-auth-token`. setSession() восстанавливает сессию из них
 * и делает auth.uid() рабочим для всех последующих запросов.
 *
 * Вызывай await restoreSession() сразу после checkAuth().
 */
async function restoreSession() {
  try {
    const sb = getSupabase();

    // Ищем сохранённый токен Supabase (ключ зависит от project ref)
    const tokenKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!tokenKey) return;

    const stored = JSON.parse(localStorage.getItem(tokenKey));
    if (!stored?.access_token || !stored?.refresh_token) return;

    // Восстанавливаем сессию — после этого auth.uid() будет работать
    const { error } = await sb.auth.setSession({
      access_token:  stored.access_token,
      refresh_token: stored.refresh_token,
    });

    if (error) {
      console.warn('restoreSession error:', error.message);
    }
  } catch(e) {
    console.warn('restoreSession failed:', e.message);
  }
}
