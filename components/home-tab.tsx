"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Search,
  Bell,
  X,
  ChevronRight,
  Star,
  Clock,
  Tag,
  Utensils,
  Coffee,
  ShoppingBag,
  Gamepad2,
  Briefcase,
  RefreshCw,
  Store,
  Map,
} from "lucide-react";
import type { ActivityData, DealData, CategoryData } from "./detail-pages";
import { usePosts } from "@/contexts/posts-context";

const categories: { icon: React.ElementType; label: string; color: string }[] = [
  { icon: Utensils, label: "餐饮美食", color: "text-orange-500 bg-orange-50" },
  { icon: Coffee, label: "咖啡茶饮", color: "text-amber-600 bg-amber-50" },
  { icon: ShoppingBag, label: "购物优惠", color: "text-blue-500 bg-blue-50" },
  { icon: Gamepad2, label: "娱乐休闲", color: "text-purple-500 bg-purple-50" },
  { icon: Briefcase, label: "招聘信息", color: "text-green-600 bg-green-50" },
  { icon: RefreshCw, label: "二手交易", color: "text-teal-500 bg-teal-50" },
  { icon: Store, label: "商家活动", color: "text-red-500 bg-red-50" },
  { icon: Map, label: "Pi 地图", color: "text-primary bg-primary/10" },
];

const bannerItems = [
  { id: "flash-sale",        title: "周末限定优惠", subtitle: "全城餐饮低至5折，限时抢购",     tag: "限时活动" },
  { id: "merchant-benefit",  title: "新商家入驻",   subtitle: "首月零佣金，轻松开启推广",     tag: "商家福利" },
  { id: "pi-exclusive",      title: "Pi 支付享折扣", subtitle: "使用 Pi 支付，额外享9折优惠", tag: "Pi 专属"  },
];

const hotDeals: DealData[] = [
  {
    id: 1,
    section: "本地优惠",
    category: "餐饮",
    categoryClass: "bg-orange-50 text-orange-600",
    title: "美式咖啡买一送一",
    seller: "星城咖啡",
    location: "天河区",
    time: "今天",
    price: "π 2.5",
    originalPrice: "π 5.0",
    condition: null,
    comments: 18,
    isHot: true,
  },
  {
    id: 2,
    section: "本地优惠",
    category: "餐饮",
    categoryClass: "bg-orange-50 text-orange-600",
    title: "双人套餐立减30%",
    seller: "优选烤肉",
    location: "海珠区",
    time: "本周",
    price: "π 18",
    originalPrice: "π 26",
    condition: null,
    comments: 5,
    isHot: false,
  },
  {
    id: 3,
    section: "本地优惠",
    category: "活动",
    categoryClass: "bg-blue-50 text-blue-600",
    title: "读书会免费入场",
    seller: "城市书吧",
    location: "越秀区",
    time: "周末",
    price: "免费",
    originalPrice: "π 8",
    condition: null,
    comments: 9,
    isHot: true,
  },
  {
    id: 4,
    section: "本地优惠",
    category: "购物",
    categoryClass: "bg-green-50 text-green-600",
    title: "新款夏装全场7折",
    seller: "潮流服饰",
    location: "天河区",
    time: "限时",
    price: "π 35起",
    originalPrice: "π 50起",
    condition: null,
    comments: 21,
    isHot: false,
  },
];

const latestActivities: ActivityData[] = [
  {
    id: 1,
    type: "开业",
    typeClass: "bg-green-50 text-green-700",
    title: "开业大吉！全场商品8折优惠，前100名顾客送礼",
    merchant: "新开张 · 时尚生活馆",
    address: "天河区天河路188号",
    time: "今天",
    views: 1240,
    posted: "1小时前",
    piPayment: true,
  },
  {
    id: 2,
    type: "招聘",
    typeClass: "bg-blue-50 text-blue-700",
    title: "招聘：咖啡师 / 收银员各 2 名，有经验者优先",
    merchant: "蓝山咖啡馆",
    address: "番禺区大学城北路",
    time: "长期有效",
    views: 680,
    posted: "2小时前",
    piPayment: false,
  },
  {
    id: 3,
    type: "清仓",
    typeClass: "bg-red-50 text-red-600",
    title: "清仓特卖！电子产品低至3折，限量处理",
    merchant: "数码城 · 三楼",
    address: "海珠区工业大道南35号",
    time: "今天起",
    views: 2100,
    posted: "3小时前",
    piPayment: true,
  },
];

interface HomeTabProps {
  onOpenActivity: (data: ActivityData) => void;
  onOpenDeal: (data: DealData) => void;
  onOpenCategory: (data: CategoryData) => void;
  onOpenBanner: (id: string) => void;
}

