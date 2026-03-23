-- 给 commissions 表的 order_id 加唯一约束，防止重复分佣
ALTER TABLE commissions ADD CONSTRAINT unique_order UNIQUE (order_id);
