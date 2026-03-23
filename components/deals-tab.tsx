"use client";

import { useState, useMemo } from "react";
import { Search, Plus, MapPin, Clock, MessageCircle, ChevronRight, PackageOpen, TrendingUp } from "lucide-react";
import { usePosts } from "@/contexts/posts-context";
import type { DealData } from "./detail-pages";

const dealSections = ["全部", "本地优惠", "二手交易", "求购信息"];

const deals: DealData[] = [
  {
    id: 1,
    section: "本地优惠",
    category: "餐饮",
    categoryClass: "bg-orange-50 text-orange-600",
    title: "招牌卤肉饭套餐 — 本周特价只需 π 3.8",
    seller: "台湾饭铺 · 正宗风味",
    location: "天河区",
    time: "今天",
    price: "π 3.8",
    originalPrice: "π 6.0",
    condition: null,
    comments: 18,
    isHot: true,
  },
  {
    id: 2,
    section: "本地优惠",
    category: "咖啡",
    categoryClass: "bg-amber-50 text-amber-700",
    title: "下午场手冲咖啡买一赠一（14:00–17:00）",
    seller: "森林咖啡实验室",
    location: "越秀区",
    time: "每天",
    price: "π 5",
    originalPrice: "π 10",
    condition: null,
    comments: 34,
    isHot: true,
  },
  {
    id: 3,
    section: "本地优惠",
    category: "娱乐",
    categoryClass: "bg-purple-50 text-purple-600",
    title: "KTV包厢3小时，使用 Pi 支付立减 π 5",
    seller: "星光KTV",
    location: "番禺区",
    time: "周一至周四",
    price: "π 35",
    originalPrice: "π 40",
    condition: null,
    comments: 9,
    isHot: false,
  },
  {
    id: 4,
    section: "二手交易",
    category: "数码",
    categoryClass: "bg-blue-50 text-blue-600",
    title: "iPhone 14 Pro 256G 深空黑 99成新，盒子配件齐全",
    seller: "陈先生",
    location: "海珠区",
    time: "昨天",
    price: "π 220",
    originalPrice: null,
    condition: "9成新",
    comments: 26,
    isHot: false,
  },
  {
    id: 5,
    section: "二手交易",
    category: "家具",
    categoryClass: "bg-green-50 text-green-600",
    title: "宜家实木书桌（140cm），搬家急售，自提优先",
    seller: "小李",
    location: "白云区",
    time: "2天前",
    price: "π 35",
    originalPrice: null,
    condition: "8成新",
    comments: 7,
    isHot: false,
  },
  {
    id: 6,
    section: "二手交易",
    category: "服饰",
    categoryClass: "bg-pink-50 text-pink-600",
    title: "全新未拆封 Nike Air Force 1 白色 42码",
    seller: "球鞋控张同学",
    location: "荔湾区",
    time: "今天",
    price: "π 65",
    originalPrice: null,
    condition: "全新",
    comments: 42,
    isHot: true,
  },
  {
    id: 7,
    section: "求购信息",
    category: "求购",
    categoryClass: "bg-indigo-50 text-indigo-600",
    title: "【求购】苹果 MacBook Air M2，预算 π 350 以内",
    seller: "王小明",
    location: "天河区",
    time: "今天",
    price: "预算 π 350",
    originalPrice: null,
    condition: null,
    comments: 5,
    isHot: false,
  },
  {
    id: 8,
    section: "求购信息",
    category: "求购",
    categoryClass: "bg-indigo-50 text-indigo-600",
    title: "【求购】二手钢琴或电钢琴，88键，可自提",
    seller: "音乐爱好者小方",
    location: "越秀区",
    time: "3天前",
    price: "预算 π 120",
    originalPrice: null,
    condition: null,
    comments: 3,
    isHot: false,
  },
];

interface DealsTabProps {
  onOpenDeal: (data: DealData) => void;
  onOpenPublish: () => void;
}

// Maps PostKind to the section label used in deals tab
const kindToSection: Record<string, string> = {
  deal: "本地优惠",
  secondhand: "二手交易",
};

export function DealsTab({ onOpenDeal, onOpenPublish }: DealsTabProps) {
  const [activeSection, setActiveSection] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const { posts } = usePosts();

  // Convert user-published deal / secondhand posts into DealData entries and prepend them
  const userDeals = useMemo<DealData[]>(() =>
    posts
      .filter((p) => (p.kind === "deal" || p.kind === "secondhand") && p.status === "已发布")
      .map((p) => ({
        id: 9000 + p.id,
        section: kindToSection[p.kind] ?? "本地优惠",
        category: p.kind === "secondhand" ? "二手" : "优惠",
        categoryClass: p.kind === "secondhand" ? "bg-teal-50 text-teal-700" : "bg-primary/10 text-primary",
        title: p.title,
        seller: "我发布",
        location: p.location || "未填写",
        time: p.createdAt,
        price: p.price || "面议",
        originalPrice: null,
        condition: p.condition || (p.kind === "secondhand" ? "见描述" : null),
        comments: 0,
        isHot: false,
      })),
  [posts]);

  const allDeals = [...userDeals, ...deals];

  const filtered = allDeals.filter((d) => {
    const matchSection = activeSection === "全部" || d.section === activeSection;
    const matchSearch =
      !searchText || d.title.includes(searchText) || d.seller.includes(searchText);
    return matchSection && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-secondary px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-secondary-foreground font-bold text-xl">优惠 &amp; 交易</h1>
          <button
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-2 rounded-full text-xs font-bold active:opacity-80 transition-opacity"
          >
            <Plus size={14} />
            发布信息
          </button>
        </div>
        <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-4 py-3">
          <Search size={15} className="text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索优惠或商品..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent text-secondary-foreground text-sm placeholder:text-secondary-foreground/45 outline-none"
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none bg-card border-b border-border">
        {dealSections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeSection === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-card border-b border-border">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-accent" />
          <span className="text-xs text-muted-foreground">
            今日更新 <span className="text-foreground font-bold">128</span> 条
          </span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-primary" />
          <span className="text-xs text-muted-foreground">
            覆盖 <span className="text-foreground font-bold">12</span> 个区域
          </span>
        </div>
      </div>

      {/* Deals List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <PackageOpen size={36} className="opacity-25 mb-3" />
            <p className="text-sm font-medium">暂无相关信息</p>
          </div>
        )}

        {filtered.map((deal) => (
          <button
            key={deal.id}
            onClick={() => onOpenDeal(deal)}
            className="w-full bg-card rounded-2xl p-4 border border-border shadow-sm active:bg-muted/40 transition-colors text-left"
          >
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${deal.categoryClass}`}>
                {deal.category}
              </span>
              {deal.isHot && (
                <span className="text-[11px] bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full">热门</span>
              )}
              {deal.condition && (
                <span className="text-[11px] bg-accent/10 text-accent font-bold px-2.5 py-1 rounded-full">
                  {deal.condition}
                </span>
              )}
            </div>

            <h3 className="text-foreground font-semibold text-sm leading-snug line-clamp-2 mb-2.5">
              {deal.title}
            </h3>

            <div className="flex items-baseline gap-2 mb-2.5">
              <span className="text-primary font-bold text-base">{deal.price}</span>
              {deal.originalPrice && (
                <span className="text-muted-foreground text-xs line-through">{deal.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{deal.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{deal.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground truncate mr-2">{deal.seller}</span>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <MessageCircle size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{deal.comments}</span>
                </div>
                <span className="flex items-center gap-0.5 text-primary text-xs font-semibold">
                  详情 <ChevronRight size={12} />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
