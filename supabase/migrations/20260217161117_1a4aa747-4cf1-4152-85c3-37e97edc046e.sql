
-- Role enum
CREATE TYPE public.app_role AS ENUM ('student', 'faculty', 'admin');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  faculty_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Enrollments
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Concepts
CREATE TABLE public.concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  order_index INT DEFAULT 0
);
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;

-- Concept prerequisites
CREATE TABLE public.concept_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID REFERENCES public.concepts(id) ON DELETE CASCADE NOT NULL,
  prerequisite_id UUID REFERENCES public.concepts(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(concept_id, prerequisite_id)
);
ALTER TABLE public.concept_prerequisites ENABLE ROW LEVEL SECURITY;

-- Student mastery tracking
CREATE TABLE public.student_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  concept_id UUID REFERENCES public.concepts(id) ON DELETE CASCADE NOT NULL,
  mastery_score INT NOT NULL DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 100),
  misconception_flag BOOLEAN NOT NULL DEFAULT false,
  misconception_details TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, concept_id)
);
ALTER TABLE public.student_mastery ENABLE ROW LEVEL SECURITY;

-- Assessments
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'exam',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Assessment results
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score NUMERIC,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(assessment_id, student_id)
);
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- AI interactions log
CREATE TABLE public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id),
  mode TEXT NOT NULL DEFAULT 'general',
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  sources_used TEXT[] DEFAULT '{}',
  confidence_score NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

-- Integrity flags
CREATE TABLE public.integrity_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  details TEXT NOT NULL,
  interaction_id UUID REFERENCES public.ai_interactions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved BOOLEAN DEFAULT false
);
ALTER TABLE public.integrity_flags ENABLE ROW LEVEL SECURITY;

-- Accessibility preferences
CREATE TABLE public.accessibility_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  dyslexia_mode BOOLEAN DEFAULT false,
  font_scale NUMERIC DEFAULT 1.0,
  high_contrast BOOLEAN DEFAULT false
);
ALTER TABLE public.accessibility_preferences ENABLE ROW LEVEL SECURITY;

-- Auto-create profile + default student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  INSERT INTO public.accessibility_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_mastery_updated_at BEFORE UPDATE ON public.student_mastery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS POLICIES

-- Profiles: users see own, faculty/admin see all
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Faculty read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin read all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles: own role visible, admin can manage
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin read all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Courses: visible to all authenticated
CREATE POLICY "Authenticated read courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Faculty manage own courses" ON public.courses FOR ALL USING (auth.uid() = faculty_id);
CREATE POLICY "Admin manage all courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Enrollments
CREATE POLICY "Students see own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Faculty see course enrollments" ON public.enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND faculty_id = auth.uid())
);
CREATE POLICY "Admin see all enrollments" ON public.enrollments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Students enroll themselves" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Concepts: visible to enrolled students and course faculty
CREATE POLICY "Authenticated read concepts" ON public.concepts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Faculty manage concepts" ON public.concepts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND faculty_id = auth.uid())
);

-- Concept prerequisites
CREATE POLICY "Authenticated read prerequisites" ON public.concept_prerequisites FOR SELECT TO authenticated USING (true);

-- Student mastery
CREATE POLICY "Students see own mastery" ON public.student_mastery FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students update own mastery" ON public.student_mastery FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students modify own mastery" ON public.student_mastery FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Faculty see course mastery" ON public.student_mastery FOR SELECT USING (public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin see all mastery" ON public.student_mastery FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Assessments
CREATE POLICY "Authenticated read assessments" ON public.assessments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Faculty manage assessments" ON public.assessments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND faculty_id = auth.uid())
);

-- Assessment results
CREATE POLICY "Students see own results" ON public.assessment_results FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Faculty see course results" ON public.assessment_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.assessments a JOIN public.courses c ON a.course_id = c.id WHERE a.id = assessment_id AND c.faculty_id = auth.uid())
);

-- AI interactions
CREATE POLICY "Users see own interactions" ON public.ai_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own interactions" ON public.ai_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Faculty see all interactions" ON public.ai_interactions FOR SELECT USING (public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin see all interactions" ON public.ai_interactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Integrity flags
CREATE POLICY "Faculty see flags" ON public.integrity_flags FOR SELECT USING (public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Admin see flags" ON public.integrity_flags FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System create flags" ON public.integrity_flags FOR INSERT TO authenticated WITH CHECK (true);

-- Accessibility preferences
CREATE POLICY "Users manage own prefs" ON public.accessibility_preferences FOR ALL USING (auth.uid() = user_id);
