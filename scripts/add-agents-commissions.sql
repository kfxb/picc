-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 城市代理
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  city TEXT,
  commission_rate NUMERIC DEFAULT 0.05
);

-- 分佣记录
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  order_id TEXT,
  amount NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 商家绑定代理
ALTER TABLE posts ADD COLUMN IF NOT EXISTS agent_id uuid;
