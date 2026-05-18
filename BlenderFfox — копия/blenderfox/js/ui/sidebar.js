/* ══════════════════════════════════════
   BLENDERFOX — UI: SIDEBAR
══════════════════════════════════════ */

function renderSidebar(activePage) {
  const user = getUser();
  if (!user) return;

  const nav = [
    { id: 'home',    href: 'home.html',    label: 'Главная',            icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { id: 'tasks',   href: 'tasks.html',   label: 'Задания по модулям', icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>' },
    { id: 'saved',   href: 'saved.html',   label: 'Сохранённые работы', icon: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>' },
    { id: 'medals',  href: 'medals.html',  label: 'Медали',             icon: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>', badge: true },
    { id: 'profile', href: 'profile.html', label: 'Профиль',            icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  ];

  const stats  = getStats();
  const avatar = user.avatar || user.name[0].toUpperCase();

  const sections = [
    { label: 'Главная',    items: ['home'] },
    { label: 'Обучение',   items: ['tasks', 'saved'] },
    { label: 'Достижения', items: ['medals'] },
    { label: 'Аккаунт',    items: ['profile'] },
  ];

  let navHtml = '';
  sections.forEach(sec => {
    navHtml += `<div class="nav-section-label" style="margin-top:8px">${sec.label}</div>`;
    sec.items.forEach(id => {
      const item = nav.find(n => n.id === id);
      const isActive = activePage === id;
      navHtml += `
        <a class="nav-btn${isActive ? ' active' : ''}" href="${item.href}">
          <svg viewBox="0 0 24 24">${item.icon}</svg>
          ${item.label}
          ${item.badge ? `<span class="nav-badge">${stats.meds}</span>` : ''}
        </a>`;
    });
  });

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-brand">
      <div class="sidebar-brand-name">Blender<span>Fox</span></div>
      <div class="sidebar-brand-sub">Платформа 3D-обучения</div>
    </div>
    <nav class="sidebar-nav">${navHtml}</nav>
    <div class="sidebar-user">
      <div class="sidebar-avatar">${avatar}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${user.name}</div>
        <div class="sidebar-user-level">Уровень ${user.level || 1}</div>
      </div>
      <button class="sidebar-logout" title="Выйти" onclick="doLogout()">
        <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>`;
}
