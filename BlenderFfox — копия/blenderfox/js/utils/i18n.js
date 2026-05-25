/* ══════════════════════════════════════
   BLENDERFOX — i18n (Интернационализация)
   Поддерживаемые языки: ru, kz
══════════════════════════════════════ */

const TRANSLATIONS = {
  ru: {
    /* ── Sidebar ── */
    'nav.home':            'Главная',
    'nav.tasks':           'Задания по модулям',
    'nav.saved':           'Сохранённые работы',
    'nav.medals':          'Медали',
    'nav.profile':         'Профиль',
    'nav.sec.main':        'Главная',
    'nav.sec.learning':    'Обучение',
    'nav.sec.achievements':'Достижения',
    'nav.sec.account':     'Аккаунт',
    'sidebar.brand.sub':   'Платформа 3D-обучения',
    'sidebar.level':       'Уровень',

    /* ── Home ── */
    'home.title':          'Добро пожаловать',
    'home.sub':            'Продолжай учиться — каждый урок делает тебя лучше',
    'home.banner.title':   'Привет от BlenderFox!',
    'home.banner.sub':     'Сегодня хороший день чтобы создать что-то крутое.\nВыбери задание и начни прямо сейчас!',
    'home.banner.btn':     'Перейти к заданиям →',
    'home.stat.done':      'Заданий выполнено',
    'home.stat.of':        'из',
    'home.stat.tasks':     'заданий',
    'home.stat.modules':   'Пройдено модулей',
    'home.stat.of4':       'из 4 модулей',
    'home.stat.medals':    'Медалей получено',
    'home.stat.see':       'Посмотреть все →',
    'home.modules.title':  'Модули курса',
    'home.module.done':    'заданий выполнено',

    /* ── Tasks ── */
    'tasks.title':         'Задания по модулям',
    'tasks.sub':           'Нажми на задание чтобы открыть инструкцию',
    'task.panel.back':     'Назад',
    'task.panel.title':    'Задание',
    'task.panel.steps':    '📋 Инструкция',
    'task.btn.start':      'Начать задание →',
    'task.btn.done':       '✅ Задание выполнено',
    'task.btn.complete':   'Отметить как выполненное ✓',

    /* ── Saved ── */
    'saved.title':         'Сохранённые работы',
    'saved.sub':           'Твои работы по каждому заданию',
    'saved.add':           'Добавить работу',
    'saved.works.1':       'работа',
    'saved.works.2':       'работы',
    'saved.works.5':       'работ',
    'saved.prompt':        'Название работы для',
    'saved.toast.saving':  '💾 Сохраняем...',
    'saved.toast.saved':   '✅ Работа сохранена!',
    'saved.toast.local':   '⚠️ Сохранено локально',

    /* ── Add Work Modal ── */
    'saved.modal.title':            'Добавить работу',
    'saved.modal.photo.hint':       'Нажми чтобы добавить фото работы',
    'saved.modal.photo.toobig':     'Файл слишком большой (макс. 10 МБ)',
    'saved.modal.photo.err':        'Не удалось прочитать изображение',
    'saved.modal.name.label':       'Название работы',
    'saved.modal.name.placeholder': 'Например: Мой первый куб',
    'saved.modal.err.name':         'Введи название работы',

    /* ── Medals ── */
    'medals.title':        '🏅 Медали',
    'medals.sub':          'Нажми на медаль чтобы узнать как её получить',
    'medals.earned':       'Получено медалей',
    'medals.of':           'из',
    'medals.possible':     'возможных',
    'medals.locked':       'Ещё не открыто',
    'medals.keep':         'продолжай учиться!',
    'medals.status.earned':'✅ Получена',
    'medals.status.locked':'Не получена',
    'medals.popup.status.earned': '✅ Получена',
    'medals.popup.status.locked': '🔒 Не получена',
    'medals.popup.how':    'Как получить:',
    'medals.popup.close':  'Закрыть',
    'medals.toast.label':  '🏅 Новая медаль!',

    /* ── Profile ── */
    'profile.title':       'Профиль',
    'profile.sub':         'Личные данные и настройки',
    'profile.student':     'Студент',
    'profile.level':       'Уровень',
    'profile.stat.tasks':  'Заданий',
    'profile.stat.modules':'Модулей',
    'profile.stat.medals': 'Медалей →',
    'profile.sec.notif':   'Уведомления',
    'profile.sec.settings':'Настройки',
    'profile.notif.remind':'Напоминания об уроках',
    'profile.notif.medals':'Медали',
    'profile.settings.personal': 'Личные данные',
    'profile.settings.personal.sub': 'Имя, email, аватар',
    'profile.settings.lang': 'Язык интерфейса',
    'profile.settings.progress': 'Прогресс обучения',
    'profile.logout':      'Выйти из аккаунта',
    'profile.progress.sub':'из',
    'profile.progress.tasks': 'заданий выполнено',

    /* ── Edit Profile Modal ── */
    'edit.title':          'Личные данные',
    'edit.upload':         'Загрузить фото',
    'edit.hint':           'JPG, PNG до 2 МБ',
    'edit.name.label':     'Имя',
    'edit.name.placeholder':'Введи имя',
    'edit.email.label':    'Email',
    'edit.cancel':         'Отмена',
    'edit.save':           'Сохранить',
    'edit.saving':         'Сохраняем...',
    'edit.success':        '✅ Данные сохранены!',
    'edit.err.name':       'Введи имя',
    'edit.err.size':       'Файл слишком большой (макс. 2 МБ)',

    /* ── Reminder Modal ── */
    'reminder.title':      '🔔 Напоминания об уроках',
    'reminder.enable':     'Включить напоминания',
    'reminder.time.label': 'Время напоминания',
    'reminder.days.label': 'Дни недели',
    'reminder.test':       '🔔 Проверить уведомление сейчас',
    'reminder.cancel':     'Отмена',
    'reminder.save':       'Сохранить',
    'reminder.off':        'Отключено',
    'reminder.daily':      'Ежедневно в',
    'reminder.days.mon':   'Пн',
    'reminder.days.tue':   'Вт',
    'reminder.days.wed':   'Ср',
    'reminder.days.thu':   'Чт',
    'reminder.days.fri':   'Пт',
    'reminder.days.sat':   'Сб',
    'reminder.days.sun':   'Вс',
    'reminder.notif.title':'BlenderFox — время учиться! 🦊',
    'reminder.notif.body': 'Привет! Сегодня в {time} — твой урок по Blender. Не пропусти!',
    'reminder.err.days':   '⚠️ Выберите хотя бы один день.',
    'reminder.hint.noapi': '⚠️ Ваш браузер не поддерживает уведомления.',
    'reminder.hint.file':  '⚠️ Страница открыта через <b>file://</b> — браузер блокирует уведомления. Откройте сайт через локальный сервер.',
    'reminder.hint.ok':    '✅ Уведомления разрешены. Нажмите «Проверить» чтобы убедиться.',
    'reminder.hint.denied':'🚫 Уведомления заблокированы. Нажмите на 🔒 в адресной строке → разрешите уведомления → перезагрузите страницу.',
    'reminder.hint.ask':   '⚡ Нажмите «Сохранить» — браузер запросит разрешение на уведомления.',
    'reminder.test.noapi': 'Ваш браузер не поддерживает уведомления.',
    'reminder.test.noperm':'Сначала разрешите уведомления и сохраните настройки.',

    /* ── Language Modal ── */
    'lang.title':          'Язык интерфейса',
    'lang.cancel':         'Отмена',
    'lang.save':           'Применить',
  },

  kz: {
    /* ── Sidebar ── */
    'nav.home':            'Басты бет',
    'nav.tasks':           'Модульдер бойынша тапсырмалар',
    'nav.saved':           'Сақталған жұмыстар',
    'nav.medals':          'Медальдар',
    'nav.profile':         'Профиль',
    'nav.sec.main':        'Басты бет',
    'nav.sec.learning':    'Оқу',
    'nav.sec.achievements':'Жетістіктер',
    'nav.sec.account':     'Аккаунт',
    'sidebar.brand.sub':   '3D-оқыту платформасы',
    'sidebar.level':       'Деңгей',

    /* ── Home ── */
    'home.title':          'Қош келдіңіз',
    'home.sub':            'Оқуды жалғастыр — әр сабақ сені жақсартады',
    'home.banner.title':   'BlenderFox-тан сәлем!',
    'home.banner.sub':     'Бүгін керемет нәрсе жасауға жақсы күн.\nТапсырманы таңда және қазір бастай бер!',
    'home.banner.btn':     'Тапсырмаларға өту →',
    'home.stat.done':      'Орындалған тапсырмалар',
    'home.stat.of':        'ішінен',
    'home.stat.tasks':     'тапсырма',
    'home.stat.modules':   'Өтілген модульдер',
    'home.stat.of4':       '4 модульден',
    'home.stat.medals':    'Алынған медальдар',
    'home.stat.see':       'Барлығын көру →',
    'home.modules.title':  'Курс модульдері',
    'home.module.done':    'тапсырма орындалды',

    /* ── Tasks ── */
    'tasks.title':         'Модульдер бойынша тапсырмалар',
    'tasks.sub':           'Нұсқаулықты ашу үшін тапсырмаға басыңыз',
    'task.panel.back':     'Артқа',
    'task.panel.title':    'Тапсырма',
    'task.panel.steps':    '📋 Нұсқаулық',
    'task.btn.start':      'Тапсырманы бастау →',
    'task.btn.done':       '✅ Тапсырма орындалды',
    'task.btn.complete':   'Орындалды деп белгілеу ✓',

    /* ── Saved ── */
    'saved.title':         'Сақталған жұмыстар',
    'saved.sub':           'Әр тапсырма бойынша жұмыстарың',
    'saved.add':           'Жұмыс қосу',
    'saved.works.1':       'жұмыс',
    'saved.works.2':       'жұмыс',
    'saved.works.5':       'жұмыс',
    'saved.prompt':        'Жұмыс атауы',
    'saved.toast.saving':  '💾 Сақталуда...',
    'saved.toast.saved':   '✅ Жұмыс сақталды!',
    'saved.toast.local':   '⚠️ Жергілікті сақталды',

    /* ── Add Work Modal ── */
    'saved.modal.title':            'Жұмыс қосу',
    'saved.modal.photo.hint':       'Жұмыс фотосын қосу үшін басыңыз',
    'saved.modal.photo.toobig':     'Файл тым үлкен (макс. 10 МБ)',
    'saved.modal.photo.err':        'Суретті оқу мүмкін болмады',
    'saved.modal.name.label':       'Жұмыс атауы',
    'saved.modal.name.placeholder': 'Мысалы: Менің алғашқы кубым',
    'saved.modal.err.name':         'Жұмыс атауын енгізіңіз',

    /* ── Medals ── */
    'medals.title':        '🏅 Медальдар',
    'medals.sub':          'Қалай алуға болатынын білу үшін медальға басыңыз',
    'medals.earned':       'Алынған медальдар',
    'medals.of':           'ішінен',
    'medals.possible':     'мүмкін',
    'medals.locked':       'Әлі ашылмаған',
    'medals.keep':         'оқуды жалғастыр!',
    'medals.status.earned':'✅ Алынды',
    'medals.status.locked':'Алынбаған',
    'medals.popup.status.earned': '✅ Алынды',
    'medals.popup.status.locked': '🔒 Алынбаған',
    'medals.popup.how':    'Қалай алуға болады:',
    'medals.popup.close':  'Жабу',
    'medals.toast.label':  '🏅 Жаңа медаль!',

    /* ── Profile ── */
    'profile.title':       'Профиль',
    'profile.sub':         'Жеке деректер мен баптаулар',
    'profile.student':     'Студент',
    'profile.level':       'Деңгей',
    'profile.stat.tasks':  'Тапсырмалар',
    'profile.stat.modules':'Модульдер',
    'profile.stat.medals': 'Медальдар →',
    'profile.sec.notif':   'Хабарландырулар',
    'profile.sec.settings':'Баптаулар',
    'profile.notif.remind':'Сабақ еске салғыштары',
    'profile.notif.medals':'Медальдар',
    'profile.settings.personal': 'Жеке деректер',
    'profile.settings.personal.sub': 'Аты, email, аватар',
    'profile.settings.lang': 'Интерфейс тілі',
    'profile.settings.progress': 'Оқу үдерісі',
    'profile.logout':      'Аккаунттан шығу',
    'profile.progress.sub':'ішінен',
    'profile.progress.tasks': 'тапсырма орындалды',

    /* ── Edit Profile Modal ── */
    'edit.title':          'Жеке деректер',
    'edit.upload':         'Фото жүктеу',
    'edit.hint':           'JPG, PNG 2 МБ дейін',
    'edit.name.label':     'Аты',
    'edit.name.placeholder':'Атыңды енгіз',
    'edit.email.label':    'Email',
    'edit.cancel':         'Болдырмау',
    'edit.save':           'Сақтау',
    'edit.saving':         'Сақталуда...',
    'edit.success':        '✅ Деректер сақталды!',
    'edit.err.name':       'Атыңды енгіз',
    'edit.err.size':       'Файл тым үлкен (макс. 2 МБ)',

    /* ── Reminder Modal ── */
    'reminder.title':      '🔔 Сабақ еске салғыштары',
    'reminder.enable':     'Еске салғыштарды қосу',
    'reminder.time.label': 'Еске салу уақыты',
    'reminder.days.label': 'Апта күндері',
    'reminder.test':       '🔔 Хабарландыруды қазір тексеру',
    'reminder.cancel':     'Болдырмау',
    'reminder.save':       'Сақтау',
    'reminder.off':        'Өшірілген',
    'reminder.daily':      'Күн сайын',
    'reminder.days.mon':   'Дс',
    'reminder.days.tue':   'Сс',
    'reminder.days.wed':   'Ср',
    'reminder.days.thu':   'Бс',
    'reminder.days.fri':   'Жм',
    'reminder.days.sat':   'Сб',
    'reminder.days.sun':   'Жс',
    'reminder.notif.title':'BlenderFox — оқу уақыты! 🦊',
    'reminder.notif.body': 'Сәлем! Бүгін {time} — Blender сабағың. Жіберіп алма!',
    'reminder.err.days':   '⚠️ Кем дегенде бір күн таңдаңыз.',
    'reminder.hint.noapi': '⚠️ Браузеріңіз хабарландыруларды қолдамайды.',
    'reminder.hint.file':  '⚠️ Бет <b>file://</b> арқылы ашылған — браузер хабарландыруларды блоктайды. Сайтты жергілікті сервер арқылы ашыңыз.',
    'reminder.hint.ok':    '✅ Хабарландырулар рұқсат етілген.',
    'reminder.hint.denied':'🚫 Хабарландырулар блокталған. Мекенжай жолындағы 🔒 → рұқсат беру → бетті жаңарту.',
    'reminder.hint.ask':   '⚡ «Сақтау» батырмасын басыңыз — браузер рұқсат сұрайды.',
    'reminder.test.noapi': 'Браузеріңіз хабарландыруларды қолдамайды.',
    'reminder.test.noperm':'Алдымен хабарландыруларға рұқсат беріп, баптауларды сақтаңыз.',

    /* ── Language Modal ── */
    'lang.title':          'Интерфейс тілі',
    'lang.cancel':         'Болдырмау',
    'lang.save':           'Қолдану',
  }
};

/* ── Текущий язык ── */
const LANG_KEY = 'bf_lang';

function getLang() {
  return localStorage.getItem(LANG_KEY) || 'ru';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

/**
 * Получить перевод по ключу.
 * t('home.title') → 'Главная' / 'Басты бет'
 */
function t(key, vars) {
  const lang = getLang();
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['ru'];
  let str = dict[key] ?? TRANSLATIONS['ru'][key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v);
    });
  }
  return str;
}

/**
 * Применить переводы ко всем элементам с data-i18n на странице.
 * Вызывается один раз при загрузке.
 */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  /* Обновить title страницы */
  const titleMap = {
    'home.html':    'BlenderFox — ' + t('nav.home'),
    'tasks.html':   'BlenderFox — ' + t('nav.tasks'),
    'saved.html':   'BlenderFox — ' + t('nav.saved'),
    'medals.html':  'BlenderFox — ' + t('nav.medals'),
    'profile.html': 'BlenderFox — ' + t('nav.profile'),
  };
  const page = location.pathname.split('/').pop();
  if (titleMap[page]) document.title = titleMap[page];
}
