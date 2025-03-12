import { createBrowserClient } from '@supabase/ssr';

export const createClientComponentClient = () => {
  return createBrowserClient(
    'https://eymvxbxxdmaifvmyrtjk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bXZ4Ynh4ZG1haWZ2bXlydGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTAwNDcsImV4cCI6MjA1NzI2NjA0N30.hq4yNYC4ENj1KISp3bmx7p73hd7sbv6Fie2DdglwvJU'
  );
}; 