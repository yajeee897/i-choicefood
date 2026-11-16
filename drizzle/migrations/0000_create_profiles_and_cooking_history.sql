CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (char_length(trim(display_name)) BETWEEN 1 AND 60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    left(
      COALESCE(
        NULLIF(trim(NEW.raw_user_meta_data ->> 'display_name'), ''),
        NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''),
        NULLIF(trim(NEW.raw_user_meta_data ->> 'name'), ''),
        NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
        'Cook'
      ),
      60
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.cooking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_image TEXT NOT NULL DEFAULT '',
  servings INTEGER NOT NULL CHECK (servings BETWEEN 1 AND 100),
  estimated_min_minutes INTEGER NOT NULL CHECK (estimated_min_minutes > 0),
  estimated_max_minutes INTEGER NOT NULL CHECK (estimated_max_minutes >= estimated_min_minutes),
  cooked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status = 'Completed'),
  completion_key UUID NOT NULL,
  UNIQUE (user_id, completion_key)
);

GRANT SELECT, INSERT, DELETE ON public.cooking_history TO authenticated;
GRANT ALL ON public.cooking_history TO service_role;

ALTER TABLE public.cooking_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own cooking history"
ON public.cooking_history FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own cooking history"
ON public.cooking_history FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can clear their own cooking history"
ON public.cooking_history FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX cooking_history_user_recent_idx
ON public.cooking_history (user_id, cooked_at DESC);