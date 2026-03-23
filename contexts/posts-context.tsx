"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type PostStatus = "审核中" | "已发布" | "已下线";
export type PostKind = "activity" | "deal" | "secondhand" | "flash-sale" | "merchant-benefit" | "pi-exclusive";

export interface UserPost {
  id: number;
  kind: PostKind;
  kindLabel: string;
  kindClass: string;
  title: string;
  location: string;
  price: string;
  condition: string;
  description: string;
  createdAt: string;
  status: PostStatus;
  views: number;
  piUsername?: string;
}

interface PostsContextType {
  posts: UserPost[];
  loading: boolean;
  addPost: (post: Omit<UserPost, "id" | "createdAt" | "views" | "status">) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
  editPost: (id: number, updates: Partial<Pick<UserPost, "title" | "location">>) => Promise<void>;
  approvePost: (id: number) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Fallback demo data used only when DB is unavailable
const FALLBACK_POSTS: UserPost[] = [
  {
    id: 901, kind: "secondhand", kindLabel: "二手", kindClass: "bg-teal-50 text-teal-700",
    title: "二手自行车出售，8成新，骑了两年", location: "天河区",
    price: "π 280", condition: "8成新", description: "骑了两年，车况良好，适合上下班通勤",
    createdAt: "今天", status: "已发布", views: 88,
  },
  {
    id: 902, kind: "secondhand", kindLabel: "二手", kindClass: "bg-teal-50 text-teal-700",
    title: "旧书一批低价处理，涵盖小说/教材/杂志", location: "越秀区",
    price: "π 5/本", condition: "7成新", description: "各类书籍，看图下单，可打包优惠",
    createdAt: "3天前", status: "已发布", views: 45,
  },
  {
    id: 903, kind: "secondhand", kindLabel: "求购", kindClass: "bg-blue-50 text-blue-700",
    title: "求购：戴森吹风机，九成新以上，价格合适即可", location: "天河区",
    price: "面议", condition: "9成新以上", description: "需要九成新以上，价格合适即可",
    createdAt: "1周前", status: "已发布", views: 30,
  },
];

async function fetchPosts(): Promise<UserPost[]> {
  try {
    const res = await fetch("/api/posts", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch {
    return FALLBACK_POSTS;
  }
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPosts = useCallback(async () => {
    setLoading(true);
    const data = await fetchPosts();
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { refreshPosts(); }, [refreshPosts]);

  async function addPost(post: Omit<UserPost, "id" | "createdAt" | "views" | "status">) {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error();
      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);
    } catch {
      // Optimistic fallback
      const optimistic: UserPost = { ...post, id: Date.now(), createdAt: "刚刚", views: 0, status: "审核中" };
      setPosts((prev) => [optimistic, ...prev]);
    }
  }

  async function deletePost(id: number) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try { await fetch(`/api/posts/${id}`, { method: "DELETE" }); } catch {}
  }

  async function toggleStatus(id: number) {
    setPosts((prev) =>
      prev.map((p) => p.id !== id ? p : { ...p, status: p.status === "已发布" ? "已下线" : "已发布" })
    );
    try {
      await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle" }),
      });
    } catch {}
  }

  async function editPost(id: number, updates: Partial<Pick<UserPost, "title" | "location">>) {
    setPosts((prev) => prev.map((p) => (p.id !== id ? p : { ...p, ...updates })));
    try {
      await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch {}
  }

  async function approvePost(id: number) {
    setPosts((prev) => prev.map((p) => (p.id !== id ? p : { ...p, status: "已发布" })));
    try {
      await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
    } catch {}
  }

  return (
    <PostsContext.Provider value={{ posts, loading, addPost, deletePost, toggleStatus, editPost, approvePost, refreshPosts }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within a PostsProvider");
  return ctx;
}