export function HomeTab({ onOpenActivity, onOpenDeal, onOpenCategory, onOpenBanner }: HomeTabProps) {
  const { posts } = usePosts();

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "欢迎来到派城", desc: "发现附近商家、优惠和活动，开始探索吧！", time: "刚刚", unread: true },
    { id: 2, title: "平台公告", desc: "派城已正式上线 Pi Network，Pi 支付功能现已开放使用。", time: "1天前", unread: true },
    { id: 3, title: "商家认证开放", desc: "立即申请商家认证，获得专属推广资源和优先曝光机会。", time: "3天前", unread: false },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Real user location via browser Geolocation API + reverse geocoding
  const [locationText, setLocationText] = useState("获取位置中...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationText("位置不可用");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=zh`
          );
          const data = await res.json();
          const addr = data.address;
          // Build a short "城市 · 区" label from the response
          const city = addr.city || addr.town || addr.county || addr.state || "";
          const district = addr.suburb || addr.district || addr.quarter || "";
          setLocationText(district ? `${city} · ${district}` : city || "当前位置");
        } catch {
          setLocationText("当前位置");
        }
      },
      () => setLocationText("位置未授权")
    );
  }, []);

  // Prepend user-published activities (kind=activity, status=已发布) to latest activities
  const userActivityCards = useMemo<ActivityData[]>(() =>
    posts
      .filter((p) => p.kind === "activity" && p.status === "已发布")
      .map((p) => ({
        id: 9000 + p.id,
        type: "发布",
        typeClass: "bg-primary/10 text-primary",
        title: p.title,
        merchant: "我发布",
        address: p.location || "未填写地点",
        time: "长期有效",
        views: p.views,
        posted: p.createdAt,
        piPayment: false,
      })),
  [posts]);

  // Prepend user-published deals/secondhand/flash-sale (status=已发布) to hot deals
  const kindMeta: Record<string, { section: string; category: string; categoryClass: string; condition: string | null }> = {
    "deal":        { section: "本地优惠", category: "优惠", categoryClass: "bg-primary/10 text-primary", condition: null },
    "flash-sale":  { section: "本地优惠", category: "限时", categoryClass: "bg-red-50 text-red-600",    condition: null },
    "secondhand":  { section: "二手交易", category: "二手", categoryClass: "bg-teal-50 text-teal-700",  condition: "见描述" },
  };

  const userDealCards = useMemo<DealData[]>(() =>
    posts
      .filter((p) => ["deal", "flash-sale", "secondhand"].includes(p.kind) && p.status === "已发布")
      .map((p) => {
        const meta = kindMeta[p.kind] ?? kindMeta["deal"];
        return {
          id: 9000 + p.id,
          section: meta.section,
          category: meta.category,
          categoryClass: meta.categoryClass,
          title: p.title,
          seller: "我发布",
          location: p.location || "未填写",
          time: p.createdAt,
          price: p.price || "面议",
          originalPrice: null,
          condition: p.condition || meta.condition,
          comments: 0,
          isHot: false,
        };
      }),
  [posts]);

  const displayActivities = [...userActivityCards, ...latestActivities].slice(0, 5);
  const displayDeals = [...userDealCards, ...hotDeals].slice(0, 4);

  return (
    <div className="flex flex-col min-h-full bg-background pb-4">
      {/* Header */}
      <div className="bg-secondary px-4 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigator.geolocation?.getCurrentPosition(
              async ({ coords }) => {
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=zh`);
                  const data = await res.json();
                  const addr = data.address;
                  const city = addr.city || addr.town || addr.county || addr.state || "";
                  const district = addr.suburb || addr.district || addr.quarter || "";
                  setLocationText(district ? `${city} · ${district}` : city || "当前位置");
                } catch { setLocationText("当前位置"); }
              },
              () => setLocationText("位置未授权")
            )}
            className="flex items-center gap-1.5 active:opacity-70 transition-opacity"
          >
            <MapPin size={14} className="text-primary" />
            <span className="text-secondary-foreground text-sm font-semibold">{locationText}</span>
            <ChevronRight size={13} className="text-secondary-foreground/50" />
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-full bg-white/10 active:bg-white/20 transition-colors"
          >
            <Bell size={18} className="text-secondary-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 border border-secondary">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">通知</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 mb-4">
          <Image
            src="/logo.png"
            alt="派城 PiCity Logo"
            width={40}
            height={40}
            className="rounded-xl flex-shrink-0 object-contain"
          />
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-secondary-foreground font-black text-lg tracking-tight">派城</span>
            <span className="text-secondary-foreground/50 text-[11px] tracking-wide">PiCity</span>
          </div>
        </div>

        {/* Real search input */}
        <div className="w-full flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
          <Search size={15} className="text-secondary-foreground/60 flex-shrink-0" />
          <input
            type="search"
            placeholder="搜索附近商家、优惠、活动..."
            className="flex-1 bg-transparent text-sm text-secondary-foreground placeholder:text-secondary-foreground/50 outline-none min-w-0"
          />
        </div>
      </div>

      <div className="flex-1 px-4 pt-5 space-y-6">
        {/* Categories */}
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => onOpenCategory({ label: cat.label, color: cat.color })}
                className="flex flex-col items-center gap-2 bg-card rounded-2xl py-3.5 shadow-sm active:scale-95 transition-transform border border-border"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[11px] text-foreground font-medium text-center leading-tight px-1">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Banner Carousel */}
        <div>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
            {bannerItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenBanner(item.id)}
                className="flex-none w-[78vw] max-w-72 rounded-2xl bg-secondary p-5 snap-start border border-white/5 text-left active:opacity-80 transition-opacity"
              >
                <span className="inline-block text-[11px] font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-full mb-3">
                  {item.tag}
                </span>
                <h3 className="text-secondary-foreground font-bold text-lg leading-tight text-balance">{item.title}</h3>
                <p className="text-secondary-foreground/60 text-sm mt-1.5 leading-relaxed">{item.subtitle}</p>
                <p className="text-primary text-xs font-semibold mt-3">查看全部 &rsaquo;</p>
              </button>
            ))}
          </div>
        </div>

        {/* Hot Deals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-bold text-base">附近热门优惠</h2>
            <button
              onClick={() => onOpenCategory({ label: "购物优惠", color: "text-blue-500 bg-blue-50" })}
              className="flex items-center gap-0.5 text-primary text-xs font-semibold"
            >
              查看全部 <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {displayDeals.map((deal) => (
              <button
                key={deal.id}
                onClick={() => onOpenDeal(deal)}
                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border active:scale-95 transition-transform text-left"
              >
                <div className="h-28 bg-muted flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Tag size={20} className="text-muted-foreground/40" />
                  </div>
                </div>
                <div className="p-3">
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${deal.categoryClass}`}>
                    {deal.category}
                  </span>
                  <p className="text-foreground font-semibold text-sm mt-1.5 leading-tight line-clamp-2">{deal.title}</p>
                  <p className="text-muted-foreground text-xs mt-1">{deal.seller}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="text-primary font-bold text-sm">{deal.price}</span>
                      {deal.originalPrice && (
                        <span className="text-muted-foreground text-xs line-through ml-1.5">{deal.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-primary fill-primary" />
                      <span className="text-[11px] text-muted-foreground">4.7</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={10} className="text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{deal.location}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Latest Activities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-bold text-base">最新商家动态</h2>
            <button
              onClick={() => onOpenCategory({ label: "商家活动", color: "text-red-500 bg-red-50" })}
              className="flex items-center gap-0.5 text-primary text-xs font-semibold"
            >
              查看全部 <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-2.5">
            {displayActivities.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpenActivity(item)}
                className="w-full bg-card rounded-2xl p-4 border border-border flex items-start justify-between active:bg-muted transition-colors text-left"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.typeClass}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-foreground text-sm font-medium leading-snug line-clamp-2">{item.title}</p>
                  <p className="text-muted-foreground text-xs font-medium mt-1">{item.merchant}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{item.posted}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{item.views.toLocaleString()} 浏览</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Pi Network CTA */}
        <div className="bg-secondary rounded-2xl p-5 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-primary font-bold text-sm mb-1">加入 Pi Network 生态</p>
            <p className="text-secondary-foreground/70 text-xs leading-relaxed">
              使用 Pi 支付，享受专属商家优惠与更多权益
            </p>
          </div>
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
            <span className="text-primary font-black text-3xl leading-none">π</span>
          </div>
        </div>
      </div>

      {/* Notification bottom sheet */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNotifications(false)} />
          <div className="relative bg-card rounded-t-3xl z-10 flex flex-col max-h-[75vh]">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border flex-shrink-0">
              <p className="font-bold text-foreground text-base">通知消息</p>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:opacity-70"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {notifications.map((n) => (
                <div key={n.id} className={`flex gap-3 px-5 py-4 ${n.unread ? "bg-primary/5" : ""}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${n.unread ? "bg-primary" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground flex-shrink-0">{n.time}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-border flex-shrink-0">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full py-3 rounded-2xl bg-muted text-muted-foreground text-sm font-semibold active:opacity-70"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
