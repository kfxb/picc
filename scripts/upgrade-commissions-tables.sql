-- 补代理申请表
CREATE TABLE IF NOT EXISTS agent_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  city TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 升级 commissions 表
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'agent';
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- 确保 posts 有 agent_id
ALTER TABLE posts ADD COLUMN IF NOT EXISTS agent_id UUID;
