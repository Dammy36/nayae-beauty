-- Marks the most recently created Auth user as an admin. Avoids
-- retyping an email address (and risking a typo/case mismatch) - since
-- there's only meant to be one admin account, this just grabs whichever
-- one you created most recently in Authentication -> Users.
insert into admins (id, email)
select id, email from auth.users order by created_at desc limit 1
on conflict (id) do nothing;

-- Confirms it worked - this should show exactly one row with your email.
select * from admins;
