-- F02 fix: drop the recursive "user reads housemates" policy.
--
-- The original policy did `using (household_id = (select household_id
-- from public.users where id = auth.uid()))`, which forces Postgres
-- to evaluate the same RLS-on-users when checking RLS-on-users. In
-- practice this returns empty rows for SELECT-self queries even
-- when the row exists, which broke the post-OTP redirect (the index
-- router saw the user as signed-out and bounced back to /sign-in).
--
-- "user reads self" still covers the only path F02 needs. F13
-- (Family / household members) will reintroduce housemate visibility
-- via a SECURITY DEFINER helper so the policy doesn't recurse.

drop policy if exists "user reads housemates" on public.users;
