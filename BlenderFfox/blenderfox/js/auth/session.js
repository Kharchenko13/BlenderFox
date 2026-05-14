/* ══════════════════════════════════════
   BLENDERFOX — SESSION
   getUser, checkAuth, onAuthChange
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
