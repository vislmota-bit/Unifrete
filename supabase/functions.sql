-- Helper function to increment XP atomically
create or replace function increment_xp(user_id uuid, amount integer)
returns void
language plpgsql
security definer
as $$
begin
  update usuarios
  set xp_total = xp_total + amount
  where id = user_id;
end;
$$;
