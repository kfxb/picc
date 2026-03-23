"use client";

import { useState } from "react";
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  Star,
  Package,
  Heart,
  MessageSquare,
  Shield,
  LogOut,
  Wallet,
  Store,
  BadgeCheck,
} from "lucide-react";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { usePosts } from "@/contexts/posts-context";
import { useUserProfile } from "@/contexts/user-profile-context";
import { WalletConnectModal } from "./wallet-connect-modal";
import type { ProfilePageId } from "./detail-pages";

interface ProfileTabProps {
  onOpenPage: (id: ProfilePageId) => void;
}

const settingsMenuGroup = {
  title: "设置",
  items: [
    { icon: BadgeCheck,   label: "商家认证",   pageId: "merchant-cert" as ProfilePageId },
    { icon: Bell,         label: "通知设置",   pageId: "notifications" as ProfilePageId },
    { icon: Shield,       label: "隐私与安全", pageId: "privacy"        as ProfilePageId },
    { icon: Shield,       label: "隐私政策",   pageId: "privacy-policy" as ProfilePageId },
    { icon: Settings,     label: "账号设置",   pageId: "account"        as ProfilePageId },
    { icon: HelpCircle,   label: "帮助与反馈", pageId: "help"           as ProfilePageId },
  ],
};

export function ProfileTab({ onOpenPage }: ProfileTabProps) {
  const { wallet, walletLoading, disconnectWallet } = usePiAuth();
  const { posts } = usePosts();
  const { profile } = useUserProfile();
  const displayName = profile.nickname || wallet?.username || "Pioneer 用户";

  const myPostCount = posts.length;
  // unread messages count (static for now)
  const unreadMessages = 5;

  const contentMenuItems = [
    { icon: Package,       label: "我的发布",  count: myPostCount > 0 ? myPostCount : null, pageId: "my-posts"  as ProfilePageId },
    { icon: Heart,         label: "我的收藏",  count: 12 as number | null,                  pageId: "favorites" as ProfilePageId },
    { icon: MessageSquare, label: "消息中心",  count: unreadMessages as number | null,      pageId: "messages"  as ProfilePageId },
    { icon: Star,          label: "我的评价",  count: null,                                  pageId: "reviews"   as ProfilePageId },
  ];

  const menuGroups = [
    { title: "我的内容", items: contentMenuItems },
    { title: "设置",     items: settingsMenuGroup.items.map((i) => ({ ...i, count: null as number | null })) },
  ];

  const stats = [
    { label: "我的发布", value: String(myPostCount), pageId: "my-posts"  as ProfilePageId },
    { label: "我的收藏", value: "12",                 pageId: "favorites" as ProfilePageId },
    { label: "关注商家", value: "8",                  pageId: "favorites" as ProfilePageId },
  ];
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const shortAddress = wallet?.address
    ? wallet.address.slice(0, 6) + "..." + wallet.address.slice(-6)
    : null;

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-secondary px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-secondary-foreground font-bold text-xl">我的</h1>
          <button
            onClick={() => onOpenPage("account")}
            className="p-2 rounded-full bg-white/10 active:bg-white/20 transition-colors"
          >
            <Settings size={18} className="text-secondary-foreground" />
            <span className="sr-only">设置</span>
          </button>
        </div>

        {/* Profile Card */}
        <button
          onClick={() => onOpenPage("account")}
          className="w-full flex items-center gap-4 active:opacity-80 transition-opacity"
        >
          {profile.avatarImage ? (
            <img src={profile.avatarImage} alt="头像" className="w-16 h-16 rounded-full object-cover border-2 border-white/20 flex-shrink-0" />
          ) : (
            <div className={`w-16 h-16 rounded-full ${profile.avatarColor} border-2 border-white/20 flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-black text-2xl">{profile.avatarEmoji}</span>
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <h2 className="text-secondary-foreground font-bold text-lg leading-tight truncate">
              {displayName}
            </h2>
            <p className="text-secondary-foreground/55 text-sm mt-0.5">
              {wallet ? shortAddress : "点击设置昵称和头像"}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] bg-primary/25 text-primary font-bold px-2 py-0.5 rounded-full">Pi Pioneer</span>
              {wallet && (
                <span className="text-[11px] bg-green-500/20 text-green-500 font-bold px-2 py-0.5 rounded-full">钱包已连接</span>
              )}
              {!wallet && (
                <span className="text-[11px] bg-accent/25 text-accent font-bold px-2 py-0.5 rounded-full">城市用户</span>
              )}
            </div>
          </div>
          <ChevronRight size={18} className="text-secondary-foreground/40 flex-shrink-0" />
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 bg-card border-b border-border">
        {stats.map((stat, idx) => (
          <button
            key={stat.label}
            onClick={() => onOpenPage(stat.pageId)}
            className={`flex flex-col items-center py-4 active:bg-muted transition-colors ${idx < stats.length - 1 ? "border-r border-border" : ""}`}
          >
            <span className="text-xl font-bold text-foreground">{stat.value}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{stat.label}</span>
          </button>
        ))}
      </div>

      {/* Pi Wallet Card */}
      <div className="mx-4 mt-4 bg-secondary rounded-2xl p-4">
        {wallet ? (
          /* Connected state */
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet size={13} className="text-secondary-foreground/60" />
                <p className="text-secondary-foreground/60 text-xs font-medium">Pi 钱包余额</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-primary font-black text-2xl leading-none">π</span>
                <span className="text-secondary-foreground font-bold text-2xl leading-none ml-1">
                  {wallet.balance !== null ? wallet.balance.toFixed(4) : "— — —"}
                </span>
              </div>
              <p className="text-secondary-foreground/40 text-xs mt-1.5 font-mono">{shortAddress}</p>
            </div>
            <button
              onClick={() => setShowWalletModal(true)}
              className="bg-primary/20 text-primary text-xs font-bold px-4 py-2.5 rounded-xl active:opacity-70 transition-opacity border border-primary/30"
            >
              钱包详情
            </button>
          </div>
        ) : (
          /* Disconnected state */
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet size={13} className="text-secondary-foreground/60" />
                <p className="text-secondary-foreground/60 text-xs font-medium">Pi 钱包余额</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-primary font-black text-2xl leading-none">π</span>
                <span className="text-secondary-foreground font-bold text-2xl leading-none ml-1">— — —</span>
              </div>
              <p className="text-secondary-foreground/40 text-xs mt-1.5">连接 Pi 钱包后显示余额</p>
            </div>
            <button
              onClick={() => setShowWalletModal(true)}
              disabled={walletLoading}
              className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-xl active:opacity-80 transition-opacity disabled:opacity-60"
            >
              {walletLoading ? "连接中..." : "连接钱包"}
            </button>
          </div>
        )}
      </div>

      {/* Menu Groups */}
      <div className="mx-4 mt-4 space-y-3">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">{group.title}</p>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => onOpenPage(item.pageId)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-muted transition-colors ${
                      idx < group.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
                    {item.count !== null && (
                      <span className="bg-primary text-primary-foreground text-[11px] font-bold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                    <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-3 mb-4">
        {wallet ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-card border border-border text-muted-foreground text-sm font-medium active:bg-muted transition-colors"
          >
            <LogOut size={15} />
            退出 Pi 账号
          </button>
        ) : (
          <button
            onClick={() => setShowWalletModal(true)}
            disabled={walletLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 transition-opacity disabled:opacity-60"
          >
            <Wallet size={15} />
            {walletLoading ? "连接中..." : "连接 Pi 账号登录"}
          </button>
        )}
      </div>

      {/* Logout confirm bottom sheet */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogoutConfirm(false)}
          />
          {/* Sheet */}
          <div className="relative bg-card rounded-t-3xl px-5 pt-5 pb-10 z-10">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <LogOut size={18} className="text-destructive" />
              </div>
              <div>
                <p className="text-foreground font-bold text-base">退出 Pi 账号</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  当前账号：{wallet?.username}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-4 mb-6 leading-relaxed">
              退出后将断开 Pi 钱包连接，发布功能需要重新登录才能使用。确认退出吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl bg-muted text-foreground text-sm font-bold active:opacity-70 transition-opacity"
              >
                取消
              </button>
              <button
                onClick={() => {
                  disconnectWallet();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-destructive text-white text-sm font-bold active:opacity-80 transition-opacity"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pb-8 px-4 space-y-1.5">
        <p className="text-xs text-muted-foreground">派城 PiCity v1.0.0</p>
        <p className="text-[11px] text-muted-foreground/50">基于 Pi Network 生态 · 让城市商业更简单</p>
        <button
          onClick={() => onOpenPage("privacy-policy")}
          className="text-[11px] text-primary/60 underline underline-offset-2 active:opacity-70"
        >
          隐私政策
        </button>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletConnectModal onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
}
