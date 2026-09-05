-- ProjectPilot AI - PostgreSQL & Supabase Database Schema
-- Includes Row Level Security (RLS) policies and Role-Based Authorization

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  degree_branch TEXT DEFAULT 'Computer Science & Engineering',
  experience_level TEXT DEFAULT 'intermediate',
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  is_deactivated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Roles Table (Secured - Never populated by registration form)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')) DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  value_proposition TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_duration TEXT NOT NULL,
  estimated_weekly_effort INT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  innovation_score NUMERIC(3,1) NOT NULL,
  feasibility_score NUMERIC(3,1) NOT NULL,
  why_it_fits TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  target_users TEXT[] DEFAULT '{}',
  proposed_solution TEXT NOT NULL,
  unique_differentiator TEXT NOT NULL,
  mvp_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  future_scope JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  architecture_summary TEXT NOT NULL,
  data_hardware_requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
  risks JSONB NOT NULL DEFAULT '[]'::jsonb,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('draft', 'saved', 'in_progress', 'completed')) DEFAULT 'draft',
  progress_percentage INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 6. Helper Function: Check if User is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RLS Policies: Profiles
-- Students can read & update only their own profile
CREATE POLICY "Students manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read non-sensitive profile summaries
CREATE POLICY "Admins read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- 8. RLS Policies: User Roles
-- Users can read their own role
CREATE POLICY "Users read own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read user roles
CREATE POLICY "Admins read user roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin());

-- 9. RLS Policies: Projects
-- Students can CRUD only their own projects
CREATE POLICY "Students manage own projects"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view project metrics without secrets
CREATE POLICY "Admins view all projects"
  ON public.projects FOR SELECT
  USING (public.is_admin());

-- 10. Automatic Profile & Default Role Trigger on User Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Student User')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- CREATING THE FIRST ADMIN (Run in Supabase SQL Editor or Database CLI)
-- Replace 'admin_user_id_here' with the UUID of an existing registered user.
-- ============================================================================
-- UPDATE public.user_roles
-- SET role = 'admin'
-- WHERE user_id = 'YOUR_REGISTERED_USER_UUID_HERE';
