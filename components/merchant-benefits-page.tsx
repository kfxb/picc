"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  Store,
  Share2,
  CalendarClock,
  Gift,
  Percent,
  Users,
  Zap,
  CheckCircle2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { usePosts } from "@/contexts/posts-context";
import type { MerchantBenefitItem } from "./detail-pages";

export const MERCHANT_BENEFIT_ITEMS: MerchantBenefitItem[] = [
  {
    id: 1,
    title: "首月零佣金入驻，轻松开启商家推广",
    merchant: "派城平台",
    location: "全城可用",
    benefitType: "入驻优惠",
    benefitTypeClass: "bg-green-50 text-green-700",
    desc: "新商家注册后首个自然月零平台佣金，帮助商家快速积累用户，降低试水成本。审核通过后立即生效。",
    endsAt: "2026-05-31",
    requirement: "新注册商家，需完成实名认证",
    piOnly: false,
  },
  {
    id: 2,
    title: "Pi支付商家专属流量加权",
    merchant: "派城平台",
    location: "全城可用",
    benefitType: "流量权益",
    benefitTypeClass: "bg-primary/10 text-primary",
    desc: "开启 Pi 支付的商家将在搜索结果和首页推荐中获得额外曝光权重，最高可提升3倍展示频率。",
    endsAt: "2026-12-31",
    requirement: "需完成 Pi 钱包绑定并开启 Pi 支付",
    piOnly: true,
  },
  {
    id: 3,
    title: "会员商家专属推广礼包",
    merchant: "派城平台",
    location: "全城可用",
    benefitType: "推广礼包",
    benefitTypeClass: "bg-orange-50 text-orange-700",
    desc: "成为会员商家可获得推广礼包：包括首页Banner展位1次、活动精选推荐2次、新用户定向推送500次。",
    endsAt: "2026-06-30",
    requirement: "年度会员商家",
    piOnly: false,
  },
  {
    id: 4,
    title: "限时免费发布10条活动信息",
    merchant: "派城平台",
    location: "全城可用",
    benefitType: "发布权益",
    benefitTypeClass: "bg-blue-50 text-blue-700",
    desc: "本月活动期间，所有认证商家均可免费发布最多10条商家活动信息，不消耗发布额度。",
    endsAt: "2026-04-30",
    requirement: "已完成商家认证",
    piOnly: false,
  },
  {
    id: 5,
    title: "团购活动报名商家享佣金减免",
    merchant: "派城平台",
    location: "全城可用",
    benefitType: "佣金优惠",
    benefitTypeClass: "bg-teal-50 text-teal-700",
    desc: "参与派城团购活动的商家，活动期间平台抽佣由5%降低至2%，极大提升商家利润空间。",
    endsAt: "2026-05-01",
    requirement: "需提前报名并经平台审核",
    piOnly: false,
  },
];

const benefitTypeIconMap: Record<string, React.ElementType> = {
  "入驻优惠": Store,
  "流量权益": Zap,
  "推广礼包": Gift,
  "发布权益": CheckCircle2,
  "佣金优惠": Percent,
};

function BenefitCard({
  item,
  onOpen,
}: {
  item: MerchantBenefitItem;
  onOpen: (item: MerchantBenefitItem) => void;
}) {
  const Icon = benefitTypeIconMap[item.benefitType] ?? Gift;
  return (
    <button
      onClick={() => onOpen(item)}
      className="w-full bg-card rounded-2xl border border-border shadow-sm p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.benefitTypeClass}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.benefitTypeClass}`}>
              {item.benefitType}
            </span>
            {item.piOnly && (
              <span className="flex items-center gap-0.5 text-[11px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                <span className="font-black leading-none">π</span> 专属
              </span>
            )}
          </div>
          <p className="text-foreground font-semibold text-sm leading-snug line-clamp-2 mb-1.5">{item.title}</p>
          <div className="flex items-center gap-1">
            <CalendarClock size={11} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">截止 {item.endsAt}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
      </div>
    </button>
  );
}

