
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');
CREATE TYPE public.service_type AS ENUM ('lab_space', 'workshop', 'fabrication', 'institutional');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rescheduled', 'rejected');
CREATE TYPE public.affiliation_type AS ENUM ('akamai', 'external');
CREATE TYPE public.workshop_category AS ENUM ('3d_design', 'electronics', 'programming', 'other');
CREATE TYPE public.institution_type AS ENUM ('school', 'university');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- workshops
CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category public.workshop_category NOT NULL DEFAULT 'other',
  age_min INT NOT NULL DEFAULT 8,
  age_max INT NOT NULL DEFAULT 18,
  duration_minutes INT NOT NULL DEFAULT 60,
  capacity INT NOT NULL DEFAULT 16,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- service_requests
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type public.service_type NOT NULL,
  status public.request_status NOT NULL DEFAULT 'pending',
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  affiliation public.affiliation_type NOT NULL,
  akamai_pillars TEXT[],
  requested_date DATE NOT NULL,
  attendees_count INT,
  external_attendees INT,
  purpose TEXT,
  duration_minutes INT,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE SET NULL,
  target_age_group TEXT,
  fabrication_description TEXT,
  fabrication_quantity INT,
  file_url TEXT,
  institution_name TEXT,
  institution_type public.institution_type,
  safety_agreed BOOLEAN NOT NULL DEFAULT false,
  waiver_agreed BOOLEAN NOT NULL DEFAULT false,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- T-15 validation trigger (immutable-safe, uses now())
CREATE OR REPLACE FUNCTION public.validate_request_t15()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.requested_date < (CURRENT_DATE + INTERVAL '15 days') THEN
    RAISE EXCEPTION 'Requested date must be at least 15 days in the future';
  END IF;
  IF NEW.safety_agreed IS NOT TRUE THEN
    RAISE EXCEPTION 'Safety agreement is required';
  END IF;
  IF NEW.service_type = 'lab_space' AND NEW.attendees_count IS NOT NULL AND NEW.attendees_count > 16 THEN
    RAISE EXCEPTION 'Lab capacity is limited to 16 attendees';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER service_requests_validate_insert
BEFORE INSERT ON public.service_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_request_t15();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER workshops_touch BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER service_requests_touch BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- settings
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.settings (key, value) VALUES ('notification_email', '"stem-costarica@akamai.com"'::jsonb);

-- Profile auto-create
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- profiles: users can read/update their own; admins can read all
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_roles: admin-only
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- workshops: public read non-archived; admin/staff full
CREATE POLICY "Public reads active workshops" ON public.workshops FOR SELECT USING (is_archived = false);
CREATE POLICY "Admins read all workshops" ON public.workshops FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins write workshops" ON public.workshops FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- service_requests: anyone (incl. anon) can insert; only admin/staff can select/update
CREATE POLICY "Public submit requests" ON public.service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view requests" ON public.service_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins update requests" ON public.service_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- settings: admin-only
CREATE POLICY "Admins read settings" ON public.settings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write settings" ON public.settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for fabrication files (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('fabrication-files', 'fabrication-files', false);

CREATE POLICY "Public upload fabrication files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fabrication-files');
CREATE POLICY "Admins read fabrication files" ON storage.objects FOR SELECT USING (bucket_id = 'fabrication-files' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff')));

-- Seed sample workshops
INSERT INTO public.workshops (title, description, category, age_min, age_max, duration_minutes, capacity) VALUES
('Intro to 3D Design', 'Hands-on introduction to parametric 3D modeling and printing fundamentals.', '3d_design', 10, 17, 120, 12),
('Electronics & Microcontrollers', 'Build interactive circuits with Arduino and learn the basics of embedded systems.', 'electronics', 12, 18, 150, 10),
('Creative Coding with Python', 'Programming foundations through generative art and small games.', 'programming', 11, 17, 120, 14);
