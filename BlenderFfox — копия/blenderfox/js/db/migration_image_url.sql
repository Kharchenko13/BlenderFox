-- ══════════════════════════════════════
-- ВЫПОЛНИ В SUPABASE: Dashboard → SQL Editor → New query → Run
-- Решает: new row violates row-level security policy for table "saved_works"
-- ══════════════════════════════════════

-- 1. Добавить колонку image_url
ALTER TABLE saved_works ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Пересоздать RLS-политику для saved_works с явными правами на все операции
DROP POLICY IF EXISTS "own_saved"        ON saved_works;
DROP POLICY IF EXISTS "own_saved_select" ON saved_works;
DROP POLICY IF EXISTS "own_saved_insert" ON saved_works;
DROP POLICY IF EXISTS "own_saved_update" ON saved_works;
DROP POLICY IF EXISTS "own_saved_delete" ON saved_works;

CREATE POLICY "own_saved_select" ON saved_works
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "own_saved_insert" ON saved_works
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_saved_update" ON saved_works
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "own_saved_delete" ON saved_works
  FOR DELETE USING (auth.uid() = user_id);
