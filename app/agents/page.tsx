"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Agent {
  id: string;
  user_id: string;
  city: string;
  commission_rate: number;
}

interface Commission {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  created_at: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [userId, setUserId] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [agentsRes, commissionsRes] = await Promise.all([
        fetch("/api/agents/list"),
        fetch("/api/agents/commissions"),
      ]);
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents(data.agents || []);
      }
      if (commissionsRes.ok) {
        const data = await commissionsRes.json();
        setCommissions(data.commissions || []);
      }
    } catch (e) {
      console.error("获取数据失败:", e);
    }
  }

  async function handleApply() {
    if (!userId || !city) {
      setMessage("请填写用户ID和城市");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/agents/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, city }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("代理申请成功！");
        setUserId("");
        setCity("");
        fetchData();
      } else {
        setMessage("申请失败：" + (data.error || "未知错误"));
      }
    } catch (e) {
      setMessage("申请失败，请重试");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-background p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">城市代理管理</h1>

      {/* 申请代理 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>申请成为城市代理</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="用户ID（Pi用户名）"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Input
            placeholder="城市名称（如：广州）"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button onClick={handleApply} disabled={loading}>
            {loading ? "提交中..." : "提交申请"}
          </Button>
          {message && (
            <p className={message.includes("成功") ? "text-green-600" : "text-red-500"}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 代理列表 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>已认证代理列表（{agents.length}）</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无代理</p>
          ) : (
            <div className="flex flex-col gap-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div>
                    <p className="font-medium">{agent.user_id}</p>
                    <p className="text-sm text-muted-foreground">{agent.city}</p>
                  </div>
                  <span className="text-sm font-medium text-amber-600">
                    佣金 {(agent.commission_rate * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分佣记录 */}
      <Card>
        <CardHeader>
          <CardTitle>分佣记录（{commissions.length}）</CardTitle>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无分佣记录</p>
          ) : (
            <div className="flex flex-col gap-2">
              {commissions.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div>
                    <p className="font-medium">{c.user_id}</p>
                    <p className="text-sm text-muted-foreground">
                      订单 {c.order_id.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-amber-600">π {c.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" className="mt-6 w-full" onClick={fetchData}>
        刷新数据
      </Button>
    </main>
  );
}
