-- Ensure there's a policy for public viewing of posts
-- This migration ensures everyone can view all posts, including anonymous users

-- Check if the policy already exists
do $$
declare
  policy_exists boolean;
begin
  select exists(
    select 1 from pg_catalog.pg_policies
    where schemaname = 'public'
    and tablename = 'posts'
    and policyname = 'Posts are viewable by everyone'
  ) into policy_exists;

  if not policy_exists then
    -- Create the policy if it doesn't exist
    execute 'create policy "Posts are viewable by everyone" on posts for select to authenticated, anon using (true)';
  end if;
end
$$;

-- Add a comment to explain the policy
comment on policy "Posts are viewable by everyone" on posts is 
'Allows anyone (including non-logged-in users) to view posts';
