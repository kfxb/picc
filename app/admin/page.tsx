"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "picity2024";

type Post = {
  id: number;
  title: string;
  category: string;
  author: string;
  created_at: string;
  status?: string;
};

type Agent = {
  id: string;
  user_id: string;
  city: string;
  commission_rate: number;
};

type Commission = {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  created_at: string;
};

type Tab = "posts" | "agents" | "commissions";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("密码错误");
    }
  }

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    if (activeTab === "posts") {
      fetch("/api/posts?limit=100")
        .then((r) => r.json())
        .then((d) => setPosts(d.posts || []))
        .finally(() => setLoading(false));
    } else if (activeTab === "agents") {
      fetch("/api/agents/list")
        .then((r) => r.json())
        .then((d) => setAgents(d.agents || []))
        .finally(() => setLoading(false));
    } else if (activeTab === "commissions") {
      fetch("/api/agents/commissions")
        .then((r) => r.json())
        .then((d) => setCommissions(d.commissions || []))
        .finally(() => setLoading(false));
    }
  }, [authed, activeTab]);

  async function deletePost(id: number) {
    if (!confirm("确定删除这条帖子？")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-xl font-bold text-foreground text-center">派城后台管理</h1>
          <p className="text-muted-foreground text-sm text-center">请输入管理员密码</p>
          <input
            type="password"
            placeholder="管理员密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="border border-border rounded-lg px-4 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={handleLogin}
            className="bg-primary text-primary-foreground rounded-lg py-2 font-semibold text-sm hover:opacity-90 transition"
          >
            登录
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-muted-foreground text-sm text-center hover:underline"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "posts", label: "帖子管理" },
    { key: "agents", label: "代理管理" },
    { key: "commissions", label: "分佣记录" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">派城后台管理</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            返回首页
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="text-sm text-red-500 hover:underline"
          >
            退出
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">加载中...</div>
        ) : (
          <>
            {activeTab === "posts" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">共 {posts.length} 条帖子</p>
                {posts.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">暂无帖子</p>
                )}
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <span className="font-medium text-foreground text-sm truncate">{post.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {post.category} · {post.author} · {new Date(post.created_at).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-500 text-xs hover:underline shrink-0"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "agents" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">共 {agents.length} 位代理</p>
                {agents.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">暂无代理</p>
                )}
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground text-sm">{agent.user_id}</span>
                      <span className="text-xs text-muted-foreground">
                        城市：{agent.city} · 佣金比例：{(agent.commission_rate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "commissions" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">共 {commissions.length} 条分佣记录</p>
                {commissions.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">暂无分佣记录</p>
                )}
                {commissions.map((c) => (
                  <div
                    key={c.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground text-sm">代理：{c.user_id}</span>
                      <span className="text-xs text-muted-foreground">
                        订单：{c.order_id} · 金额：π {c.amount}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(c.created_at).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
