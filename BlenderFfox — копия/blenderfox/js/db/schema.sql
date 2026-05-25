-- ══════════════════════════════════════
-- BLENDERFOX — ПОЛНАЯ СХЕМА БАЗЫ ДАННЫХ
-- Выполни в Supabase: Dashboard → SQL Editor
-- ══════════════════════════════════════

-- 1. Профили пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id         uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name       text NOT NULL,
  avatar     text,        -- первая буква имени (fallback)
  avatar_url text,        -- URL загруженного фото
  level      integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════
-- 2. СПРАВОЧНИК ЗАДАНИЙ (tasks)
--    Все 10 заданий с их id (0-9)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS tasks (
  task_id     integer PRIMARY KEY,   -- числовой id: 0, 1, 2 ... 9
  title       text NOT NULL,
  level       text,                  -- 'Начинающий', 'Средний', 'Углублённый', 'Профи'
  module_id   text,                  -- 'intro', 'materials', 'animation', 'render'
  module_name text,
  emoji       text,
  sort_order  integer
);

-- Заполняем справочник заданий
INSERT INTO tasks (task_id, title, level, module_id, module_name, emoji, sort_order)
VALUES
  (0, 'Знакомство с интерфейсом',   'Начинающий',  'intro',     'Введение в Blender',        '🖥️',  1),
  (1, 'Базовое моделирование',       'Начинающий',  'intro',     'Введение в Blender',        '🟢',  2),
  (2, 'Principled BSDF и шейдеры',   'Средний',     'materials', 'Материалы и внешний вид',   '🎨',  3),
  (3, 'Текстуры и UV-развёртка',     'Средний',     'materials', 'Материалы и внешний вид',   '🗺️',  4),
  (4, 'Ключевые кадры',              'Средний',     'animation', 'Анимация и риггинг',        '🎬',  5),
  (5, 'Риггинг персонажа',           'Средний',     'animation', 'Анимация и риггинг',        '🦴',  6),
  (6, 'Рендеринг в Cycles',          'Углублённый', 'render',    'Рендер и продвинутое',      '✨',  7),
  (7, 'Геометрические ноды',         'Профи',       'render',    'Рендер и продвинутое',      '⚡',  8),
  (8, 'Скульптинг',                  'Углублённый', 'render',    'Рендер и продвинутое',      '🗿',  9),
  (9, 'Compositor и пост-обработка', 'Профи',       'render',    'Рендер и продвинутое',      '🎞️', 10)
ON CONFLICT (task_id) DO NOTHING;

-- ══════════════════════════════════════
-- 3. ВЫПОЛНЕННЫЕ ЗАДАНИЯ (completed_tasks)
--    Факт выполнения задания пользователем
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS completed_tasks (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id      integer REFERENCES tasks(task_id) NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_id)   -- один пользователь не может выполнить одно задание дважды
);

-- ══════════════════════════════════════
-- 4. СПРАВОЧНИК МЕДАЛЕЙ (medal_definitions)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS medal_definitions (
  medal_id    text PRIMARY KEY,
  name        text NOT NULL,
  icon        text NOT NULL,
  description text,
  how_to_get  text,
  sort_order  integer
);

