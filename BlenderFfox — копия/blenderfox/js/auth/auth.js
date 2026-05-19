/* ══════════════════════════════════════
   BLENDERFOX — AUTH
   login, register, logout
══════════════════════════════════════ */

/**
 * Вход через Supabase Auth (email + password).
 * Email и пароль хранятся в auth.users — НЕ в profiles.
 * profiles содержит только имя, аватар, уровень.
 */
async function doLogin(email, pass) {
  // 1. Авторизация — Supabase проверяет email+пароль в auth.users
  const user = await sbLogin(email, pass);

  // 2. Пробуем получить профиль (имя, аватар, уровень)
  //    Если профиль не найден — используем данные из auth.users
  let name, avatar, level, avatar_url;
  try {
    const profile = await sbGetProfile(user.id);
    name   = profile?.name      || user.user_metadata?.name || email.split('@')[0];
    avatar = profile?.avatar    || name[0].toUpperCase();
    level  = profile?.level     || 1;
    avatar_url = profile?.avatar_url || null;
  } catch(e) {
    name   = user.user_metadata?.name || email.split('@')[0];
    avatar = name[0].toUpperCase();
    level  = 1;
    avatar_url = null;
  }

  localStorage.setItem('lc_user', JSON.stringify({
    id:         user.id,
    name,
    email:      user.email,
    avatar,
    avatar_url,
    level
  }));

  return user;
}

/**
 * Регистрация нового пользователя.
 * Supabase создаёт запись в auth.users.
 * Триггер handle_new_user автоматически создаёт профиль в profiles.
 * Если триггер не сработал — создаём профиль вручную.
 */
async function doRegister(name, email, pass) {
  // 1. Создаём аккаунт в Supabase Auth
  const user = await sbRegister(name, email, pass);

  // 2. Если триггер не создал профиль — создаём вручную
  if (user && user.id) {
    try {
      const existing = await sbGetProfile(user.id);
      if (!existing) {
        await getSupabase().from('profiles').insert({
          id:     user.id,
          name,
          avatar: name[0].toUpperCase(),
          level:  1
        });
      }
    } catch(e) {
      // Игнорируем — профиль создастся триггером
    }
  }

  // 3. Сохраняем в localStorage
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
 * Выход: завершаем сессию в Supabase и чистим localStorage.
 */
async function doLogout() {
  try { await sbLogout(); } catch(e) {}
  localStorage.removeItem('lc_user');
  window.location.replace('../pages/auth.html');
}
