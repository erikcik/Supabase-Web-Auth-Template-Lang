-- Emergency fix for OAuth sign-in issues

-- Drop the existing trigger 
drop trigger if exists on_auth_user_created on auth.users;

-- Simplify the function to a basic implementation that works reliably
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Simply insert the user ID
  insert into public.profiles (id)
  values (new.id);
  
  -- For email users, update with the username if provided
  if new.raw_user_meta_data->>'username' is not null then
    update public.profiles
    set username = new.raw_user_meta_data->>'username'
    where id = new.id;
  end if;
  
  return new;
end;
$$;

-- Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Make sure username can be NULL
alter table public.profiles alter column username drop not null;