INSERT INTO medal_definitions (medal_id, name, icon, description, how_to_get, sort_order)
VALUES
  ('start',     'Первый шаг',      '🌱', 'Медаль за начало пути в 3D-моделировании.', 'Начни любое задание.',                                   1),
  ('lesson1',   'Первый урок',     '📖', 'Ты завершил свой первый урок!',              'Отметь любое задание как выполненное.',                  2),
  ('saver',     'Архивариус',      '💾', 'Ты сохранил свою первую работу.',            'Добавь работу в разделе "Сохранённые работы".',          3),
  ('module1',   'Старт дан',       '🚀', 'Ты завершил модуль "Введение в Blender".',   'Выполни все задания модуля "Введение в Blender".',       4),
  ('materials', 'Художник',        '🎨', 'Ты разобрался с материалами и шейдерами!',  'Выполни все задания модуля "Материалы и внешний вид".',  5),
  ('animator',  'Аниматор',        '🎬', 'Ты научился создавать анимацию!',            'Выполни все задания модуля "Анимация и риггинг".',       6),
  ('renderer',  'Рендеролог',      '✨', 'Ты освоил продвинутый рендеринг!',           'Выполни все задания модуля "Рендер и продвинутое".',     7),
  ('half',      'Полпути',         '🏃', 'Ты выполнил половину всех заданий!',         'Выполни 5 из 10 заданий.',                               8),
  ('all',       'Мастер Blender',  '🏆', 'Ты выполнил все задания платформы!',         'Выполни все 10 заданий.',                                9),
  ('week',      'Недельная серия', '🔥', 'Ты занимался 7 дней подряд!',                'Заходи на платформу 7 дней подряд.',                    10),
  ('speed',     'Спидраннер',      '⚡', 'Ты выполнил 3 задания за один день!',        'Выполни 3 задания в одной сессии.',                     11),
  ('detail',    'Перфекционист',   '🔬', 'Ты сохранил работу для каждого урока!',      'Добавь работы для всех 10 уроков.',                     12)
ON CONFLICT (medal_id) DO NOTHING;

-- ══════════════════════════════════════
-- 5. МЕДАЛИ ПОЛЬЗОВАТЕЛЕЙ (medals)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS medals (
  id        uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medal_id  text REFERENCES medal_definitions(medal_id) NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, medal_id)
);

-- ══════════════════════════════════════
-- 6. СОХРАНЁННЫЕ РАБОТЫ (saved_works)
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS saved_works (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id    integer REFERENCES tasks(task_id) NOT NULL,
  title      text NOT NULL,
  tag        text DEFAULT 'WIP',
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_tasks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE medal_definitions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE medals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_works        ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики
DROP POLICY IF EXISTS "own_profile_select"  ON profiles;
DROP POLICY IF EXISTS "own_profile_insert"  ON profiles;
DROP POLICY IF EXISTS "own_profile_update"  ON profiles;
DROP POLICY IF EXISTS "tasks_public"        ON tasks;
DROP POLICY IF EXISTS "own_completed"       ON completed_tasks;
DROP POLICY IF EXISTS "medal_defs_public"   ON medal_definitions;
DROP POLICY IF EXISTS "own_medals"          ON medals;
DROP POLICY IF EXISTS "own_saved"           ON saved_works;

-- profiles
CREATE POLICY "own_profile_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own_profile_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own_profile_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- tasks — публичное чтение (справочник)
CREATE POLICY "tasks_public" ON tasks FOR SELECT USING (true);

-- completed_tasks — каждый видит только свои
CREATE POLICY "own_completed" ON completed_tasks FOR ALL USING (auth.uid() = user_id);

-- medal_definitions — публичное чтение
CREATE POLICY "medal_defs_public" ON medal_definitions FOR SELECT USING (true);

-- medals — каждый видит только свои
CREATE POLICY "own_medals" ON medals FOR ALL USING (auth.uid() = user_id);

-- saved_works — каждый видит только свои
CREATE POLICY "own_saved" ON saved_works FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════
-- STORAGE: bucket для аватаров
-- ══════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Политика: каждый может загружать только свой аватар
DROP POLICY IF EXISTS "avatar_upload" ON storage.objects;
DROP POLICY IF EXISTS "avatar_public" ON storage.objects;

CREATE POLICY "avatar_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = split_part(name, '/', 2)  -- путь: avatars/{user_id}.ext
  );

CREATE POLICY "avatar_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Миграция: добавить avatar_url если колонки ещё нет
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- ══════════════════════════════════════
-- ТРИГГЕР: создаёт профиль при регистрации
-- ══════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar, level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 1)),
    1
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ══════════════════════════════════════
-- МИГРАЦИЯ: добавить image_url в saved_works
-- Выполни в Supabase → SQL Editor
-- ══════════════════════════════════════
ALTER TABLE saved_works ADD COLUMN IF NOT EXISTS image_url text;
