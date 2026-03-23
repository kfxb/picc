"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  Store,
  Share2,
  CalendarClock,
  Sparkles,
  Tag,
  Plus,
  CheckCircle2,
  Search,
  X,
} from "lucide-react";
import { usePosts } from "@/contexts/posts-context";
import type { PiExclusiveItem } from "./detail-pages";

export const PI_EXCLUSIVE_ITEMS: PiExclusiveItem[] = [
  {
    id: 1,
    title: "Pi 支付享9折，全品类通用",
    merchant: "优选生活馆",
    location: "天河区天河路188号",
    discount: "9折",
    desc: "凡使用 Pi 支付结账，全场商品享9折优惠，不限品类，不与其他优惠叠加，每日限用一次。",
    piAmount: "最低 π 1",
    endsAt: "2026-06-30",
    category: "购物",
    isNew: true,
  },
  {
    id: 2,
    title: "Pi 支付咖啡第二杯半价",
    merchant: "星城咖啡",
    location: "天河区天河路88号",
    discount: "5折第二杯",
    desc: "使用 Pi 支付购买任意咖啡，第二杯享半价优惠，每单限用一次，每日可复用。",
    piAmount: "π 2.5起",
    endsAt: "2026-05-01",
    category: "餐饮",
    isNew: false,
  },
  {
    id: 3,
    title: "Pi 独家：健身月卡8折",
    merchant: "城市健身中心",
    location: "越秀区中山路56号",
    discount: "8折",
    desc: "Pi Network Pioneer 专属优惠，出示 Pi 账号凭证并使用 Pi 支付，健身月卡一律8折，季卡7折。",
    piAmount: "π 30起",
    endsAt: "2026-07-31",
    category: "运动",
    isNew: true,
  },
  {
    id: 4,
    title: "Pi 支付免配送费",
    merchant: "城区生鲜超市",
    location: "海珠区工业大道南",
    discount: "免配送费",
    desc: "线上下单选择 Pi 支付，当日配送全程免费，满 π 5 起送，限配送范围3km内。",
    piAmount: "π 5起",
    endsAt: "2026-04-30",
    category: "生鲜",
    isNew: false,
  },
  {
    id: 5,
    title: "Pi Pioneer 包间免费升级",
    merchant: "KTV 欢乐城",
    location: "荔湾区花地湾广场",
    discount: "免费升级",
    desc: "预订包间时出示 Pi 账号截图，可免费升级一档包间，使用 Pi 支付还可享欢唱时长延长30分钟。",
    piAmount: "π 20起",
    endsAt: "2026-05-31",
    category: "娱乐",
    isNew: true,
  },
];

function PiExclusiveCard({
  item,
  onOpen,
}: {
  item: PiExclusiveItem;
  onOpen: (item: PiExclusiveItem) => void;
}) {
  return (
    <button
      onClick={() => onOpen(item)}
      className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden active:scale-[0.98] transition-transform text-left"
    >
      {/* Colored band */}
      <div className="h-3 bg-secondary" />
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Discount badge */}
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-secondary flex flex-col items-center justify-center">
            <span className="text-primary font-black text-xl leading-none">{item.discount}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-0.5 text-[11px] font-black bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                <span className="font-black leading-none">π</span> 专属
              </span>
              {item.isNew && (
                <span className="text-[11px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">NEW</span>
              )}
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{item.category}</span>
            </div>
            <p className="text-foreground font-semibold text-sm leading-snug line-clamp-2 mb-1">{item.title}</p>
            <p className="text-muted-foreground text-xs">{item.merchant}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <MapPin size={10} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{item.location.split("区")[0]}区</span>
          </div>
          <span className="flex items-center gap-0.5 text-primary text-xs font-semibold">
            查看详情 <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </button>
  );
}

function FavoriteButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => setSaved((v) => !v)}
      className={`flex-1 font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity flex items-center justify-center gap-2 ${saved ? "bg-green-50 text-green-700 border border-green-200" : "bg-muted text-foreground"}`}
    >
      <CheckCircle2 size={15} className={saved ? "text-green-600" : "text-muted-foreground"} />
      {saved ? "已收藏" : "收藏优惠"}
    </button>
  );
}

