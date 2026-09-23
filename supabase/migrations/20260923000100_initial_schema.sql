create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  horizon_years smallint check (horizon_years is null or horizon_years between 1 and 100),
  target_date date,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.roadmap_years (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  year smallint not null check (year between 2000 and 2200),
  title text not null,
  objective text,
  status text not null default 'planned' check (status in ('planned', 'active', 'completed', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, year)
);

create table public.roadmap_phases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  roadmap_year_id uuid not null references public.roadmap_years(id) on delete cascade,
  title text not null,
  objective text,
  sort_order integer not null default 0 check (sort_order >= 0),
  status text not null default 'planned' check (status in ('planned', 'active', 'completed', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.roadmap_months (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  roadmap_phase_id uuid not null references public.roadmap_phases(id) on delete cascade,
  month_start date not null,
  title text not null,
  objective text,
  status text not null default 'planned' check (status in ('planned', 'active', 'completed', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, roadmap_phase_id, month_start)
);

create table public.roadmap_weeks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  roadmap_month_id uuid not null references public.roadmap_months(id) on delete cascade,
  week_start date not null,
  week_end date,
  objective text,
  status text not null default 'planned' check (status in ('planned', 'active', 'completed', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, roadmap_month_id, week_start),
  check (week_end is null or week_end >= week_start)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  roadmap_week_id uuid references public.roadmap_weeks(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'inbox' check (status in ('inbox', 'planned', 'in_progress', 'completed', 'cancelled')),
  priority smallint not null default 3 check (priority between 1 and 5),
  due_on date,
  scheduled_for date,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.task_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  completed_on date not null,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, task_id, completed_on)
);

create table public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_date date not null,
  wins text,
  blockers text,
  energy smallint check (energy is null or energy between 1 and 10),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, report_date)
);

create table public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  summary text,
  lessons text,
  next_focus text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, week_start)
);

create table public.business_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_date date not null,
  name text not null,
  value numeric not null,
  unit text,
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, metric_date, name)
);

create table public.experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  hypothesis text,
  status text not null default 'planned' check (status in ('planned', 'running', 'completed', 'cancelled')),
  started_on date,
  ended_on date,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ended_on is null or started_on is null or ended_on >= started_on)
);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  due_on date,
  achieved_on date,
  status text not null default 'planned' check (status in ('planned', 'achieved', 'missed', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  category text,
  tags text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.motivation_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  kind text not null default 'note' check (kind in ('note', 'principle', 'reminder', 'recovery')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cadence text not null default 'daily' check (cadence in ('daily', 'weekly', 'monthly', 'one_time')),
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create table public.app_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  timezone text not null default 'UTC',
  settings jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index roadmap_phases_year_id_idx on public.roadmap_phases (roadmap_year_id);
create index roadmap_months_phase_id_idx on public.roadmap_months (roadmap_phase_id);
create index roadmap_weeks_month_id_idx on public.roadmap_weeks (roadmap_month_id);
create index tasks_user_status_idx on public.tasks (user_id, status);
create index tasks_user_due_on_idx on public.tasks (user_id, due_on);
create index task_completions_user_date_idx on public.task_completions (user_id, completed_on);
create index business_metrics_user_date_idx on public.business_metrics (user_id, metric_date);
create index activity_logs_user_created_at_idx on public.activity_logs (user_id, created_at desc);
create index knowledge_items_user_category_idx on public.knowledge_items (user_id, category);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger goals_set_updated_at before update on public.goals
for each row execute function public.set_updated_at();
create trigger roadmap_years_set_updated_at before update on public.roadmap_years
for each row execute function public.set_updated_at();
create trigger roadmap_phases_set_updated_at before update on public.roadmap_phases
for each row execute function public.set_updated_at();
create trigger roadmap_months_set_updated_at before update on public.roadmap_months
for each row execute function public.set_updated_at();
create trigger roadmap_weeks_set_updated_at before update on public.roadmap_weeks
for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks
for each row execute function public.set_updated_at();
create trigger daily_reports_set_updated_at before update on public.daily_reports
for each row execute function public.set_updated_at();
create trigger weekly_reviews_set_updated_at before update on public.weekly_reviews
for each row execute function public.set_updated_at();
create trigger business_metrics_set_updated_at before update on public.business_metrics
for each row execute function public.set_updated_at();
create trigger experiments_set_updated_at before update on public.experiments
for each row execute function public.set_updated_at();
create trigger milestones_set_updated_at before update on public.milestones
for each row execute function public.set_updated_at();
create trigger knowledge_items_set_updated_at before update on public.knowledge_items
for each row execute function public.set_updated_at();
create trigger motivation_items_set_updated_at before update on public.motivation_items
for each row execute function public.set_updated_at();
create trigger commitments_set_updated_at before update on public.commitments
for each row execute function public.set_updated_at();
create trigger app_settings_set_updated_at before update on public.app_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.roadmap_years enable row level security;
alter table public.roadmap_phases enable row level security;
alter table public.roadmap_months enable row level security;
alter table public.roadmap_weeks enable row level security;
alter table public.tasks enable row level security;
alter table public.task_completions enable row level security;
alter table public.daily_reports enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.business_metrics enable row level security;
alter table public.experiments enable row level security;
alter table public.milestones enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.motivation_items enable row level security;
alter table public.commitments enable row level security;
alter table public.activity_logs enable row level security;
alter table public.app_settings enable row level security;

create policy "profiles owner access" on public.profiles
for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "goals owner access" on public.goals
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "roadmap years owner access" on public.roadmap_years
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "roadmap phases owner access" on public.roadmap_phases
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "roadmap months owner access" on public.roadmap_months
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "roadmap weeks owner access" on public.roadmap_weeks
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks owner access" on public.tasks
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "task completions owner access" on public.task_completions
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily reports owner access" on public.daily_reports
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "weekly reviews owner access" on public.weekly_reviews
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "business metrics owner access" on public.business_metrics
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "experiments owner access" on public.experiments
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "milestones owner access" on public.milestones
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "knowledge items owner access" on public.knowledge_items
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "motivation items owner access" on public.motivation_items
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "commitments owner access" on public.commitments
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "activity logs owner access" on public.activity_logs
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "app settings owner access" on public.app_settings
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
