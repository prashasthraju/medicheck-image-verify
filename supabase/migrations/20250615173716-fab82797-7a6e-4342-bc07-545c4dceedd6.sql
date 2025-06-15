
-- 1. Create the public storage bucket if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('medicine-images', 'medicine-images', true)
on conflict (id) do nothing;

-- 2. Make all operations on objects in 'medicine-images' public (open to any user)
-- Select
create policy "Anyone can select objects" on storage.objects
  for select
  using (bucket_id = 'medicine-images');

-- Insert (upload)
create policy "Anyone can insert objects" on storage.objects
  for insert
  with check (bucket_id = 'medicine-images');

-- Update (overwrite)
create policy "Anyone can update objects" on storage.objects
  for update
  using (bucket_id = 'medicine-images');

-- Delete
create policy "Anyone can delete objects" on storage.objects
  for delete
  using (bucket_id = 'medicine-images');
