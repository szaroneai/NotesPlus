-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Lawyers/Staff)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role text check (role in ('admin', 'lawyer', 'staff')) default 'lawyer',
  settings jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
-- Allow public read access for development
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. CLIENTS
create table clients (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text,
  phone text,
  ai_context_note text,
  total_cases integer default 0,
  status text check (status in ('active', 'archived')) default 'active',
  user_id uuid references profiles(id)
);

alter table clients enable row level security;
-- Allow public read/write access for development
create policy "Enable read access for all users" on clients for select using (true);
create policy "Enable insert access for all users" on clients for insert with check (true);
create policy "Enable update access for all users" on clients for update using (true);
create policy "Enable delete access for all users" on clients for delete using (true);

-- 3. LEADS (Unified Table)
create table leads (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Contact Info
  full_name text,
  phone text,
  email text,
  
  -- Classification & Status
  type text check (type in ('inbound_missed', 'outbound', 'web_form', 'manual')) default 'manual',
  status text check (status in ('new', 'in_progress', 'attempted', 'contacted', 'converted', 'lost', 'archived', 'missed')) default 'new',
  source text,
  
  -- Tracking
  attempts_count integer default 0,
  last_attempt_at timestamp with time zone,
  next_contact_date timestamp with time zone,
  
  -- Interaction Details (from latest call/interaction)
  call_duration integer,
  call_outcome text,
  transcription text,
  recording_url text,
  call_summary text,
  
  -- Context
  notes text,
  ai_score integer,
  ai_summary text,
  ai_sentiment text,
  ai_urgency text,
  
  -- Relations
  assigned_to uuid references profiles(id),
  converted_client_id uuid references clients(id)
);

alter table leads enable row level security;
-- Allow public read/write access for development
create policy "Enable read access for all users" on leads for select using (true);
create policy "Enable insert access for all users" on leads for insert with check (true);
create policy "Enable update access for all users" on leads for update using (true);
create policy "Enable delete access for all users" on leads for delete using (true);

-- 4. REMOVED OLD TABLES (leads_to_call, leads_called, missed_calls)
-- Keeping section numbers aligned for minimal diff or just removing them.


-- 6. CASES (Sprawy)
create table cases (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  client_id uuid references clients(id),
  status text check (status in ('active', 'pending', 'closed')) default 'active',
  court text,
  signature text,
  next_hearing timestamp with time zone,
  notes text,
  stage text,
  judge text,
  assigned_lawyer uuid references profiles(id)
);

alter table cases enable row level security;
-- Allow public read/write access for development
create policy "Enable read access for all users" on cases for select using (true);
create policy "Enable insert access for all users" on cases for insert with check (true);
create policy "Enable update access for all users" on cases for update using (true);
create policy "Enable delete access for all users" on cases for delete using (true);

-- 7. CALENDAR EVENTS
create table calendar_events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  type text check (type in ('hearing', 'deadline', 'meeting')),
  description text,
  location text,
  client_id uuid references clients(id),
  case_id uuid references cases(id),
  lawyer_id uuid references profiles(id)
);

alter table calendar_events enable row level security;
-- Allow public read/write access for development
create policy "Enable read access for all users" on calendar_events for select using (true);
create policy "Enable insert access for all users" on calendar_events for insert with check (true);
create policy "Enable update access for all users" on calendar_events for update using (true);
create policy "Enable delete access for all users" on calendar_events for delete using (true);

-- 8. DOCUMENTS
create table documents (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  type text check (type in ('pdf', 'docx', 'image', 'other')),
  size text,
  url text,
  category text check (category in ('Sądowe', 'Administracyjne', 'Finansowe', 'Inne')),
  client_id uuid references clients(id),
  case_id uuid references cases(id),
  uploaded_by uuid references profiles(id)
);

alter table documents enable row level security;
-- Allow public read/write access for development
create policy "Enable read access for all users" on documents for select using (true);
create policy "Enable insert access for all users" on documents for insert with check (true);
create policy "Enable update access for all users" on documents for update using (true);
create policy "Enable delete access for all users" on documents for delete using (true);

-- 9. CLIENT NOTES
create table client_notes (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references clients(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author text default 'Ty'
);

alter table client_notes enable row level security;
-- Allow public read/write access for development
create policy "Enable read access for all users" on client_notes for select using (true);
create policy "Enable insert access for all users" on client_notes for insert with check (true);
create policy "Enable update access for all users" on client_notes for update using (true);
create policy "Enable delete access for all users" on client_notes for delete using (true);
