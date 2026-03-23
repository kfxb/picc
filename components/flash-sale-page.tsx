"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Tag,
  ChevronRight,
  Flame,
  Share2,
  Heart,
  Store,
  CalendarClock,
  Plus,
  Search,
  X,
} from "lucide-react";
import { usePosts } from "@/contexts/posts-context";
import type { FlashSaleItem } from "./detail-pages";

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(endsAt: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    function calc() {
      const end = new Date(endsAt).getTime();
      const diff = end - Date.now();
      if (diff <= 0) { setTimeLeft("已结束"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return timeLeft;
}

// ─── Countdown Display ────────────────────────────────────────────────────────
function CountdownBadge({ endsAt }: { endsAt: string }) {
  const t = useCountdown(endsAt);
  return (
    <span className="flex items-center gap-1 text-[11px] font-bold bg-destructive/10 text-destructive px-2.5 py-1 rounded-full">
      <Clock size={10} />
      {t}
    </span>
  );
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const now = new Date();
const makeEnd = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();

export const FLASH_SALE_ITEMS: FlashSaleItem[] = [
  {
    id: 1,
    title: "美式咖啡限时买一送一",
    merchant: "星城咖啡",
    location: "天河区天河路88号",
    price: "π 2.5",
    originalPrice: "π 5.0",
    endsAt: makeEnd(3),
    category: "餐饮",
    desc: "每日限量50杯，购买美式咖啡即可免费获得同款一杯，不可叠加其他优惠。",
    piPayment: true,
    isHot: true,
  },
  {
    id: 2,
    title: "双人烤肉套餐立减30%",
    merchant: "优选烤肉",
    location: "海珠区工业大道南",
    price: "π 18",
    originalPrice: "π 26",
    endsAt: makeEnd(6),
    category: "餐饮",
    desc: "双人套餐含牛肉、猪颈肉各200g，配蔬菜拼盘、饮料二杯，今日限30桌。",
    piPayment: true,
    isHot: true,
  },
  {
    id: 3,
    title: "全场夏装第二件5折",
    merchant: "潮流服饰",
    location: "天河区天河城B2",
    price: "π 35起",
    originalPrice: "π 70起",
    endsAt: makeEnd(10),
    category: "购物",
    desc: "全场夏季新品，购满2件第二件享5折，Pi支付额外九折，不限款式。",
    piPayment: true,
    isHot: false,
  },
  {
    id: 4,
    title: "读书会免费入场",
    merchant: "城市书吧",
    location: "越秀区北京路步行街",
    price: "免费",
    originalPrice: "π 8",
    endsAt: makeEnd(18),
    category: "文化",
    desc: "本周末读书分享会，限额30人，免费入场，现场有书籍兑换活动。",
    piPayment: false,
    isHot: false,
  },
  {
    id: 5,
    title: "进口红酒品鉴会9折",
    merchant: "洋酒坊",
    location: "荔湾区龙津路22号",
    price: "π 45起",
    originalPrice: "π 50起",
    endsAt: makeEnd(24),
    category: "娱乐",
    desc: "本场特邀法国波尔多酒庄，提供6款精选红酒品鉴，Pi支付享9折，席位有限。",
    piPayment: true,
    isHot: true,
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────
function FlashSaleCard({
  item,
  onOpen,
}: {
  item: FlashSaleItem;
  onOpen: (item: FlashSaleItem) => void;
}) {
  return (
    <button
      onClick={() => onOpen(item)}
      className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden active:scale-[0.98] transition-transform text-left"
    >
      {/* Image placeholder */}
      <div className="h-36 bg-muted flex items-center justify-center relative">
        <Tag size={32} className="text-muted-foreground/20" />
        {item.isHot && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-destructive text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Flame size={10} />
            热门
          </span>
        )}
        {item.piPayment && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-primary/90 text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span className="font-black leading-none">π</span>
            支持
          </span>
        )}
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">{item.category}</span>
          <CountdownBadge endsAt={item.endsAt} />
        </div>
        <p className="text-foreground font-semibold text-sm leading-snug line-clamp-2 mb-1">{item.title}</p>
        <p className="text-muted-foreground text-xs mb-2">{item.merchant}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-primary font-black text-base">{item.price}</span>
            <span className="text-muted-foreground text-xs line-through">{item.originalPrice}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{item.location.split("区")[0]}区</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
export function FlashSaleDetail({
  data,
  onBack,
  onOpenPublish,
}: {
  data: FlashSaleItem;
  onBack: () => void;
  onOpenPublish?: () => void;
}) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-secondary flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors" aria-label="返回">
          <ArrowLeft size={20} className="text-secondary-foreground" />
        </button>
        <h1 className="text-secondary-foreground font-bold text-base">限时活动详情</h1>
        <div className="flex items-center gap-1">
          <button onClick={() => setLiked((v) => !v)} className="p-2 rounded-full active:bg-white/10 transition-colors">
            <Heart size={18} className={liked ? "fill-red-400 text-red-400" : "text-secondary-foreground"} />
          </button>
          <button className="p-2 rounded-full active:bg-white/10 transition-colors">
            <Share2 size={18} className="text-secondary-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero image */}
        <div className="h-52 bg-muted flex items-center justify-center">
          <Tag size={48} className="text-muted-foreground/20" />
        </div>

        <div className="px-4 pt-5 space-y-4 pb-4">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{data.category}</span>
            {data.isHot && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-destructive/10 text-destructive px-3 py-1 rounded-full">
                <Flame size={10} /> 热门
              </span>
            )}
            {data.piPayment && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                <span className="font-black">π</span> 支付享优惠
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-foreground font-bold text-xl leading-snug text-balance">{data.title}</h2>

          {/* Merchant */}
          <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Store size={18} className="text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-bold text-sm">{data.merchant}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-muted-foreground" />
                <span className="text-muted-foreground text-xs truncate">{data.location}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
          </div>

          {/* Price */}
          <div className="bg-destructive/5 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs mb-1">限时优惠价</p>
              <p className="text-destructive font-black text-2xl">{data.price}</p>
              <p className="text-muted-foreground text-xs line-through mt-0.5">原价 {data.originalPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs mb-1.5">活动截止</p>
              <CountdownBadge endsAt={data.endsAt} />
            </div>
          </div>

          {/* End time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarClock size={14} />
            <span>活动结束时间：{new Date(data.endsAt).toLocaleString("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          </div>

          {/* Desc */}
          <div>
            <p className="text-foreground font-bold text-sm mb-2">活动说明</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{data.desc}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Publish CTA for merchants */}
          {onOpenPublish && (
            <button
              onClick={onOpenPublish}
              className="w-full flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20 active:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plus size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-foreground font-bold text-sm">发布你的限时活动</p>
                  <p className="text-muted-foreground text-xs mt-0.5">登录后即可发布，触达附近用户</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-primary" />
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="px-4 pb-6 pt-1">
          <button className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity">
            立即前往获取优惠
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────
export function FlashSaleListPage({
  onBack,
  onOpenItem,
  onOpenPublish,
}: {
  onBack: () => void;
  onOpenItem: (item: FlashSaleItem) => void;
  onOpenPublish?: () => void;
}) {
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const categories = ["全部", "餐饮", "购物", "娱乐", "文化"];
  const { posts } = usePosts();

  // Merge user-published flash-sale posts into the list as FlashSaleItem entries
  const userItems = useMemo<FlashSaleItem[]>(() =>
    posts
      .filter((p) => p.kind === "flash-sale" && p.status === "已发布")
      .map((p, i) => ({
        id: 9000 + p.id,
        title: p.title,
        merchant: "我发布",
        location: p.location || "未知地点",
        price: "—",
        originalPrice: "—",
        endsAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        category: "餐饮",
        desc: "",
        piPayment: false,
        isHot: false,
      })),
  [posts]);

  const allItems = [...userItems, ...FLASH_SALE_ITEMS];

  const filtered = allItems.filter((i) => {
    const matchCat = filter === "全部" || i.category === filter;
    const q = query.trim().toLowerCase();
    const matchQ = !q || i.title.toLowerCase().includes(q) || i.merchant.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-secondary px-4 pt-12 pb-4">
        {searchActive ? (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2.5">
              <Search size={14} className="text-secondary-foreground/60 flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索活动或商家..."
                className="flex-1 bg-transparent text-secondary-foreground placeholder:text-secondary-foreground/40 text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="p-0.5">
                  <X size={13} className="text-secondary-foreground/60" />
                </button>
              )}
            </div>
            <button
              onClick={() => { setSearchActive(false); setQuery(""); }}
              className="text-secondary-foreground/70 text-sm font-medium active:opacity-70"
            >
              取消
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-white/10" aria-label="返回">
              <ArrowLeft size={20} className="text-secondary-foreground" />
            </button>
            <h1 className="text-secondary-foreground font-bold text-lg">限时活动</h1>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchActive(true)} className="p-2 rounded-full active:bg-white/10">
                <Search size={18} className="text-secondary-foreground" />
              </button>
              {onOpenPublish && (
                <button
                  onClick={onOpenPublish}
                  className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-3 py-2 rounded-full active:opacity-80"
                >
                  <Plus size={13} />
                  发布
                </button>
              )}
            </div>
          </div>
        )}
        {!searchActive && <p className="text-secondary-foreground/60 text-xs">限时特惠，抢完即止</p>}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none bg-card border-b border-border">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Search size={36} className="opacity-20 mb-3" />
            <p className="text-sm font-medium">没有找到相关活动</p>
            <p className="text-xs mt-1 opacity-70">换个关键词或分类试试</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <FlashSaleCard key={item.id} item={item} onOpen={onOpenItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
