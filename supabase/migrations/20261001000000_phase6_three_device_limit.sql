create or replace function public.enforce_user_device_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_device_count integer;
begin
  if new.revoked_at is null then
    perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));

    select count(*)
      into active_device_count
      from public.user_devices
     where user_id = new.user_id
       and revoked_at is null
       and id <> new.id;

    if active_device_count >= 3 then
      raise exception 'A maximum of three active devices is allowed.' using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$$;