export function PiExclusiveDetail({
  data,
  onBack,
  onOpenPublish,
}: {
  data: PiExclusiveItem;
  onBack: () => void;
  onOpenPublish?: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-secondary flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors" aria-label="返回">
          <ArrowLeft size={20} className="text-secondary-foreground" />
        </button>
        <h1 className="text-secondary-foreground font-bold text-base">Pi 专属权益</h1>
        <button className="p-2 rounded-full active:bg-white/10 transition-colors">
          <Share2 size={18} className="text-secondary-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero band */}
        <div className="h-44 bg-secondary flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center border-2 border-primary/30">
            <span className="text-primary font-black text-4xl leading-none">π</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary font-black text-2xl">{data.discount}</span>
            {data.isNew && (
              <span className="text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
            )}
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
              <Sparkles size={10} /> Pi 专属优惠
            </span>
            <span className="text-[11px] font-bold bg-muted text-muted-foreground px-3 py-1 rounded-full">{data.category}</span>
          </div>

          <h2 className="text-foreground font-bold text-xl leading-snug text-balance">{data.title}</h2>

          {/* Info rows */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
              <Store size={16} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">商家</p>
                <p className="text-sm font-semibold text-foreground">{data.merchant}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
              <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">地址</p>
                <p className="text-sm font-semibold text-foreground">{data.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
              <Tag size={16} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">最低 Pi 用量</p>
                <p className="text-sm font-semibold text-foreground">{data.piAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
              <CalendarClock size={16} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">有效截止</p>
                <p className="text-sm font-semibold text-foreground">{data.endsAt}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-foreground font-bold text-sm mb-2">权益说明</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{data.desc}</p>
          </div>

          {/* How to use */}
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/15">
            <p className="text-primary font-bold text-sm mb-3">如何使用</p>
            <div className="space-y-2.5">
              {["打开派城 App 找到该商家", "前往商家门店消费", "结账时选择 Pi 支付", "享受专属折扣权益"].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-xs font-black">{i + 1}</span>
                  </div>
                  <p className="text-foreground text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border" />

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
                  <p className="text-foreground font-bold text-sm">商家：发布 Pi 专属优惠</p>
                  <p className="text-muted-foreground text-xs mt-0.5">吸引 Pi Network 用户到店消费</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-primary" />
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="px-4 pb-6 pt-1">
          <div className="flex gap-3">
            <FavoriteButton />
            <button className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity">
              立即前往
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PiExclusiveListPage({
  onBack,
  onOpenItem,
  onOpenPublish,
}: {
  onBack: () => void;
  onOpenItem: (item: PiExclusiveItem) => void;
  onOpenPublish?: () => void;
}) {
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const categories = ["全部", "餐饮", "购物", "娱乐", "运动", "生鲜"];
  const { posts } = usePosts();

  const userItems = useMemo<PiExclusiveItem[]>(() =>
    posts
      .filter((p) => p.kind === "pi-exclusive" && p.status === "已发布")
      .map((p) => ({
        id: 9000 + p.id,
        title: p.title,
        merchant: "我发布",
        location: p.location || "未知地点",
        discount: "专属优惠",
        desc: "",
        piAmount: "π 1起",
        endsAt: "长期有效",
        category: "其他",
        isNew: true,
      })),
  [posts]);

  const allItems = [...userItems, ...PI_EXCLUSIVE_ITEMS];

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
                placeholder="搜索 Pi 优惠或商家..."
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
            <div className="flex items-center gap-2">
              <span className="text-primary font-black text-lg leading-none">π</span>
              <h1 className="text-secondary-foreground font-bold text-lg">Pi 专属</h1>
            </div>
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
        {!searchActive && (
          <p className="text-secondary-foreground/60 text-xs">Pi Network Pioneer 专属折扣与权益</p>
        )}
      </div>

      {/* Pi-exclusive notice */}
      <div className="mx-4 mt-4 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-primary font-black text-xl leading-none flex-shrink-0">π</span>
        <p className="text-primary text-xs font-semibold leading-snug">
          本专区内容仅向 Pi Network Pioneer 用户展示，需登录 Pi 账号后方可享用。
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none bg-card border-b border-border mt-3">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Search size={36} className="opacity-20 mb-3" />
            <p className="text-sm font-medium">没有找到相关优惠</p>
            <p className="text-xs mt-1 opacity-70">换个关键词或分类试试</p>
          </div>
        ) : (
          filtered.map((item) => (
            <PiExclusiveCard key={item.id} item={item} onOpen={onOpenItem} />
          ))
        )}
      </div>
    </div>
  );
}
