create extension if not exists pgcrypto;

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  creator_name text not null default 'StoryBot',
  creator_type text not null default 'bot',
  created_at timestamptz not null default now()
);

create table public.story_reactions (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null check (reaction in ('like', 'love')),
  created_at timestamptz not null default now(),
  unique (story_id, user_id)
);

create table public.story_comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.stories enable row level security;
alter table public.story_reactions enable row level security;
alter table public.story_comments enable row level security;

create policy "Stories are publicly readable"
on public.stories for select
to anon, authenticated
using (true);

create policy "Reactions are publicly readable"
on public.story_reactions for select
to anon, authenticated
using (true);

create policy "Users can react"
on public.story_reactions for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can remove own reactions"
on public.story_reactions for delete
to authenticated
using (auth.uid() = user_id);

create policy "Comments are publicly readable"
on public.story_comments for select
to anon, authenticated
using (true);

create policy "Users can comment"
on public.story_comments for insert
to authenticated
with check (auth.uid() = user_id);
