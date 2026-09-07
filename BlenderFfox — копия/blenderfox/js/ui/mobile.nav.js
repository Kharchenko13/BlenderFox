/* ══════════════════════════════════════
   BLENDERFOX — Mobile Tab Bar
   Рендерит нижнюю навигацию на мобильных устройствах (≤768px).
   Определяет активную вкладку по текущему URL.
   НЕ рендерится на auth.html и onboarding.html (лендинг).
══════════════════════════════════════ */
(function () {
  'use strict';

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getActivePage() {
    var path = window.location.pathname;
    if (path.includes('home'))    return 'home';
    if (path.includes('tasks'))   return 'tasks';
    if (path.includes('saved'))   return 'saved';
    if (path.includes('medals'))  return 'medals';
    if (path.includes('profile')) return 'profile';
    return '';
  }

  var tabs = [
    {
      id:    'home',
      href:  'home.html',
      label: 'Главная',
      icon:  '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
    },
    {
      id:    'tasks',
      href:  'tasks.html',
      label: 'Задания',
      icon:  '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>'
    },
    {
      id:    'saved',
      href:  'saved.html',
      label: 'Работы',
      icon:  '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'
    },
    {
      id:    'medals',
      href:  'medals.html',
      label: 'Медали',
      icon:  '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>'
    },
    {
      id:    'profile',
      href:  'profile.html',
      label: 'Профиль',
      icon:  '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
    }
  ];

  function renderTabBar() {
    if (!isMobile()) return;

    // Не рендерить если уже есть
    if (document.getElementById('mobile-tabbar')) return;

    var active = getActivePage();

    var bar = document.createElement('nav');
    bar.id = 'mobile-tabbar';
    bar.className = 'mobile-tabbar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Навигация');

    bar.innerHTML = tabs.map(function (t) {
      var isActive = active === t.id;
      return '<a class="mobile-tab' + (isActive ? ' active' : '') + '"' +
             ' href="' + t.href + '"' +
             ' aria-label="' + t.label + '"' +
             (isActive ? ' aria-current="page"' : '') + '>' +
             '<svg viewBox="0 0 24 24" aria-hidden="true">' + t.icon + '</svg>' +
             '<span>' + t.label + '</span>' +
             '</a>';
    }).join('');

    document.body.appendChild(bar);
  }

  function removeTabBar() {
    var existing = document.getElementById('mobile-tabbar');
    if (existing) existing.remove();
  }

  function handleResize() {
    if (isMobile()) {
      renderTabBar();
    } else {
      removeTabBar();
    }
  }

  // Запуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTabBar);
  } else {
    renderTabBar();
  }

  window.addEventListener('resize', handleResize);

})();
