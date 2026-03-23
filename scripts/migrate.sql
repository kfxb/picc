-- PiCity database schema

CREATE TABLE IF NOT EXISTS posts (
  id          SERIAL PRIMARY KEY,
  kind        TEXT NOT NULL,
  kind_label  TEXT NOT NULL,
  kind_class  TEXT NOT NULL,
  title       TEXT NOT NULL,
  location    TEXT NOT NULL DEFAULT '',
  price       TEXT NOT NULL DEFAULT '',
  condition   TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT '审核中',
  views       INTEGER NOT NULL DEFAULT 0,
  pi_username TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  pi_username TEXT NOT NULL DEFAULT '匿名用户',
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buy_requests (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  pi_username TEXT NOT NULL,
  message     TEXT NOT NULL DEFAULT '',
  contact     TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial demo posts
INSERT INTO posts (id, kind, kind_label, kind_class, title, location, price, condition, description, status, views)
VALUES
  (901, 'secondhand', '二手', 'bg-teal-50 text-teal-700', '二手自行车出售，8成新，骑了两年',         '天河区', 'π 280',  '8成新',    '骑了两年，车况良好，适合上下班通勤',   '已发布', 88),
  (902, 'secondhand', '二手', 'bg-teal-50 text-teal-700', '旧书一批低价处理，涵盖小说/教材/杂志',     '越秀区', 'π 5/本', '7成新',    '各类书籍，看图下单，可打包优惠',       '已发布', 45),
  (903, 'secondhand', '求购', 'bg-blue-50 text-blue-700', '求购：戴森吹风机，九成新以上，价格合适即可', '天河区', '面议',   '9成新以上', '需要九成新以上，价格合适即可',         '已发布', 30)
ON CONFLICT (id) DO NOTHING;

-- Keep serial sequence beyond seeded IDs
SELECT setval('posts_id_seq', GREATEST(1000, (SELECT MAX(id) FROM posts)));
