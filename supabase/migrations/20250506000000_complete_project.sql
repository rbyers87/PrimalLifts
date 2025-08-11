-- Drop existing triggers and functions
    DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
    DROP FUNCTION IF EXISTS public.update_profile_messages();
    DROP TRIGGER IF EXISTS on_message_insert ON public.messages;
    DROP FUNCTION IF EXISTS public.update_message_profile_name();

    -- Drop existing tables
    DROP TABLE IF EXISTS public.likes;
    DROP TABLE IF EXISTS public.user_preferences;
    DROP TABLE IF EXISTS public.app_settings;
    DROP TABLE IF EXISTS public.exercise_scores;
    DROP TABLE IF EXISTS public.workout_logs;
    DROP TABLE IF EXISTS public.workout_exercises;
    DROP TABLE IF EXISTS public.exercises;
    DROP TABLE IF EXISTS public.profiles;

    -- Create profiles table
    CREATE TABLE IF NOT EXISTS public.profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id),
      first_name text,
      last_name text,
      profile_name text UNIQUE,
      age integer,
      gender text,
      email text UNIQUE NOT NULL,
      avatar_url text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      birthday date,
      role text DEFAULT 'user'
    );

    -- Create workouts table
    CREATE TABLE IF NOT EXISTS public.workouts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      type text NOT NULL,
      created_by uuid REFERENCES public.profiles(id),
      scheduled_date date,
      is_wod boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Create exercises table
    CREATE TABLE IF NOT EXISTS public.exercises (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      category text,
      created_at timestamptz DEFAULT now()
    );

    -- Create workout_exercises table
    CREATE TABLE IF NOT EXISTS public.workout_exercises (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      workout_id uuid REFERENCES public.workouts(id) ON DELETE CASCADE,
      exercise_id uuid REFERENCES public.exercises(id),
      sets integer,
      reps integer,
      weight numeric,
      order_index integer,
      created_at timestamptz DEFAULT now()
    );

    -- Create workout_logs table
    CREATE TABLE IF NOT EXISTS public.workout_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES public.profiles(id),
      workout_id uuid REFERENCES public.workouts(id),
      completed_at timestamptz DEFAULT now(),
      notes text,
      score numeric,
      created_at timestamptz DEFAULT now()
    );

    -- Create exercise_scores table
    CREATE TABLE IF NOT EXISTS public.exercise_scores (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES public.profiles(id),
      workout_log_id uuid REFERENCES public.workout_logs(id),
      exercise_id uuid REFERENCES public.exercises(id),
      weight numeric,
      reps integer,
      distance numeric,
      time numeric,
      calories numeric,
      date timestamptz DEFAULT now(),
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.exercise_scores ENABLE ROW LEVEL SECURITY;

    -- Profiles policies
    CREATE POLICY "Public profiles are viewable by everyone"
      ON public.profiles FOR SELECT
      USING (true);

    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);

    -- Workouts policies
    CREATE POLICY "Workouts are viewable by everyone"
      ON public.workouts FOR SELECT
      USING (true);

    CREATE POLICY "Authenticated users can create workouts"
      ON public.workouts FOR INSERT
      WITH CHECK (auth.uid() = created_by);

    CREATE POLICY "Users can update own workouts"
      ON public.workouts FOR UPDATE
      USING (auth.uid() = created_by);

    -- Exercise policies
    CREATE POLICY "Exercises are viewable by everyone"
      ON public.exercises FOR SELECT
      USING (true);

    -- Workout exercises policies
    CREATE POLICY "Workout exercises are viewable by everyone"
      ON workout_exercises FOR SELECT
      USING (true);

    -- Workout logs policies
    CREATE POLICY "Users can view all workout logs"
      ON workout_logs FOR SELECT
      USING (true);

    CREATE POLICY "Users can create own workout logs"
      ON workout_logs FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Exercise scores policies
    CREATE POLICY "Users can view all exercise scores"
      ON exercise_scores FOR SELECT
      USING (true);

    CREATE POLICY "Users can create own exercise scores"
      ON exercise_scores FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own exercise scores"
      ON exercise_scores FOR UPDATE
      USING (auth.uid() = user_id);

    -- Create app_settings table
    CREATE TABLE IF NOT EXISTS public.app_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    -- Insert default welcome image URL
    INSERT INTO public.app_settings (key, value)
    VALUES ('welcome_image_url', 'https://res.cloudinary.com/dvmv00x0y/image/upload/v1718219988/workout-app/fitness_q0q09j.jpg')
    ON CONFLICT (key) DO NOTHING;

    -- Create user_preferences table
    CREATE TABLE IF NOT EXISTS public.user_preferences (
      user_id uuid PRIMARY KEY REFERENCES auth.users(id),
      icon_choice text
    );

    -- Enable RLS for user_preferences
    ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

    -- User preferences policies
    CREATE POLICY "Users can view their own preferences"
      ON public.user_preferences FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update their own preferences"
      ON user_preferences FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own preferences"
      ON user_preferences FOR INSERT
      USING (auth.uid() = user_id);

    -- Create likes table
    CREATE TABLE IF NOT EXISTS public.likes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id),
      profile_id uuid REFERENCES public.profiles(id),
      date timestamptz DEFAULT now()
    );

    -- Enable RLS for likes
    ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

    -- Likes policies
    CREATE POLICY "Users can insert likes"
      ON public.likes FOR INSERT
      WITH CHECK (auth.uid() <> profile_id);

    CREATE POLICY "Likes are viewable by everyone"
      ON public.likes FOR SELECT
      USING (true);

    -- Add likes count to workout_logs
    ALTER TABLE public.workout_logs
    ADD COLUMN likes int GENERATED ALWAYS AS (
      SELECT count(*)
      FROM public.likes
      WHERE likes.profile_id = workout_logs.user_id
    ) STORED;

    -- Add profile_name to messages table
    ALTER TABLE public.messages
    ADD COLUMN profile_name text;

    -- Function to update profile_name on messages table
    CREATE OR REPLACE FUNCTION public.update_message_profile_name()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Update profile_name in messages table when a new message is created
      NEW.profile_name := (SELECT profile_name FROM public.profiles WHERE profiles.id = NEW.user_id);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Trigger to execute the function on message insert
    CREATE TRIGGER on_message_insert
    BEFORE INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_message_profile_name();

    -- Function to update profile_name in messages table when profile is updated
    CREATE OR REPLACE FUNCTION public.update_profile_messages()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Update profile_name in messages table when a profile is updated
      UPDATE public.messages
      SET profile_name = NEW.profile_name
      WHERE user_id = NEW.id;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Trigger to execute the function on profile update
    CREATE TRIGGER on_profile_update
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_profile_messages();
