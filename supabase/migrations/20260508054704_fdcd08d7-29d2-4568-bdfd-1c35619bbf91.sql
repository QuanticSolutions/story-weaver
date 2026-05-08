
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  visitor_email text not null,
  visitor_phone text not null,
  location text default 'Unknown — Browser Session',
  ip_address text default '0.0.0.0',
  status text not null default 'Waiting',
  assigned_staff text,
  lead_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender text not null check (sender in ('visitor','staff')),
  staff_name text,
  message text not null,
  created_at timestamptz not null default now()
);

create index on public.chat_messages (session_id, created_at);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Public access (visitors are anonymous, staff use same anon key in CRM)
create policy "public read sessions" on public.chat_sessions for select using (true);
create policy "public insert sessions" on public.chat_sessions for insert with check (true);
create policy "public update sessions" on public.chat_sessions for update using (true);

create policy "public read messages" on public.chat_messages for select using (true);
create policy "public insert messages" on public.chat_messages for insert with check (true);

alter publication supabase_realtime add table public.chat_sessions;
alter publication supabase_realtime add table public.chat_messages;
alter table public.chat_sessions replica identity full;
alter table public.chat_messages replica identity full;
