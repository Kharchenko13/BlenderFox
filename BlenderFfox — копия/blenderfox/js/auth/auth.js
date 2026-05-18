/* ══════════════════════════════════════
   BLENDERFOX — AUTH
   login, register, logout
══════════════════════════════════════ */

/**
 * Вход: авторизуемся через Supabase,
 * затем подтягиваем профиль из таблицы profiles
 * и сохраняем в localStorage для быстрого доступа.
 */
async function doLogin(email, pass) {
  // 1. Авторизация через Supabase Auth
  const user = await sbLogin(email, pass);

  // 2. Подтягиваем профиль из таблицы profiles
  const profile = await sbGetProfile(user.id);

  // 3. Сохраняем в localStorage
  const name   = profile?.name   || user.user_metadata?.name || email.split('@')[0];
  const avatar = profile?.avatar || name[0].toUpperCase();
  const level  = profile?.level  || 1;

  localStorage.setItem('lc_user', JSON.stringify({
    id: user.id,
    name,
    email: user.email,
    avatar,
    level
  }));

  return user;
}

/**
 * Регистрация: создаём аккаунт в Supabase Auth.
 * Профиль создаётся автоматически через триггер в БД.
 */
async function doRegister(name, email, pass) {
  // 1. Регистрация через Supabase Auth (триггер создаст профиль)
  const user = await sbRegister(name, email, pass);

  // 2. Сохраняем в localStorage
  localStorage.setItem('lc_user', JSON.stringify({
    id:     user.id,
    name,
    email,
    avatar: name[0].toUpperCase(),
    level:  1
  }));

  return user;
}

/**
 * Выход: разлогиниваемся в Supabase и чистим localStorage.
 */
async function doLogout() {
  try { await sbLogout(); } catch(e) {}
  localStorage.removeItem('lc_user');
  window.location.replace('../pages/auth.html');
}
