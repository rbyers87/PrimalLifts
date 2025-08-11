-- Drop existing triggers and functions
    DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
    DROP FUNCTION IF EXISTS public.update_profile_messages();
    DROP TRIGGER IF EXISTS on_message_insert ON public.messages;
    DROP FUNCTION IF EXISTS public.update_message_profile_name();

    -- Drop existing table
    DROP TABLE IF EXISTS public.messages;

    -- Create messages table
    CREATE TABLE IF NOT EXISTS public.messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      content text NOT NULL,
      created_at timestamptz DEFAULT now(),
      profile_name text,
      CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id)
    );

    -- Enable RLS
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

    -- Messages policies
    CREATE POLICY "Users can view all messages"
      ON public.messages FOR SELECT
      USING (true);

    CREATE POLICY "Users can create own messages"
      ON messages FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own messages"
      ON messages FOR DELETE
      USING (auth.uid() = user_id);

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
