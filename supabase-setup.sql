-- 在 Supabase 项目的 SQL Editor 里，把这整段粘贴进去执行一次就行

create table if not exists likes (
  card_id text primary key,
  count integer not null default 0
);

alter table likes enable row level security;

-- 允许任何人（包括没登录的访客）读取点赞数
create policy "public can read likes"
on likes for select
using (true);

-- 点赞的加一操作，包在一个函数里，避免"同时有两个人点赞"时数字算错
create or replace function increment_like(p_card_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  insert into likes (card_id, count)
  values (p_card_id, 1)
  on conflict (card_id)
  do update set count = likes.count + 1
  returning count into new_count;
  return new_count;
end;
$$;

-- 允许匿名访客调用这个加一函数
grant execute on function increment_like(text) to anon;