export function MerchantBenefitDetail({
  data,
  onBack,
  onOpenPublish,
}: {
  data: MerchantBenefitItem;
  onBack: () => void;
  onOpenPublish?: () => void;
}) {
  const Icon = benefitTypeIconMap[data.benefitType] ?? Gift;
  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="bg-secondary flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors" aria-label="返回">
          <ArrowLeft size={20} className="text-secondary-foreground" />
        </button>
        <h1 className="text-secondary-foreground font-bold text-base">商家福利详情</h1>
        <button className="p-2 rounded-full active:bg-white/10 transition-colors">
          <Share2 size={18} className="text-secondary-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero band */}
        <div className="h-40 bg-secondary flex flex-col items-center justify-center gap-3">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${data.benefitTypeClass}`}>
            <Icon size={30} />
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${data.benefitTypeClass}`}>{data.benefitType}</span>
        </div>

        <div className="px-4 pt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {data.piOnly && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                <span className="font-black">π</span> Pi 专属权益
              </span>
            )}
          </div>

          <h2 className="text-foreground font-bold text-xl leading-snug text-balance">{data.title}</h2>

          {/* Info rows */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
              <Store size={16} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">提供方</p>
                <p className="text-sm font-semibold text-foreground">{data.merchant}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
              <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">适用范围</p>
                <p className="text-sm font-semibold text-foreground">{data.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted rounded-xl p-3.5">
              <CalendarClock size={16} className="text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">有效截止</p>
                <p className="text-sm font-semibold text-foreground">{data.endsAt}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted rounded-xl p-3.5">
              <Users size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">领取条件</p>
                <p className="text-sm font-semibold text-foreground">{data.requirement}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-foreground font-bold text-sm mb-2">福利详情</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{data.desc}</p>
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
                  <p className="text-foreground font-bold text-sm">注册商家，领取福利</p>
                  <p className="text-muted-foreground text-xs mt-0.5">登录 Pi 账号完成商家认证</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-primary" />
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="px-4 pb-6 pt-1">
          <button className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity">
            立即申请领取
          </button>
        </div>
      </div>
    </div>
  );
}

export function MerchantBenefitsListPage({
  onBack,
  onOpenItem,
  onOpenPublish,
}: {
  onBack: () => void;
  onOpenItem: (item: MerchantBenefitItem) => void;
  onOpenPublish?: () => void;
}) {
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const types = ["全部", "入驻优惠", "流量权益", "推广礼包", "发布权益", "佣金优惠"];
  const { posts } = usePosts();

  const userItems = useMemo<MerchantBenefitItem[]>(() =>
    posts
      .filter((p) => p.kind === "merchant-benefit" && p.status === "已发布")
      .map((p) => ({
        id: 9000 + p.id,
        title: p.title,
        merchant: "我发布",
        location: p.location || "全城可用",
        benefitType: "发布权益",
        benefitTypeClass: "bg-blue-50 text-blue-700",
        desc: "",
        endsAt: "长期有效",
        requirement: "登录即可申请",
        piOnly: false,
      })),
  [posts]);

  const allItems = [...userItems, ...MERCHANT_BENEFIT_ITEMS];

  const filtered = allItems.filter((i) => {
    const matchType = filter === "全部" || i.benefitType === filter;
    const q = query.trim().toLowerCase();
    const matchQ = !q || i.title.toLowerCase().includes(q) || i.benefitType.toLowerCase().includes(q);
    return matchType && matchQ;
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
                placeholder="搜索福利名称..."
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
            <h1 className="text-secondary-foreground font-bold text-lg">商家福利</h1>
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
        {!searchActive && <p className="text-secondary-foreground/60 text-xs">为商家提供低成本高效推广工具</p>}
      </div>

      {/* Notice banner */}
      <div className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-start gap-3">
        <Gift size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-green-800 text-xs font-bold mb-0.5">商家专属权益中心</p>
          <p className="text-green-700 text-xs leading-relaxed">以下福利由派城平台提供，认证商家可申领。点击发布按钮可发布你的商家福利信息。</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none bg-card border-b border-border mt-3">
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${filter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Search size={36} className="opacity-20 mb-3" />
            <p className="text-sm font-medium">没有找到相关福利</p>
            <p className="text-xs mt-1 opacity-70">换个关键词或分类试试</p>
          </div>
        ) : (
          filtered.map((item) => (
            <BenefitCard key={item.id} item={item} onOpen={onOpenItem} />
          ))
        )}
      </div>
    </div>
  );
}
