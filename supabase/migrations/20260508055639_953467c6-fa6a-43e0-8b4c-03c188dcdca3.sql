
-- ========== Enums + roles ==========
create type public.app_role as enum ('project_manager','salesperson','production','client');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role in ('project_manager','salesperson','production')
  )
$$;

create policy "Users see own roles" on public.user_roles for select
  using (auth.uid() = user_id or public.is_staff(auth.uid()));

-- ========== Profiles ==========
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text,
  avatar text default '',
  phone text default '',
  department text default '',
  joined_date text default '',
  project_id text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "View own profile" on public.profiles for select using (auth.uid() = id);
create policy "Staff view all profiles" on public.profiles for select using (public.is_staff(auth.uid()));
create policy "Update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Staff update profiles" on public.profiles for update using (public.is_staff(auth.uid()));
create policy "Insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- ========== Auto-create profile + role on signup ==========
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  _role public.app_role;
begin
  insert into public.profiles (id, name, email, avatar, phone, department, joined_date, project_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar', upper(substring(coalesce(new.raw_user_meta_data->>'name', new.email) from 1 for 2))),
    coalesce(new.raw_user_meta_data->>'phone',''),
    coalesce(new.raw_user_meta_data->>'department',''),
    coalesce(new.raw_user_meta_data->>'joined_date',''),
    new.raw_user_meta_data->>'project_id'
  )
  on conflict (id) do nothing;

  _role := coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'client');
  insert into public.user_roles (user_id, role) values (new.id, _role)
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ========== Leads ==========
create table public.leads (
  id text primary key,
  project_id text,
  name text not null,
  email text not null,
  phone text not null,
  source text not null default 'Website Form',
  service_interest jsonb not null default '[]'::jsonb,
  status text not null default 'New Lead',
  assigned_to text,
  notes text default '',
  created_at_text text default '',
  last_contact text,
  ip_address text default '0.0.0.0',
  location text default 'Unknown',
  chat_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;
create policy "Staff read leads" on public.leads for select using (public.is_staff(auth.uid()));
create policy "Staff write leads" on public.leads for all using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ========== Projects ==========
create table public.projects (
  id text primary key,
  client_user_id uuid references auth.users(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_id_text text,
  book_title text not null,
  genre text not null default '',
  assigned_manager text default '',
  assigned_production jsonb not null default '[]'::jsonb,
  start_date text default '',
  estimated_completion text default '',
  total_value numeric not null default 0,
  amount_paid numeric not null default 0,
  outstanding numeric not null default 0,
  health text not null default 'On Track',
  stages jsonb not null default '[]'::jsonb,
  invoices jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  internal_notes jsonb not null default '[]'::jsonb,
  messages jsonb not null default '[]'::jsonb,
  nda_signed boolean not null default false,
  nda_signed_at text,
  nda_signed_by text,
  contract_signed boolean not null default false,
  contract_signed_at text,
  contract_signed_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "Staff read projects" on public.projects for select using (public.is_staff(auth.uid()));
create policy "Staff write projects" on public.projects for all using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Client reads own project" on public.projects for select using (auth.uid() = client_user_id);
create policy "Client updates own project messages" on public.projects for update using (auth.uid() = client_user_id);

-- ========== Portal files ==========
create table public.portal_files (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects(id) on delete cascade,
  name text not null,
  category text not null default 'Other',
  uploaded_by text not null default 'Client',
  size text default '',
  storage_path text,
  created_at timestamptz not null default now()
);
alter table public.portal_files enable row level security;
create policy "Staff manage files" on public.portal_files for all using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Client reads own files" on public.portal_files for select using (
  exists (select 1 from public.projects p where p.id = portal_files.project_id and p.client_user_id = auth.uid())
);
create policy "Client uploads own files" on public.portal_files for insert with check (
  exists (select 1 from public.projects p where p.id = portal_files.project_id and p.client_user_id = auth.uid())
);

-- ========== CRM notifications ==========
create table public.crm_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  message text not null,
  link text,
  target_roles jsonb not null default '[]'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.crm_notifications enable row level security;
create policy "Staff read crm notifs" on public.crm_notifications for select using (public.is_staff(auth.uid()));
create policy "Staff write crm notifs" on public.crm_notifications for all using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
-- Anonymous visitors create new_chat / visitor notifications from public site
create policy "Public can insert visitor notifs" on public.crm_notifications for insert
  with check (type in ('visitor','new_chat','new_lead'));

-- ========== Portal notifications ==========
create table public.portal_notifications (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects(id) on delete cascade,
  type text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.portal_notifications enable row level security;
create policy "Staff manage portal notifs" on public.portal_notifications for all using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Client reads own portal notifs" on public.portal_notifications for select using (
  exists (select 1 from public.projects p where p.id = portal_notifications.project_id and p.client_user_id = auth.uid())
);
create policy "Client updates own portal notifs" on public.portal_notifications for update using (
  exists (select 1 from public.projects p where p.id = portal_notifications.project_id and p.client_user_id = auth.uid())
);

-- ========== Realtime ==========
alter table public.leads replica identity full;
alter table public.projects replica identity full;
alter table public.portal_files replica identity full;
alter table public.crm_notifications replica identity full;
alter table public.portal_notifications replica identity full;
alter publication supabase_realtime add table public.leads;
alter publication supabase_realtime add table public.projects;
alter publication supabase_realtime add table public.portal_files;
alter publication supabase_realtime add table public.crm_notifications;
alter publication supabase_realtime add table public.portal_notifications;

-- ========== Storage bucket ==========
insert into storage.buckets (id, name, public) values ('project-files','project-files', false)
on conflict (id) do nothing;

create policy "Staff read project files" on storage.objects for select
  using (bucket_id = 'project-files' and public.is_staff(auth.uid()));
create policy "Staff write project files" on storage.objects for insert
  with check (bucket_id = 'project-files' and public.is_staff(auth.uid()));
create policy "Staff delete project files" on storage.objects for delete
  using (bucket_id = 'project-files' and public.is_staff(auth.uid()));
create policy "Client reads own project files" on storage.objects for select
  using (
    bucket_id = 'project-files' and exists (
      select 1 from public.projects p
      where p.client_user_id = auth.uid() and (storage.foldername(name))[1] = p.id
    )
  );
create policy "Client uploads own project files" on storage.objects for insert
  with check (
    bucket_id = 'project-files' and exists (
      select 1 from public.projects p
      where p.client_user_id = auth.uid() and (storage.foldername(name))[1] = p.id
    )
  );
