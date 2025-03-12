-- This migration modifies the handle_new_user() function to prevent auto-generating 
-- usernames for OAuth users, ensuring they go through the username selection process.

-- First, alter the profiles table to allow NULL usernames
alter table public.profiles alter column username drop not null;

-- Drop the existing trigger first to avoid conflicts
drop trigger if exists on_auth_user_created on auth.users;

-- Update the function to handle OAuth users differently
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  is_oauth_user boolean;
begin
  -- Check if the user is an OAuth user by examining the provider in app_metadata
  is_oauth_user := new.app_metadata->>'provider' IN ('google', 'github', 'facebook', 'twitter', 'apple', 'azure', 'bitbucket', 'discord', 'gitlab', 'linkedin', 'notion', 'slack', 'spotify', 'twitch', 'workos');
  
  -- For OAuth users, create the profile row WITHOUT a username
  -- For email/password users, use the username from metadata as before
  if is_oauth_user then
    -- Insert without a username, forcing the OAuth username prompt
    insert into public.profiles (id)
    values (new.id);
    
    -- Log the OAuth user creation for debugging
    insert into public.logs (event, payload)
    values ('oauth_user_created', json_build_object('user_id', new.id, 'provider', new.app_metadata->>'provider'))
    on conflict do nothing;
  else
    -- For regular users, keep the existing behavior
    insert into public.profiles (id, username)
    values (new.id, new.raw_user_meta_data->>'username');
  end if;
  
  return new;
end;
$$;

-- Create logs table for debugging if it doesn't exist
create table if not exists public.logs (
  id bigint generated always as identity primary key,
  event text not null,
  payload jsonb,
  created_at timestamptz default now()
);

-- Add comment to explain the logs table
comment on table public.logs is 'Debug logs for tracking auth and user-related events';

-- Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Reset the usernames for users with auto-generated usernames
update public.profiles 
set username = NULL
where username LIKE 'user_%';

-- Add RLS policies for the logs table
alter table public.logs enable row level security;

-- Only allow authenticated users to select logs, and only admins to insert/update
create policy "Admins can manage logs"
on public.logs
for all
to authenticated
using (auth.jwt()->>'role' = 'admin');
