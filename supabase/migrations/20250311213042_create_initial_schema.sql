-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create posts table
create table if not exists posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table posts enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone"
on profiles for select
to authenticated, anon
using (true);

create policy "Users can update their own profile"
on profiles for update
to authenticated
using (auth.uid() = id);

-- Create policies for posts
create policy "Posts are viewable by everyone"
on posts for select
to authenticated, anon
using (true);

create policy "Users can create their own posts"
on posts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own posts"
on posts for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own posts"
on posts for delete
to authenticated
using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

-- Trigger to create a profile for each new user
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 