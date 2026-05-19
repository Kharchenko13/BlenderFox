/* ══════════════════════════════════════
   BLENDERFOX — UI: PROFILE
══════════════════════════════════════ */

/* ── Рендер страницы профиля ── */
function renderProfile() {
  const u     = getUser();
  const stats = getStats();
  if (!u) return;

  // Аватар — фото или буква
  const avatarEl = document.getElementById('p-avatar-letter');
  if (u.avatar_url) {
    avatarEl.innerHTML = `<img src="${u.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    avatarEl.textContent = u.avatar || u.name[0].toUpperCase();
  }

  document.getElementById('p-name').textContent  = u.name;
  document.getElementById('p-email').textContent = u.email;
  document.getElementById('p-level').textContent = `Студент · Уровень ${u.level || 1}`;

  document.getElementById('pstat-done').textContent    = stats.done;
  document.getElementById('pstat-modules').textContent = stats.modsDone;
  document.getElementById('pstat-medals').textContent  = stats.meds;
  document.getElementById('profile-medals-sub').textContent = `${stats.meds} медалей получено`;
  document.getElementById('profile-medals-new').textContent = stats.meds;
  document.getElementById('progress-sub').textContent  = `${stats.done} из ${stats.total} заданий выполнено`;
}

/* ══════════════════════════════════════
   EDIT PROFILE MODAL
══════════════════════════════════════ */

let _avatarFile = null;   // выбранный файл аватара

function openEditProfile() {
  const u = getUser();
  if (!u) return;

  // Создаём модалку если ещё нет
  if (!document.getElementById('edit-modal-backdrop')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="edit-modal-backdrop" id="edit-modal-backdrop" onclick="closeEditProfile(event)">
        <div class="edit-modal" onclick="event.stopPropagation()">
          <div class="edit-modal-title">Личные данные</div>

          <!-- Аватар -->
          <div class="avatar-picker">
            <div class="avatar-preview" id="edit-avatar-preview">
              <span id="edit-avatar-letter"></span>
            </div>
            <div class="avatar-picker-actions">
              <label class="btn-upload">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Загрузить фото
                <input type="file" id="edit-avatar-input" accept="image/*" style="display:none" onchange="onAvatarSelected(this)">
              </label>
              <div class="avatar-hint">JPG, PNG до 2 МБ</div>
            </div>
          </div>

          <!-- Имя -->
          <div class="edit-form-group">
            <label class="edit-form-label">Имя</label>
            <input class="edit-form-input" id="edit-name" type="text" placeholder="Введи имя">
          </div>

          <!-- Email (только чтение) -->
          <div class="edit-form-group">
            <label class="edit-form-label">Email</label>
            <input class="edit-form-input" id="edit-email" type="email" disabled>
          </div>

          <div class="edit-modal-error"   id="edit-error"></div>
          <div class="edit-modal-success" id="edit-success"></div>

          <div class="edit-modal-actions">
            <button class="btn-cancel" onclick="closeEditProfile()">Отмена</button>
            <button class="btn-save"   id="btn-save-profile" onclick="saveProfile()">Сохранить</button>
          </div>
        </div>
      </div>
    `);
  }

  // Заполняем текущими данными
  _avatarFile = null;
  document.getElementById('edit-name').value  = u.name;
  document.getElementById('edit-email').value = u.email;
  document.getElementById('edit-error').textContent   = '';
  document.getElementById('edit-success').textContent = '';

  // Превью аватара
  const preview = document.getElementById('edit-avatar-preview');
  if (u.avatar_url) {
    preview.innerHTML = `<img src="${u.avatar_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  } else {
    preview.innerHTML = `<span id="edit-avatar-letter">${u.avatar || u.name[0].toUpperCase()}</span>`;
  }

  document.getElementById('edit-modal-backdrop').classList.add('open');
}

function closeEditProfile(e) {
  if (e && e.target !== document.getElementById('edit-modal-backdrop')) return;
  document.getElementById('edit-modal-backdrop').classList.remove('open');
}

/* Превью выбранного фото */
function onAvatarSelected(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    document.getElementById('edit-error').textContent = 'Файл слишком большой (макс. 2 МБ)';
    return;
  }
  _avatarFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('edit-avatar-preview').innerHTML =
      `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  };
  reader.readAsDataURL(file);
}

/* Сохранение профиля */
async function saveProfile() {
  const name = document.getElementById('edit-name').value.trim();
  if (!name) { document.getElementById('edit-error').textContent = 'Введи имя'; return; }

  const btn = document.getElementById('btn-save-profile');
  btn.disabled = true;
  btn.textContent = 'Сохраняем...';
  document.getElementById('edit-error').textContent   = '';
  document.getElementById('edit-success').textContent = '';

  const u = getUser();

  try {
    let avatar_url = u.avatar_url || null;

    // 1. Загружаем аватар в Supabase Storage если выбран
    if (_avatarFile) {
      const sb  = getSupabase();
      const ext = _avatarFile.name.split('.').pop();
      const path = `avatars/${u.id}.${ext}`;

      const { error: uploadError } = await sb.storage
        .from('avatars')
        .upload(path, _avatarFile, { upsert: true, contentType: _avatarFile.type });

      if (uploadError) throw uploadError;

      // Получаем публичный URL
      const { data: urlData } = sb.storage.from('avatars').getPublicUrl(path);
      avatar_url = urlData.publicUrl + '?t=' + Date.now(); // cache bust
    }

    // 2. Обновляем профиль в таблице profiles
    const avatar_letter = name[0].toUpperCase();
    await sbUpdateProfile(u.id, {
      name,
      avatar:     avatar_letter,
      avatar_url: avatar_url
    });

    // 3. Обновляем localStorage
    const updated = { ...u, name, avatar: avatar_letter, avatar_url };
    localStorage.setItem('lc_user', JSON.stringify(updated));

    document.getElementById('edit-success').textContent = '✅ Данные сохранены!';

    // Обновляем страницу профиля
    renderProfile();
    // Обновляем сайдбар
    if (typeof renderSidebar === 'function') renderSidebar('profile');

    setTimeout(() => {
      document.getElementById('edit-modal-backdrop').classList.remove('open');
    }, 1000);

  } catch(e) {
    document.getElementById('edit-error').textContent = e.message || 'Ошибка сохранения';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Сохранить';
  }
}
