"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Eye,
  Phone,
  Star,
  MessageCircle,
  Navigation,
  Share2,
  Heart,
  ChevronRight,
  Tag,
  Wallet,
  Store,
  Package,
  Bell,
  Settings,
  HelpCircle,
  Shield,
  PackageOpen,
  Bookmark,
  MessageSquare,
  Pencil,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  X,
  Camera,
  User,
  Smartphone,
  Save,
} from "lucide-react";
import { usePosts } from "@/contexts/posts-context";
import type { PostStatus, PostKind } from "@/contexts/posts-context";
import { useUserProfile } from "@/contexts/user-profile-context";
import { usePiAuth } from "@/contexts/pi-auth-context";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProfilePageId =
  | "my-posts"
  | "favorites"
  | "messages"
  | "reviews"
  | "notifications"
  | "privacy"
  | "account"
  | "help"
  | "merchant-cert"
  | "privacy-policy";

export type PageState =
  | { type: "activity"; data: ActivityData }
  | { type: "deal"; data: DealData }
  | { type: "merchant"; data: MerchantData }
  | { type: "category"; data: CategoryData }
  | { type: "profile-sub"; id: ProfilePageId; initialStatusFilter?: PostStatus }
  | { type: "flash-sale"; data: FlashSaleItem; from?: "list" }
  | { type: "flash-sale-list" }
  | { type: "merchant-benefit"; data: MerchantBenefitItem; from?: "list" }
  | { type: "merchant-benefit-list" }
  | { type: "pi-exclusive"; data: PiExclusiveItem; from?: "list" }
  | { type: "pi-exclusive-list" };

// Keep old name as alias for compatibility
export type DetailPage = PageState;

export interface ActivityData {
  id: number;
  type: string;
  typeClass: string;
  title: string;
  merchant: string;
  address: string;
  time: string;
  views: number;
  posted: string;
  piPayment: boolean;
}

export interface DealData {
  id: number;
  section: string;
  category: string;
  categoryClass: string;
  title: string;
  seller: string;
  location: string;
  time: string;
  price: string;
  originalPrice: string | null;
  condition: string | null;
  comments: number;
  isHot: boolean;
}

export interface MerchantData {
  id: number;
  name: string;
  category: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  hours: string;
  phone: string;
  tags: string[];
  discount: string;
  pinX: string;
  pinY: string;
  lat?: number;
  lng?: number;
}

export interface CategoryData {
  label: string;
  color: string;
}

export interface FlashSaleItem {
  id: number;
  title: string;
  merchant: string;
  location: string;
  price: string;
  originalPrice: string;
  endsAt: string;
  category: string;
  desc: string;
  piPayment: boolean;
  isHot: boolean;
}

export interface MerchantBenefitItem {
  id: number;
  title: string;
  merchant: string;
  location: string;
  benefitType: string;
  benefitTypeClass: string;
  desc: string;
  endsAt: string;
  requirement: string;
  piOnly: boolean;
}

export interface PiExclusiveItem {
  id: number;
  title: string;
  merchant: string;
  location: string;
  discount: string;
  desc: string;
  piAmount: string;
  endsAt: string;
  category: string;
  isNew: boolean;
}

// ─── Shared Back Header ───────────────────────────────────────────────────────

function DetailHeader({
  title,
  onBack,
  actions,
}: {
  title: string;
  onBack: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-secondary px-4 pt-12 pb-4 flex items-center gap-3">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 active:bg-white/20 transition-colors"
        aria-label="返回"
      >
        <ArrowLeft size={18} className="text-secondary-foreground" />
      </button>
      <h1 className="flex-1 text-secondary-foreground font-bold text-base truncate">{title}</h1>
      {actions}
    </div>
  );
}

function InfoRow({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-primary" />
      </div>
      <span className="text-sm text-foreground leading-relaxed flex-1">{text}</span>
    </div>
  );
}

// ─── Activity Detail ──────────────────────────────────────────────────────────

export function ActivityDetail({
  data,
  onBack,
}: {
  data: ActivityData;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <DetailHeader
        title="活动详情"
        onBack={onBack}
        actions={
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
            <Share2 size={16} className="text-secondary-foreground" />
            <span className="sr-only">分享</span>
          </button>
        }
      />
      <div className="flex-1 pb-8">
        {/* Hero */}
        <div className="h-48 bg-secondary/80 flex flex-col items-center justify-center px-6">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full mb-4 ${data.typeClass}`}>{data.type}</span>
          <h2 className="text-secondary-foreground font-bold text-lg text-center leading-snug text-balance">{data.title}</h2>
        </div>

        <div className="px-4 pt-5 space-y-5">
          {/* Merchant card */}
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Store size={22} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-bold text-sm">{data.merchant}</p>
              <p className="text-muted-foreground text-xs mt-0.5">认证商家</p>
            </div>
            <button className="flex-shrink-0 flex items-center gap-1 text-primary text-xs font-semibold active:opacity-70 transition-opacity">
              关注 <ChevronRight size={12} />
            </button>
          </div>

          {/* Info list */}
          <div className="bg-card rounded-2xl border border-border px-4">
            <InfoRow icon={MapPin} text={data.address} />
            <InfoRow icon={Clock} text={data.time} />
            <InfoRow icon={Eye} text={`${data.views.toLocaleString()} 次浏览`} />
          </div>

          {/* Pi Payment badge */}
          {data.piPayment && (
            <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-black text-xl leading-none">π</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-primary font-bold text-sm">支持 Pi 支付</p>
                <p className="text-muted-foreground text-xs mt-0.5">使用 Pi 支付享受专属优惠</p>
              </div>
              <Wallet size={18} className="text-primary/50 flex-shrink-0" />
            </div>
          )}

          {/* Description */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-foreground font-bold text-sm mb-3">活动详情</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              本次活动由{data.merchant}精心策划，旨在为广大消费者提供更多实惠。活动期间凡消费均可享受特别优惠，欢迎广大市民前往参与，先到先得，名额有限。
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mt-3">
              如需进一步了解活动详情，请直接联系商家或前往活动现场咨询工作人员。
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground">发布于 {data.posted}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 bg-card border-t border-border">
        <button className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity">
          立即参与活动
        </button>
      </div>
    </div>
  );
}

// ─── Deal Detail ──────────────────────────────────────────────────────────────

export function DealDetail({
  data,
  onBack,
}: {
  data: DealData;
  onBack: () => void;
}) {
  const isSecondhand = data.section === "二手交易";
  const isWanted = data.section === "求购信息";

  return (
    <div className="flex flex-col min-h-full bg-background">
      <DetailHeader
        title={isSecondhand ? "二手商品详情" : isWanted ? "求购信息详情" : "优惠详情"}
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
              <Heart size={16} className="text-secondary-foreground" />
              <span className="sr-only">收藏</span>
            </button>
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
              <Share2 size={16} className="text-secondary-foreground" />
              <span className="sr-only">分享</span>
            </button>
          </div>
        }
      />

      <div className="flex-1 pb-8">
        {/* Image placeholder */}
        <div className="h-52 bg-muted flex flex-col items-center justify-center">
          <Package size={40} className="text-muted-foreground/25" />
          <p className="text-xs text-muted-foreground/40 mt-2">暂无图片</p>
        </div>

        <div className="px-4 pt-5 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${data.categoryClass}`}>{data.category}</span>
            {data.isHot && <span className="text-xs bg-red-50 text-red-600 font-bold px-3 py-1.5 rounded-full">热门</span>}
            {data.condition && <span className="text-xs bg-accent/10 text-accent font-bold px-3 py-1.5 rounded-full">{data.condition}</span>}
          </div>

          <h2 className="text-foreground font-bold text-lg leading-snug">{data.title}</h2>

          {/* Price */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{isWanted ? "预算" : "价格"}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-primary font-black text-2xl">{data.price}</span>
              {data.originalPrice && <span className="text-muted-foreground text-sm line-through">{data.originalPrice}</span>}
            </div>
          </div>

          {/* Info */}
          <div className="bg-card rounded-2xl border border-border px-4">
            <InfoRow icon={Tag} text={`类别：${data.section}`} />
            <InfoRow icon={MapPin} text={`地区：${data.location}`} />
            <InfoRow icon={Clock} text={`更新时间：${data.time}`} />
            <InfoRow icon={MessageCircle} text={`${data.comments} 条留言`} />
          </div>

          {/* Seller */}
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-black text-base leading-none">π</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-bold text-sm">{data.seller}</p>
              <p className="text-muted-foreground text-xs mt-0.5">Pi Network 认证用户</p>
            </div>
            <button className="flex-shrink-0 bg-accent/10 text-accent text-xs font-bold px-3 py-2 rounded-xl active:opacity-80 transition-opacity">
              联系
            </button>
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-foreground font-bold text-sm mb-3">详细说明</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isSecondhand
                ? "商品保存良好，功能完整，无明显划痕，使用痕迹轻微。支持当面交易，可以接受 Pi Network 支付。有意向者请直接联系，非诚勿扰。"
                : isWanted
                ? "诚意求购，价格合适即可成交。支持 Pi 支付，可面交或快递。如有合适商品请与我联系，谢谢。"
                : "本优惠活动真实有效，限时限量，欲购从速。使用 Pi 支付可享受额外折扣，详情请咨询商家。"}
            </p>
          </div>
        </div>
      </div>

      {/* Comments + CTA */}
      <DealActions postId={data.id} isWanted={isWanted} isSecondhand={isSecondhand} price={data.price ?? undefined} />
    </div>
  );
}

// ─── Deal comments + buy bottom panel ────────────────────────────────────────
interface Comment { id: number; piUsername: string; content: string; createdAt: string; }

function DealActions({ postId, isWanted, isSecondhand, price }: { postId: number; isWanted: boolean; isSecondhand: boolean; price?: string }) {
  const { wallet, createPayment } = usePiAuth();

  // Parse numeric Pi amount from price string e.g. "π 280" → 280
  const piAmount = useMemo(() => {
    if (!price) return null;
    const match = price.replace(/π\s*/i, "").match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  }, [price]);

  const [comments, setComments]           = useState<Comment[]>([]);
  const [commentText, setCommentText]     = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComments, setShowComments]   = useState(false);

  const [showBuy, setShowBuy]             = useState(false);
  const [buyMessage, setBuyMessage]       = useState("");
  const [buyContact, setBuyContact]       = useState("");
  const [buyDone, setBuyDone]             = useState(false);
  const [buyLoading, setBuyLoading]       = useState(false);
  const [payLoading, setPayLoading]       = useState(false);
  const [payDone, setPayDone]             = useState(false);

  // Load comments when panel opens
  useEffect(() => {
    if (!showComments) return;
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [showComments, postId]);

  async function submitComment() {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ piUsername: wallet?.username ?? "匿名用户", content: commentText.trim() }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentText("");
      }
    } catch {}
    setCommentLoading(false);
  }

  async function payWithPi() {
    console.log("[v0] payWithPi called, wallet:", wallet, "piAmount:", piAmount);
    if (!wallet) {
      alert("请先登录 Pi 账号");
      return;
    }
    if (!piAmount || piAmount <= 0) {
      alert("商品价格无效，无法发起支付");
      return;
    }
    setPayLoading(true);
    try {
      console.log("[v0] calling createPayment with amount:", piAmount);
      const paymentId = await createPayment({
        amount: piAmount,
        memo: `派城购买 #${postId}`,
        metadata: { postId, buyer: wallet.username },
      });
      console.log("[v0] payment result:", paymentId);
      if (paymentId) {
        setPayDone(true);
        setBuyDone(true);
      }
    } catch (e) {
      console.error("[PiCity] Pi payment failed:", e);
      alert("支付失败，请重试");
    }
    setPayLoading(false);
  }

  async function submitBuy() {
    if (!wallet) return;
    setBuyLoading(true);
    try {
      await fetch(`/api/posts/${postId}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ piUsername: wallet.username, message: buyMessage, contact: buyContact }),
      });
      setBuyDone(true);
    } catch {}
    setBuyLoading(false);
  }

  const ctaLabel = isWanted ? "我有这个" : isSecondhand ? "我要购买" : "立即领取";

  return (
    <>
      {/* CTA bar */}
      <div className="px-4 pb-6 pt-3 bg-card border-t border-border flex gap-3">
        <button
          onClick={() => { setShowComments(true); setShowBuy(false); }}
          className="flex-1 bg-muted text-muted-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity flex items-center justify-center gap-2"
        >
          <MessageCircle size={16} />
          留言{comments.length > 0 ? `（${comments.length}）` : ""}
        </button>
        <button
          onClick={() => { setShowBuy(true); setShowComments(false); setBuyDone(false); }}
          className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity"
        >
          {ctaLabel}
        </button>
      </div>

      {/* Comments bottom sheet */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowComments(false)} />
          <div className="relative bg-card rounded-t-3xl z-10 flex flex-col max-h-[75vh]">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border flex-shrink-0">
              <p className="font-bold text-foreground text-base">留言区</p>
              <button onClick={() => setShowComments(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:opacity-70">
                <X size={15} />
              </button>
            </div>
            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">暂无留言，快来第一个留言吧</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-xs font-bold">π</span>
                    </div>
                    <div className="flex-1 bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                      <p className="text-xs font-semibold text-foreground">{c.piUsername}</p>
                      <p className="text-sm text-foreground mt-0.5">{c.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.createdAt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Input */}
            <div className="flex-shrink-0 px-5 pb-8 pt-3 border-t border-border flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={wallet ? "写下你的留言..." : "请先连接 Pi 账号才能留言"}
                disabled={!wallet}
                className="flex-1 bg-muted rounded-xl px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
              />
              <button
                onClick={submitComment}
                disabled={!wallet || !commentText.trim() || commentLoading}
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 disabled:opacity-40"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy / contact bottom sheet */}
      {showBuy && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBuy(false)} />
          <div className="relative bg-card rounded-t-3xl z-10 px-5 pt-5 pb-10">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-foreground text-base">{ctaLabel}</p>
              <button onClick={() => setShowBuy(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:opacity-70">
                <X size={15} />
              </button>
            </div>

            {!wallet ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-muted-foreground text-sm">请先连接 Pi 账号</p>
                <p className="text-muted-foreground text-xs">连接后可直接联系发布者</p>
              </div>
            ) : buyDone ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 size={40} className="text-green-600 mx-auto" />
                <p className="text-foreground font-bold">消息已发送</p>
                <p className="text-muted-foreground text-sm">发布者收到你的消息后会与你联系</p>
                <button onClick={() => setShowBuy(false)} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 mt-2">
                  好的
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="text-green-800 text-xs font-semibold">Pi 账号：{wallet.username}</span>
                </div>
                <textarea
                  value={buyMessage}
                  onChange={(e) => setBuyMessage(e.target.value)}
                  placeholder="留言给发布者（选填，如：我想购买，请联系我）"
                  rows={3}
                  className="w-full bg-muted rounded-xl px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground resize-none"
                />
                <input
                  value={buyContact}
                  onChange={(e) => setBuyContact(e.target.value)}
                  placeholder="联系方式（微信号或手机号，选填）"
                  className="w-full bg-muted rounded-xl px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                {/* Pi Pay button — shown when item has a Pi price */}
                {piAmount && (
                  <button
                    onClick={payWithPi}
                    disabled={payLoading || payDone}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 text-white text-sm font-bold active:opacity-80 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                  >
                    <span className="font-black text-base">π</span>
                    {payDone ? "Pi 支付完成" : payLoading ? "支付处理中..." : `Pi 支付 ${price}`}
                  </button>
                )}
                <button
                  onClick={submitBuy}
                  disabled={buyLoading}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 disabled:opacity-60 transition-opacity"
                >
                  {buyLoading ? "发送中..." : "发送消息给发布者"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Merchant Detail ──────────────────────────────────────────────────────────

export function MerchantDetail({
  data,
  onBack,
}: {
  data: MerchantData;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <DetailHeader
        title="商家详情"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
              <Heart size={16} className="text-secondary-foreground" />
              <span className="sr-only">收藏</span>
            </button>
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
              <Share2 size={16} className="text-secondary-foreground" />
              <span className="sr-only">分享</span>
            </button>
          </div>
        }
      />

      <div className="flex-1 pb-8">
        {/* Hero */}
        <div className="h-44 bg-secondary/80 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center mb-3">
            <Store size={28} className="text-primary" />
          </div>
          <h2 className="text-secondary-foreground font-bold text-lg text-center">{data.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${data.isOpen ? "bg-green-400/20 text-green-300" : "bg-white/10 text-white/50"}`}>
              {data.isOpen ? "营业中" : "已打烊"}
            </span>
            <span className="text-xs bg-primary/20 text-primary font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="font-black leading-none">π</span> 支付
            </span>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">
          {/* Stats */}
          <div className="bg-card rounded-2xl border border-border grid grid-cols-3 divide-x divide-border">
            <div className="flex flex-col items-center py-4">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-primary fill-primary" />
                <span className="text-foreground font-black text-lg">{data.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5">评分</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-foreground font-black text-lg">{data.reviews}</span>
              <span className="text-xs text-muted-foreground mt-0.5">评价</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <span className="text-accent font-black text-lg">{data.distance}</span>
              <span className="text-xs text-muted-foreground mt-0.5">距离</span>
            </div>
          </div>

          {/* Pi Discount */}
          <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-black text-xl leading-none">π</span>
            </div>
            <div className="flex-1">
              <p className="text-primary font-bold text-sm">Pi 支付专属优惠</p>
              <p className="text-muted-foreground text-xs mt-0.5">{data.discount}</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-card rounded-2xl border border-border px-4">
            <InfoRow icon={MapPin} text={data.address} />
            <InfoRow icon={Clock} text={`营业时间：${data.hours}`} />
            <InfoRow icon={Phone} text={data.phone} />
          </div>

          {/* Tags */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-foreground font-bold text-sm mb-3">商家标签</h3>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span key={tag} className="text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-foreground font-bold text-sm mb-2">商家简介</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {data.name}是派城平台认证商家，支持 Pi Network 生态支付。商家提供优质的{data.category}服务，
              致力于为每一位顾客带来最佳消费体验。欢迎前往体验，并使用 Pi 支付享受专属优惠。
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <MerchantContactBar address={data.address} phone={data.phone} />
    </div>
  );
}

// ─── Merchant contact bar (no external links) ────────────────────────────────
function MerchantContactBar({ address, phone }: { address: string; phone: string }) {
  const [copied, setCopied] = useState<"address" | "phone" | null>(null);
  const [showAddress, setShowAddress] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  function copy(text: string, type: "address" | "phone") {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <>
      <div className="px-4 pb-6 pt-3 bg-card border-t border-border flex gap-3">
        <button
          onClick={() => { setShowAddress(true); setShowPhone(false); }}
          className="flex-1 bg-muted text-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity flex items-center justify-center gap-2"
        >
          <Navigation size={15} className="text-accent" />
          查看地址
        </button>
        <button
          onClick={() => { setShowPhone(true); setShowAddress(false); }}
          className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity flex items-center justify-center gap-2"
        >
          <Phone size={15} />
          联系商家
        </button>
      </div>

      {/* Address sheet */}
      {showAddress && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddress(false)} />
          <div className="relative bg-card rounded-t-3xl z-10 px-5 pt-5 pb-10">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <p className="font-bold text-foreground text-base mb-3">商家地址</p>
            <div className="bg-muted rounded-2xl p-4 flex items-start gap-3">
              <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-foreground text-sm leading-relaxed flex-1">{address}</p>
            </div>
            <button
              onClick={() => copy(address, "address")}
              className="w-full mt-4 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 transition-opacity flex items-center justify-center gap-2"
            >
              {copied === "address" ? <CheckCircle2 size={15} /> : <Navigation size={15} />}
              {copied === "address" ? "已复制地址" : "复制地址"}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-3">复制后可在地图应用中搜索导航</p>
          </div>
        </div>
      )}

      {/* Phone sheet */}
      {showPhone && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPhone(false)} />
          <div className="relative bg-card rounded-t-3xl z-10 px-5 pt-5 pb-10">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <p className="font-bold text-foreground text-base mb-3">联系商家</p>
            <div className="bg-muted rounded-2xl p-4 flex items-center gap-3">
              <Phone size={18} className="text-primary flex-shrink-0" />
              <p className="text-foreground text-lg font-mono font-bold tracking-wider flex-1">{phone}</p>
            </div>
            <button
              onClick={() => copy(phone, "phone")}
              className="w-full mt-4 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 transition-opacity flex items-center justify-center gap-2"
            >
              {copied === "phone" ? <CheckCircle2 size={15} /> : <Phone size={15} />}
              {copied === "phone" ? "已复制号码" : "复制电话号码"}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-3">复制后可在电话应用中拨打联系</p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Category Page ────────────────────────────────────────────────────────────

type CategoryItem =
  | { kind: "deal"; data: DealData }
  | { kind: "activity"; data: ActivityData }
  | { kind: "merchant"; data: MerchantData };

const categoryItems: Record<string, CategoryItem[]> = {
  餐饮美食: [
    { kind: "deal", data: { id: 101, section: "本地优惠", category: "餐饮", categoryClass: "bg-orange-50 text-orange-600", title: "招牌卤肉饭套餐 本周特价只需 π 3.8", seller: "台湾饭铺", location: "天河区", time: "今天", price: "π 3.8", originalPrice: "π 6.0", condition: null, comments: 18, isHot: true } },
    { kind: "deal", data: { id: 102, section: "本地优惠", category: "餐饮", categoryClass: "bg-orange-50 text-orange-600", title: "日式烤肉双人套餐立减30%", seller: "优选烤肉", location: "海珠区", time: "本周", price: "π 18", originalPrice: "π 26", condition: null, comments: 5, isHot: false } },
    { kind: "activity", data: { id: 103, type: "促销", typeClass: "bg-orange-50 text-orange-700", title: "粤式早茶自助 周末限定特惠", merchant: "茶香楼 · 越秀区", address: "越秀区中山六路", time: "每周末 09:00–11:30", views: 860, posted: "2天前", piPayment: true } },
  ],
  咖啡茶饮: [
    { kind: "deal", data: { id: 201, section: "本地优惠", category: "咖啡", categoryClass: "bg-amber-50 text-amber-700", title: "手冲咖啡买一赠一（下午场 14:00–17:00）", seller: "森林咖啡实验室", location: "越秀区", time: "每天", price: "π 5", originalPrice: "π 10", condition: null, comments: 34, isHot: true } },
    { kind: "deal", data: { id: 202, section: "本地优惠", category: "咖啡", categoryClass: "bg-amber-50 text-amber-700", title: "精品拿铁 Pi 支付享9折", seller: "星城咖啡", location: "天河区", time: "长期", price: "π 4.5", originalPrice: "π 5", condition: null, comments: 12, isHot: false } },
    { kind: "merchant", data: { id: 203, name: "蓝山精品咖啡", category: "咖啡", address: "番禺区大学城北路10号", distance: "2.0km", rating: 4.7, reviews: 190, isOpen: true, hours: "08:30–21:30", phone: "020-8888-0005", tags: ["手冲咖啡", "单品豆"], discount: "下午茶套餐 π 8起", pinX: "44%", pinY: "72%" } },
  ],
  购物优惠: [
    { kind: "deal", data: { id: 301, section: "本地优惠", category: "购物", categoryClass: "bg-blue-50 text-blue-600", title: "夏季新品全场7折起，限时三天", seller: "潮流服饰", location: "天河区", time: "限时3天", price: "π 35起", originalPrice: "π 50起", condition: null, comments: 21, isHot: false } },
    { kind: "deal", data: { id: 302, section: "本地优惠", category: "购物", categoryClass: "bg-blue-50 text-blue-600", title: "电子产品年终清仓3折起", seller: "数码城", location: "海珠区", time: "售完为止", price: "π 20起", originalPrice: "π 60起", condition: null, comments: 43, isHot: true } },
    { kind: "merchant", data: { id: 303, name: "数码城 · 综合馆", category: "购物", address: "海珠区工业大道南35号", distance: "2.4km", rating: 4.3, reviews: 531, isOpen: true, hours: "10:00–21:00", phone: "020-8888-0006", tags: ["电子产品", "维修服务"], discount: "Pi 支付加赠延保1年", pinX: "82%", pinY: "35%" } },
  ],
  娱乐休闲: [
    { kind: "deal", data: { id: 401, section: "本地优惠", category: "娱乐", categoryClass: "bg-purple-50 text-purple-600", title: "KTV包厢3小时 Pi 支付立减 π 5", seller: "星光KTV", location: "番禺区", time: "周一至周四", price: "π 35", originalPrice: "π 40", condition: null, comments: 9, isHot: false } },
    { kind: "deal", data: { id: 402, section: "本地优惠", category: "娱乐", categoryClass: "bg-purple-50 text-purple-600", title: "桌游馆畅玩3小时套餐", seller: "城市桌游", location: "天河区", time: "每天", price: "π 15", originalPrice: "π 20", condition: null, comments: 6, isHot: true } },
    { kind: "deal", data: { id: 403, section: "本地优惠", category: "娱乐", categoryClass: "bg-purple-50 text-purple-600", title: "电影票半价优惠（指定场次）", seller: "星影院", location: "越秀区", time: "周三场次", price: "π 10", originalPrice: "π 20", condition: null, comments: 15, isHot: false } },
  ],
  招聘信息: [
    { kind: "activity", data: { id: 501, type: "招聘", typeClass: "bg-blue-50 text-blue-700", title: "咖啡师2名 全职，有经验者优先，薪资面议", merchant: "蓝山精品咖啡 · 番禺区", address: "番禺区大学城北路", time: "长期有效", views: 420, posted: "1天前", piPayment: false } },
    { kind: "activity", data: { id: 502, type: "招聘", typeClass: "bg-blue-50 text-blue-700", title: "收银员3名 兼职，大学生优先，π 8/小时", merchant: "城市广场超市 · 白云区", address: "白云区白云大道北", time: "长期有效", views: 280, posted: "3天前", piPayment: false } },
    { kind: "activity", data: { id: 503, type: "招聘", typeClass: "bg-blue-50 text-blue-700", title: "平面设计师1名 有作品集，薪资面议", merchant: "创意工作室 · 天河区", address: "天河区珠江新城", time: "长期有效", views: 195, posted: "5天前", piPayment: false } },
  ],
  二手交易: [
    { kind: "deal", data: { id: 601, section: "二手交易", category: "数码", categoryClass: "bg-blue-50 text-blue-600", title: "iPhone 14 Pro 256G 深空黑 99成新，盒子配件齐全", seller: "陈先生", location: "海珠区", time: "昨天", price: "π 220", originalPrice: null, condition: "9成新", comments: 26, isHot: false } },
    { kind: "deal", data: { id: 602, section: "二手交易", category: "家具", categoryClass: "bg-green-50 text-green-600", title: "宜家实木书桌 140cm，搬家急售，自提优先", seller: "小李", location: "白云区", time: "2天前", price: "π 35", originalPrice: null, condition: "8成新", comments: 7, isHot: false } },
    { kind: "deal", data: { id: 603, section: "二手交易", category: "服饰", categoryClass: "bg-pink-50 text-pink-600", title: "全新未拆封 Nike Air Force 1 白色 42码", seller: "球鞋控张同学", location: "荔湾区", time: "今天", price: "π 65", originalPrice: null, condition: "全新", comments: 42, isHot: true } },
  ],
  商家活动: [
    { kind: "activity", data: { id: 701, type: "开业", typeClass: "bg-green-50 text-green-700", title: "盛大开业全场88折，前100名送礼品一份", merchant: "优选生活馆 · 天河区", address: "天河区天河路188号", time: "今天 10:00–21:00", views: 3240, posted: "1小时前", piPayment: true } },
    { kind: "activity", data: { id: 702, type: "促销", typeClass: "bg-orange-50 text-orange-700", title: "夏季新品上市，买两件第三件半价，限时三天", merchant: "时尚潮流服饰 · 越秀区", address: "越秀区北京路步行街", time: "限时3天", views: 1820, posted: "3小时前", piPayment: false } },
    { kind: "activity", data: { id: 703, type: "促销", typeClass: "bg-orange-50 text-orange-700", title: "进口红酒品鉴会，满200减50，Pi支付额外9折", merchant: "洋酒坊 · 荔湾区", address: "荔湾区龙津路", time: "每周六 19:00", views: 1430, posted: "3天前", piPayment: true } },
  ],
  "Pi 地图": [
    { kind: "merchant", data: { id: 801, name: "星城咖啡 · 天河店", category: "咖啡", address: "天河区天河路123号", distance: "0.3km", rating: 4.8, reviews: 320, isOpen: true, hours: "08:00–22:00", phone: "020-8888-0001", tags: ["精品咖啡", "舒适环境"], discount: "Pi 支付享9折", pinX: "28%", pinY: "38%" } },
    { kind: "merchant", data: { id: 802, name: "优选烤肉 · 海珠店", category: "餐饮", address: "海珠区江南大道中56号", distance: "0.8km", rating: 4.6, reviews: 218, isOpen: true, hours: "11:00–23:00", phone: "020-8888-0002", tags: ["日式烤肉", "家庭聚餐"], discount: "新用户享85折", pinX: "58%", pinY: "28%" } },
    { kind: "merchant", data: { id: 803, name: "数码城 · 综合馆", category: "购物", address: "海珠区工业大道南35号", distance: "2.4km", rating: 4.3, reviews: 531, isOpen: true, hours: "10:00–21:00", phone: "020-8888-0006", tags: ["电子产品", "维修服务"], discount: "Pi 支付加赠延保1年", pinX: "82%", pinY: "35%" } },
  ],
};

interface CategoryPageProps {
  data: CategoryData;
  onBack: () => void;
  onOpenActivity: (data: ActivityData) => void;
  onOpenDeal: (data: DealData) => void;
  onOpenMerchant: (data: MerchantData) => void;
}

// Maps PostKind to which category label it belongs to
const kindToCategoryLabel: Partial<Record<PostKind, string>> = {
  secondhand:       "二手交易",
  activity:         "商家活动",
  deal:             "购物优惠",
  "flash-sale":     "娱乐休闲",
  "merchant-benefit": "商家活动",
};

export function CategoryPage({ data, onBack, onOpenActivity, onOpenDeal, onOpenMerchant }: CategoryPageProps) {
  const { posts } = usePosts();

  // Build CategoryItem entries from published user posts that match this category
  const userItems = useMemo<CategoryItem[]>(() =>
    posts
      .filter((p) => p.status === "已发布" && kindToCategoryLabel[p.kind as PostKind] === data.label)
      .map((p): CategoryItem => {
        if (p.kind === "secondhand" || p.kind === "deal" || p.kind === "flash-sale") {
          return {
            kind: "deal",
            data: {
              id: 9000 + p.id,
              section: data.label,
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
            },
          };
        }
        return {
          kind: "activity",
          data: {
            id: 9000 + p.id,
            type: "发布",
            typeClass: "bg-primary/10 text-primary",
            title: p.title,
            merchant: "我发布",
            address: p.location || "未填写",
            time: "长期有效",
            views: p.views,
            posted: p.createdAt,
            piPayment: false,
          },
        };
      }),
  [posts, data.label]);

  const items = [...userItems, ...(categoryItems[data.label] ?? [])];

  function handleItemClick(item: CategoryItem) {
    if (item.kind === "activity") onOpenActivity(item.data);
    else if (item.kind === "deal") onOpenDeal(item.data);
    else if (item.kind === "merchant") onOpenMerchant(item.data);
  }

  function renderBadge(item: CategoryItem) {
    if (item.kind === "activity") {
      return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.data.typeClass}`}>{item.data.type}</span>;
    }
    if (item.kind === "deal") {
      return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.data.categoryClass}`}>{item.data.category}</span>;
    }
    return <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">商家</span>;
  }

  function renderTitle(item: CategoryItem) {
    if (item.kind === "activity") return item.data.title;
    if (item.kind === "deal") return item.data.title;
    return item.data.name;
  }

  function renderSub(item: CategoryItem) {
    if (item.kind === "activity") return item.data.merchant;
    if (item.kind === "deal") return `${item.data.seller} · ${item.data.location}`;
    return `${item.data.address} · ${item.data.distance}`;
  }

  function renderRight(item: CategoryItem) {
    if (item.kind === "deal") return <span className="text-primary font-bold text-sm">{item.data.price}</span>;
    if (item.kind === "merchant") {
      return (
        <div className="flex items-center gap-0.5">
          <Star size={11} className="text-primary fill-primary" />
          <span className="text-sm font-bold text-foreground">{item.data.rating}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-0.5">
        <Eye size={11} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{item.data.views}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      <DetailHeader title={data.label} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <PackageOpen size={36} className="opacity-25 mb-3" />
            <p className="text-sm font-medium">暂无内容</p>
          </div>
        )}
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleItemClick(item)}
            className="w-full bg-card rounded-2xl p-4 border border-border shadow-sm active:bg-muted/40 transition-colors text-left"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">{renderBadge(item)}</div>
                <h3 className="text-foreground font-semibold text-sm leading-snug line-clamp-2 mb-1.5">
                  {renderTitle(item)}
                </h3>
                <p className="text-muted-foreground text-xs">{renderSub(item)}</p>
              </div>
              <div className="flex-shrink-0 text-right pt-0.5">{renderRight(item)}</div>
            </div>
            <div className="flex justify-end mt-3 pt-3 border-t border-border">
              <span className="flex items-center gap-0.5 text-primary text-xs font-semibold">
                查看详情 <ChevronRight size={12} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Sub Pages ────────────────────────────────────────────────────────

const myPosts: ActivityData[] = [
  { id: 901, type: "促销", typeClass: "bg-orange-50 text-orange-700", title: "二手自行车出售，8成新，骑了两年", merchant: "本人发布", address: "天河区", time: "本周", views: 88, posted: "今天", piPayment: false },
  { id: 902, type: "二手", typeClass: "bg-blue-50 text-blue-700", title: "旧书一批低价处理，涵盖小说/教材/杂志", merchant: "本人发布", address: "越秀区", time: "3天前", views: 45, posted: "3天前", piPayment: false },
  { id: 903, type: "求购", typeClass: "bg-indigo-50 text-indigo-600", title: "求购：戴森吹风机，九成新以上，价格合适即可", merchant: "本人发布", address: "天河区", time: "1周前", views: 30, posted: "1周前", piPayment: false },
];

const myFavorites: MerchantData[] = [
  { id: 1001, name: "星城咖啡 · 天河店", category: "咖啡", address: "天河区天河路123号", distance: "0.3km", rating: 4.8, reviews: 320, isOpen: true, hours: "08:00–22:00", phone: "020-8888-0001", tags: ["精品咖啡"], discount: "Pi 支付享9折", pinX: "28%", pinY: "38%" },
  { id: 1002, name: "城市书吧 · 越秀店", category: "娱乐", address: "越秀区北京路98号", distance: "1.5km", rating: 4.9, reviews: 408, isOpen: false, hours: "09:00–21:00", phone: "020-8888-0004", tags: ["安静阅读"], discount: "会员免费借阅", pinX: "20%", pinY: "65%" },
  { id: 1003, name: "优选烤肉 · 海珠店", category: "餐饮", address: "海珠区江南大道中56号", distance: "0.8km", rating: 4.6, reviews: 218, isOpen: true, hours: "11:00–23:00", phone: "020-8888-0002", tags: ["日式烤肉"], discount: "新用户享85折", pinX: "58%", pinY: "28%" },
];

const messages = [
  { id: 1, sender: "星城咖啡", avatar: "π", time: "10分钟前", preview: "您的优惠券即将到期，请尽快使用！", unread: true },
  { id: 2, sender: "系统通知", avatar: "!", time: "1小时前", preview: "您发布的商品信息已通过审核，现已上线展示。", unread: true },
  { id: 3, sender: "优选烤肉", avatar: "π", time: "昨天", preview: "感谢您的关注，本周末有新活动，欢迎光临！", unread: false },
  { id: 4, sender: "王小明", avatar: "W", time: "2天前", preview: "您好，请问那台 MacBook 还在出售吗？", unread: false },
  { id: 5, sender: "派城客服", avatar: "P", time: "3天前", preview: "您好，欢迎使用派城！如有问题请随时联系我们。", unread: false },
];

// ─── Avatar options ────────────────────────────────────────────────────────────
const AVATAR_OPTIONS = [
  { color: "bg-primary",     emoji: "π" },
  { color: "bg-accent",      emoji: "π" },
  { color: "bg-secondary",   emoji: "π" },
  { color: "bg-rose-500",    emoji: "π" },
  { color: "bg-teal-500",    emoji: "π" },
  { color: "bg-violet-500",  emoji: "π" },
];

// ─── Account Settings Panel ─────────────────────────────────────────────────
function AccountSettingsPanel() {
  const { profile, updateNickname, updateAvatar, updateAvatarImage, updatePhone } = useUserProfile();
  const { wallet, connectWallet, walletLoading } = usePiAuth();

  // Which panel is expanded: null | "nickname" | "avatar" | "phone"
  const [open, setOpen] = useState<"nickname" | "avatar" | "phone" | null>(null);

  // Nickname edit state
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);

  // Phone edit state
  const [phoneInput, setPhoneInput] = useState(profile.phone);
  const [phoneStep, setPhoneStep] = useState<"input" | "verify">("input");
  const [codeInput, setCodeInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarImage || "");

  function openPanel(panel: "nickname" | "avatar" | "phone") {
    setOpen((prev) => (prev === panel ? null : panel));
    if (panel === "nickname") setNicknameInput(profile.nickname);
    if (panel === "phone") { setPhoneInput(profile.phone); setPhoneStep("input"); setCodeInput(""); setCodeSent(false); setPhoneError(""); }
    if (panel === "avatar") setAvatarPreview(profile.avatarImage || "");
  }

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function saveAvatar() {
    if (avatarPreview) {
      updateAvatarImage(avatarPreview);
    }
    setOpen(null);
  }

  function saveNickname() {
    if (nicknameInput.trim()) {
      updateNickname(nicknameInput.trim());
      setOpen(null);
    }
  }

  function sendCode() {
    const cleaned = phoneInput.replace(/\s/g, "");
    if (!/^1[3-9]\d{9}$/.test(cleaned)) {
      setPhoneError("请输入有效的11位手机号");
      return;
    }
    setPhoneError("");
    setCodeSent(true);
    setPhoneStep("verify");
  }

  function verifyCode() {
    if (codeInput.length < 4) { setPhoneError("请输入验证码"); return; }
    // Demo: any code passes
    updatePhone(phoneInput.replace(/\s/g, ""));
    setOpen(null);
    setPhoneStep("input");
  }

  const displayName = profile.nickname || wallet?.username || "";

  return (
    <div className="space-y-4 px-4 py-4">

      {/* Profile card */}
      <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
        {profile.avatarImage ? (
          <img src={profile.avatarImage} alt="头像" className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
        ) : (
          <div className={`w-16 h-16 rounded-2xl ${profile.avatarColor} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-black text-2xl">{profile.avatarEmoji}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {displayName ? (
            <p className="text-foreground font-bold text-base truncate">{displayName}</p>
          ) : (
            <p className="text-muted-foreground text-sm">尚未设置昵称</p>
          )}
          {wallet?.username && (
            <p className="text-muted-foreground text-xs mt-0.5 truncate">Pi 用户名：{wallet.username}</p>
          )}
          {profile.phone && (
            <p className="text-muted-foreground text-xs mt-0.5">已绑定 {profile.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</p>
          )}
        </div>
      </div>

      {/* Nickname */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => openPanel("nickname")}
          className="w-full flex items-center justify-between px-4 py-4 active:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <User size={15} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-foreground text-sm font-medium">修改昵称</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {profile.nickname ? profile.nickname : "未设置"}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${open === "nickname" ? "rotate-90" : ""}`} />
        </button>

        {open === "nickname" && (
          <div className="px-4 pb-4 pt-1 border-t border-border bg-muted/30 space-y-3">
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="请输入昵称（最多16字）"
              maxLength={16}
              className="w-full bg-card border border-border rounded-xl px-3.5 py-3 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
            />
            <div className="flex gap-2">
              <button onClick={() => setOpen(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-bold active:opacity-70">取消</button>
              <button onClick={saveNickname} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold active:opacity-80 flex items-center justify-center gap-1.5">
                <Save size={13} />保存
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => openPanel("avatar")}
          className="w-full flex items-center justify-between px-4 py-4 active:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
              <Camera size={15} className="text-accent" />
            </div>
            <p className="text-foreground text-sm font-medium">更换头像</p>
          </div>
          <div className="flex items-center gap-2">
            {profile.avatarImage ? (
              <img src={profile.avatarImage} alt="头像" className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div className={`w-7 h-7 rounded-lg ${profile.avatarColor} flex items-center justify-center`}>
                <span className="text-white text-xs font-black">{profile.avatarEmoji}</span>
              </div>
            )}
            <ChevronRight size={16} className={`text-muted-foreground transition-transform ${open === "avatar" ? "rotate-90" : ""}`} />
          </div>
        </button>

        {open === "avatar" && (
          <div className="px-4 pb-4 pt-3 border-t border-border bg-muted/30 space-y-4">
            {/* Preview */}
            <div className="flex flex-col items-center gap-3">
              {avatarPreview ? (
                <img src={avatarPreview} alt="头像预览" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
              ) : (
                <div className={`w-20 h-20 rounded-full ${profile.avatarColor} flex items-center justify-center border-2 border-border`}>
                  <span className="text-white font-black text-3xl">{profile.avatarEmoji}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">预览</p>
            </div>

            {/* Upload button */}
            <label className="flex flex-col items-center justify-center w-full py-5 rounded-2xl border-2 border-dashed border-border bg-card cursor-pointer active:bg-muted transition-colors gap-2">
              <Camera size={22} className="text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">点击上传头像</span>
              <span className="text-xs text-muted-foreground">支持 JPG、PNG，最大 5MB</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleAvatarFileChange}
              />
            </label>

            {avatarPreview && avatarPreview !== profile.avatarImage && (
              <button
                onClick={() => setAvatarPreview("")}
                className="w-full py-2 rounded-xl border border-border text-muted-foreground text-xs active:opacity-70"
              >
                移除已选图片
              </button>
            )}

            <div className="flex gap-2">
              <button onClick={() => setOpen(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-bold active:opacity-70">取消</button>
              <button onClick={saveAvatar} disabled={!avatarPreview} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold active:opacity-80 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <Save size={13} />保存
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Phone binding */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => openPanel("phone")}
          className="w-full flex items-center justify-between px-4 py-4 active:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Smartphone size={15} className="text-secondary" />
            </div>
            <div className="text-left">
              <p className="text-foreground text-sm font-medium">绑定手机号</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {profile.phone
                  ? profile.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") + "（已绑定）"
                  : "未绑定"}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className={`text-muted-foreground transition-transform ${open === "phone" ? "rotate-90" : ""}`} />
        </button>

        {open === "phone" && (
          <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/30 space-y-3">
            {phoneStep === "input" ? (
              <>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(""); }}
                  placeholder="请输入11位手机号"
                  maxLength={11}
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-3 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
                />
                {phoneError && <p className="text-destructive text-xs">{phoneError}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setOpen(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-bold active:opacity-70">取消</button>
                  <button onClick={sendCode} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold active:opacity-80">发送验证码</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">验证码已发送至 {phoneInput}（演示：任意4位数字）</p>
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setPhoneError(""); }}
                  placeholder="请输入验证码"
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-3 text-sm text-foreground outline-none focus:border-primary/60 transition-colors tracking-widest"
                />
                {phoneError && <p className="text-destructive text-xs">{phoneError}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setPhoneStep("input")} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-bold active:opacity-70">返回</button>
                  <button onClick={verifyCode} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold active:opacity-80 flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} />验证并绑定
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Pi account */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="text-amber-700 font-black text-sm">π</span>
            </div>
            <p className="text-foreground text-sm font-medium">Pi 账号</p>
          </div>
          {wallet ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
                <span className="text-green-800 text-xs font-bold">已连接 Pi 账号</span>
              </div>
              <div className="space-y-1 pl-5">
                <p className="text-green-700 text-xs">用户名：<span className="font-semibold">{wallet.username}</span></p>
                <p className="text-green-700 text-xs font-mono break-all">地址：{wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-muted rounded-xl p-3.5 text-center">
                <p className="text-muted-foreground text-xs">尚未连接 Pi 账号</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">连接后可显示 Pi 用户名并使用 Pi 支付</p>
              </div>
              <button
                onClick={() => connectWallet()}
                disabled={walletLoading}
                className="w-full py-3 rounded-xl bg-amber-500 text-white text-sm font-bold active:opacity-80 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                <Wallet size={15} />
                {walletLoading ? "连接中..." : "连接 Pi 账号"}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Privacy Policy Panel ────────────────────────────────────────────────────
function PrivacyPolicyPanel() {
  const sections = [
    {
      title: "1. 信息收集范围",
      content: "派城仅收集应用功能所必需的最少数据。具体包括：\n\n• Pi 用户名及账号 ID（用于身份识别，来自 Pi Network 官方授权）\n• 用户发布的内容（标题、地址、价格、图片等商业信息）\n• 商家认证时填写的店铺名称、经营地址、联系电话（仅用于认证审核）\n• 留言及购买意向消息\n\n派城不收集你的邮箱地址、设备标识符、位置追踪数据或任何非必要个人信息。",
    },
    {
      title: "2. 信息使用方式",
      content: "收集的信息仅用于以下目的：\n\n• 展示商业信息给其他用户\n• 完成商家认证审核\n• 支持用户之间的交流（留言、购买意向）\n• 维护平台安全和内容审核\n\n派城不会将你的个人信息出售、租借或以任何形式提供给第三方用于商业目的。",
    },
    {
      title: "3. Pi Network 数据",
      content: "派城通过 Pi Network 官方 SDK 进行身份验证，仅申请以下权限：\n\n• username（用户名，用于显示和身份识别）\n• payments（支付功能，用于 Pi 交易）\n• wallet_address（钱包地址，用于交易验证）\n\n我们不存储你的 Pi 私钥，不能代表你发起任何交易。所有 Pi 支付均需要你在 Pi Browser 中明确确认。",
    },
    {
      title: "4. 数据存储与安全",
      content: "• 所有数据存储在位于新加坡的云数据库（Neon PostgreSQL）\n• 数据传输全程使用 SSL/TLS 加密\n• 我们定期清理无效数据，不会无限期保存用户信息\n• 你有权随时要求删除你发布的内容",
    },
    {
      title: "5. 手机号说明",
      content: "账号设置中的手机号绑定功能属于可选项，仅用于：\n\n• 商家认证联系方式\n• 账号安全验证（选填）\n\n手机号不用于登录，不会公开显示给其他用户，不会用于营销推送。",
    },
    {
      title: "6. 用户权利",
      content: "你对自己的数据拥有完全控制权：\n\n• 随时删除你发布的内容\n• 申请注销账号并删除所有相关数据\n• 查看平台存储的你的信息\n\n如需行使上述权利，请通过平台消息功能联系管理员。",
    },
    {
      title: "7. 政策更新",
      content: "本隐私政策如有重大变更，将在应用内通知用户。继续使用派城即表示你接受最新版本的隐私政策。\n\n最后更新：2025年3月",
    },
  ];

  return (
    <div className="px-4 py-4 space-y-1">
      <div className="bg-secondary rounded-2xl p-4 mb-4">
        <p className="text-secondary-foreground font-bold text-sm">派城（PiCity）隐私政策</p>
        <p className="text-secondary-foreground/60 text-xs mt-1 leading-relaxed">
          我们重视你的隐私。本政策说明派城如何收集、使用和保护你的个人信息，符合 Pi Network 开发者规范要求。
        </p>
      </div>
      {sections.map((s) => (
        <div key={s.title} className="bg-card rounded-2xl border border-border p-4 space-y-2">
          <p className="text-foreground font-bold text-sm">{s.title}</p>
          <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">{s.content}</p>
        </div>
      ))}
      <p className="text-xs text-muted-foreground text-center pt-2 pb-4">
        如有疑问，请通过消息功能联系派城运营团队
      </p>
    </div>
  );
}

// ─── Merchant Certification Panel ───────────────────────────────────────────
const CERT_STEPS = [
  { step: 1, title: "连接 Pi 账号", desc: "确保你的 Pi 钱包已连接，作为商家身份凭证" },
  { step: 2, title: "填写商家信息", desc: "提供店铺名称、经营类目、联系方式和地址" },
  { step: 3, title: "提交审核",     desc: "平台在 1-3 个工作日内完成审核，结果将通知你" },
  { step: 4, title: "认证通过",     desc: "获得认证商家标识，享受平台专属推广资源" },
];

const CATEGORY_OPTIONS = ["餐饮美食", "咖啡饮品", "生活服务", "休闲娱乐", "购物零售", "教育培训", "健康美容", "其他"];

type CertStatus = "none" | "filling" | "submitted" | "approved";

function MerchantCertPanel() {
  const { wallet, connectWallet, walletLoading } = usePiAuth();
  const [certStatus, setCertStatus] = useState<CertStatus>(() => {
    if (typeof window === "undefined") return "none";
    try { return (localStorage.getItem("picicity_cert_status") as CertStatus) || "none"; } catch { return "none"; }
  });

  // Form state
  const [shopName, setShopName]     = useState("");
  const [category, setCategory]     = useState(CATEGORY_OPTIONS[0]);
  const [address, setAddress]       = useState("");
  const [phone, setPhone]           = useState("");
  const [desc, setDesc]             = useState("");
  const [errors, setErrors]         = useState<Record<string, string>>({});

  function saveCertStatus(s: CertStatus) {
    setCertStatus(s);
    try { localStorage.setItem("picicity_cert_status", s); } catch {}
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!shopName.trim())  e.shopName = "请填写店铺名称";
    if (!address.trim())   e.address  = "请填写经营地址";
    if (!/^1[3-9]\d{9}$/.test(phone.replace(/\s/g, ""))) e.phone = "请输入有效手机号";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    saveCertStatus("submitted");
  }

  // Status: approved (demo only — simulate approve)
  if (certStatus === "approved") {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <div>
            <p className="text-green-800 font-bold text-lg">认证商家</p>
            <p className="text-green-700 text-sm mt-1">恭喜！你的商家资质已通过认证</p>
          </div>
          <div className="w-full bg-white rounded-xl border border-green-100 p-3.5 text-left space-y-1.5">
            <p className="text-xs text-muted-foreground">认证有效期至 <span className="text-foreground font-semibold">2026-12-31</span></p>
            <p className="text-xs text-muted-foreground">认证编号 <span className="text-foreground font-mono font-semibold">PC-2025-{Math.floor(Math.random()*90000)+10000}</span></p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
          <p className="text-sm font-bold text-foreground">认证商家专属权益</p>
          {["首页推荐位曝光", "发布活动免审核加速", "Pi 专属商家标识", "平台运营活动优先参与", "专属客服支持"].map((b) => (
            <div key={b} className="flex items-center gap-2.5">
              <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
              <span className="text-sm text-foreground">{b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Status: submitted — pending review
  if (certStatus === "submitted") {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock size={30} className="text-amber-600" />
          </div>
          <div>
            <p className="text-amber-800 font-bold text-base">审核中</p>
            <p className="text-amber-700 text-sm mt-1">资料已提交，预计 1-3 个工作日完成审核</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {CERT_STEPS.map((s, i) => (
            <div key={s.step} className={`flex gap-3 px-4 py-3.5 ${i < CERT_STEPS.length - 1 ? "border-b border-border" : ""}`}>
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5
                ${s.step <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {s.step <= 2 ? <CheckCircle2 size={13} /> : s.step}
              </div>
              <div>
                <p className={`text-sm font-semibold ${s.step <= 3 ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Demo: simulate approval */}
        <button
          onClick={() => saveCertStatus("approved")}
          className="w-full py-3 rounded-2xl bg-green-600 text-white text-sm font-bold active:opacity-80"
        >
          模拟审核通过（演示）
        </button>
      </div>
    );
  }

  // Status: filling form
  if (certStatus === "filling") {
    if (!wallet) {
      return (
        <div className="px-4 py-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-700 font-black text-2xl">π</span>
          </div>
          <div>
            <p className="text-foreground font-bold">请先连接 Pi 账号</p>
            <p className="text-muted-foreground text-sm mt-1">商家认证需要 Pi 账号作为身份凭证</p>
          </div>
          <button
            onClick={() => connectWallet()}
            disabled={walletLoading}
            className="w-full max-w-xs py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 disabled:opacity-60"
          >
            {walletLoading ? "连接中..." : "连接 Pi 账号"}
          </button>
        </div>
      );
    }

    return (
      <div className="px-4 py-4 space-y-4">
        {/* Pi account badge */}
        <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-green-800 text-xs font-bold">Pi 账号已连接</p>
            <p className="text-green-700 text-xs mt-0.5 truncate">{wallet.username}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {/* Shop name */}
          <div className="px-4 py-3.5 space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">店铺名称 *</label>
            <input
              value={shopName}
              onChange={(e) => { setShopName(e.target.value); setErrors((p) => ({ ...p, shopName: "" })); }}
              placeholder="请输入店铺名称"
              className="w-full text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
            />
            {errors.shopName && <p className="text-destructive text-xs">{errors.shopName}</p>}
          </div>
          {/* Category */}
          <div className="px-4 py-3.5 space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">经营类目 *</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-transparent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Address */}
          <div className="px-4 py-3.5 space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">经营地址 *</label>
            <input
              value={address}
              onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
              placeholder="请输入详细地址"
              className="w-full text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
            />
            {errors.address && <p className="text-destructive text-xs">{errors.address}</p>}
          </div>
          {/* Phone */}
          <div className="px-4 py-3.5 space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">联系手机 *</label>
            <input
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
              placeholder="请输入11位手机号"
              type="tel"
              maxLength={11}
              className="w-full text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
            />
            {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
          </div>
          {/* Description */}
          <div className="px-4 py-3.5 space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">商家简介（选填）</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="简单介绍你的店铺，帮助用户了解你的服务..."
              rows={3}
              className="w-full text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 transition-opacity"
        >
          提交认证申请
        </button>
        <p className="text-xs text-muted-foreground text-center px-2">
          提交即表示你同意平台商家服务协议，审核结果将通过消息通知。
        </p>
      </div>
    );
  }

  // Default: intro screen
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Hero */}
      <div className="bg-secondary rounded-2xl p-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
          <Store size={30} className="text-primary" />
        </div>
        <p className="text-secondary-foreground font-bold text-lg">成为派城认证商家</p>
        <p className="text-secondary-foreground/60 text-sm mt-1.5 leading-relaxed">
          通过认证，获得专属商家标识，享受平台推广资源和优先曝光
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">认证商家专属权益</p>
        {[
          { icon: "🏅", label: "认证标识",   desc: "商家主页显示官方认证徽章，提升用户信任度" },
          { icon: "📢", label: "优先曝光",   desc: "首页推荐位、搜索结果优先展示认证商家" },
          { icon: "⚡", label: "发布加速",   desc: "活动发布享受快速审核通道，最快2小时上线" },
          { icon: "π",  label: "Pi 支付",   desc: "支持 Pi Network 支付，接触更多 Pioneer 用户" },
        ].map((b) => (
          <div key={b.label} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
              {b.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{b.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <p className="text-sm font-bold text-foreground px-4 pt-4 pb-2">认证流程</p>
        {CERT_STEPS.map((s, i) => (
          <div key={s.step} className={`flex gap-3 px-4 py-3 ${i < CERT_STEPS.length - 1 ? "border-b border-border" : ""}`}>
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {s.step}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => saveCertStatus("filling")}
        className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 transition-opacity"
      >
        立即申请商家认证
      </button>
    </div>
  );
}

const profileSubConfig: Record<
  ProfilePageId,
  { title: string; icon: React.ElementType }
> = {
  "my-posts":       { title: "我的发布",   icon: PackageOpen },
  favorites:        { title: "我的收藏",   icon: Bookmark },
  messages:         { title: "消息中心",   icon: MessageSquare },
  reviews:          { title: "我的评价",   icon: Star },
  notifications:    { title: "通知设置",   icon: Bell },
  privacy:          { title: "隐私与安全", icon: Shield },
  account:          { title: "账号设置",   icon: Settings },
  help:             { title: "帮助与反馈", icon: HelpCircle },
  "merchant-cert":  { title: "商家认证",   icon: Store },
  "privacy-policy": { title: "隐私政策",   icon: Shield },
};

interface ProfileSubPageProps {
  id: ProfilePageId;
  onBack: () => void;
  onOpenPublish?: () => void;
  initialStatusFilter?: PostStatus;
}

const statusStyle: Record<PostStatus, string> = {
  "审核中": "bg-amber-50 text-amber-700",
  "已发布": "bg-green-50 text-green-700",
  "已下线": "bg-muted text-muted-foreground",
};

const kindFilterTabs: { label: string; kinds: PostKind[] | null }[] = [
  { label: "全部", kinds: null },
  { label: "活动", kinds: ["activity"] },
  { label: "优惠", kinds: ["deal"] },
  { label: "二手", kinds: ["secondhand"] },
  { label: "限时", kinds: ["flash-sale"] },
  { label: "福利", kinds: ["merchant-benefit"] },
  { label: "Pi专属", kinds: ["pi-exclusive"] },
];

const STATUS_TABS: { label: string; value: PostStatus | "全部" }[] = [
  { label: "全部",  value: "全部"  },
  { label: "审核中", value: "审核中" },
  { label: "已发布", value: "已发布" },
  { label: "已下线", value: "已下线" },
];

export function ProfileSubPage({ id, onBack, onOpenPublish, initialStatusFilter }: ProfileSubPageProps) {
  const config = profileSubConfig[id];
  const { posts, deletePost, toggleStatus, editPost, approvePost } = usePosts();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [kindFilter, setKindFilter] = useState<string>("全部");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "全部">(initialStatusFilter ?? "全部");

  function startEdit(id: number, title: string, location: string) {
    setEditingId(id);
    setEditTitle(title);
    setEditLocation(location);
    setConfirmDelete(null);
  }

  function saveEdit() {
    if (editingId !== null) {
      editPost(editingId, { title: editTitle.trim() || undefined, location: editLocation });
    }
    setEditingId(null);
  }

  const visiblePosts = posts.filter((p) => {
    const tab = kindFilterTabs.find((t) => t.label === kindFilter);
    const matchKind = !tab || tab.kinds === null || tab.kinds.includes(p.kind);
    const matchStatus = statusFilter === "全部" || p.status === statusFilter;
    return matchKind && matchStatus;
  });

  return (
    <div className="flex flex-col min-h-full bg-background">
      <DetailHeader title={config.title} onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        {/* My Posts */}
        {id === "my-posts" && (
          <div>
            {/* Stats summary */}
            <div className="grid grid-cols-3 border-b border-border bg-card">
              {[
                { label: "全部发布", value: posts.length },
                { label: "已发布", value: posts.filter((p) => p.status === "已发布").length },
                { label: "审核中", value: posts.filter((p) => p.status === "审核中").length },
              ].map((s, i) => (
                <div key={s.label} className={`flex flex-col items-center py-3.5 ${i < 2 ? "border-r border-border" : ""}`}>
                  <span className="text-lg font-bold text-foreground">{s.value}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Status filter tabs */}
            <div className="flex border-b border-border bg-card">
              {STATUS_TABS.map((tab) => {
                const count = tab.value === "全部" ? posts.length : posts.filter((p) => p.status === tab.value).length;
                const isActive = statusFilter === tab.value;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setStatusFilter(tab.value)}
                    className={`flex-1 py-3 text-xs font-bold transition-colors relative ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && <span className="ml-1 opacity-70">{count}</span>}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Kind filter tabs */}
            <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none border-b border-border bg-card">
              {kindFilterTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setKindFilter(tab.label)}
                  className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    kindFilter === tab.label
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.label}
                  {tab.kinds !== null && posts.filter((p) => tab.kinds!.includes(p.kind)).length > 0 && (
                    <span className="ml-1 opacity-70">{posts.filter((p) => tab.kinds!.includes(p.kind)).length}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="px-4 py-4 space-y-3">
              {visiblePosts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <PackageOpen size={36} className="opacity-25 mb-3" />
                  <p className="text-sm font-medium">
                    {kindFilter === "全部" ? "暂无发布内容" : `暂无「${kindFilter}」类发布`}
                  </p>
                  <p className="text-xs mt-1">点击下方按钮发布第一条信息</p>
                </div>
              )}
              {visiblePosts.map((post) => (
                <div key={post.id} className="bg-card rounded-2xl border border-border p-4">
                  {/* Top row: type badge + status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${post.kindClass}`}>{post.kindLabel}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyle[post.status]}`}>{post.status}</span>
                  </div>

                  {/* Inline edit form */}
                  {editingId === post.id ? (
                    <div className="space-y-2.5 mb-3">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground mb-1">标题</p>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground mb-1">位置</p>
                        <input
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setEditingId(null)} className="flex-1 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold active:opacity-70">取消</button>
                        <button onClick={saveEdit} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold active:opacity-80">保存</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-foreground font-semibold text-sm leading-snug mb-1">{post.title}</h3>
                      {post.location && <p className="text-muted-foreground text-xs mb-1">{post.location}</p>}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Eye size={11} />
                          <span>{post.views} 浏览</span>
                        </div>
                        <span>{post.createdAt}</span>
                      </div>
                    </>
                  )}

                  {/* Action row */}
                  {editingId !== post.id && (
                    confirmDelete === post.id ? (
                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        <p className="flex-1 text-xs text-destructive font-medium">确认删除这条发布？</p>
                        <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-bold active:opacity-70">取消</button>
                        <button onClick={() => { deletePost(post.id); setConfirmDelete(null); }} className="px-3 py-1.5 rounded-lg bg-destructive text-white text-xs font-bold active:opacity-70">删除</button>
                      </div>
                    ) : post.status === "审核中" ? (
                      /* Pending review — show approve action */
                      <div className="pt-3 border-t border-border space-y-2.5">
                        <div className="flex items-start gap-2.5 bg-amber-50 rounded-xl px-3 py-2.5">
                          <Clock size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-amber-800 text-xs font-bold">正在审核</p>
                            <p className="text-amber-700 text-[11px] mt-0.5 leading-relaxed">
                              内容已提交，预计 24 小时内完成审核。审核通过后将自动发布。
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {approvingId === post.id ? (
                            <div className="flex-1 py-2.5 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center gap-2">
                              <CheckCircle2 size={14} className="text-green-600" />
                              <span className="text-green-700 text-xs font-bold">审核通过，已发布</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setApprovingId(post.id);
                                setTimeout(() => {
                                  approvePost(post.id);
                                  setApprovingId(null);
                                }, 1200);
                              }}
                              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold active:opacity-80 transition-opacity flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 size={13} />
                              通过审核
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete(post.id)}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-destructive/10 text-xs font-bold text-destructive active:opacity-70 transition-opacity"
                          >
                            <Trash2 size={12} />撤回
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        <button
                          onClick={() => toggleStatus(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-bold text-foreground active:opacity-70 transition-opacity"
                        >
                          {post.status === "已发布"
                            ? <><ToggleRight size={13} className="text-green-600" />下线</>
                            : <><ToggleLeft size={13} className="text-muted-foreground" />上线</>}
                        </button>
                        <button
                          onClick={() => startEdit(post.id, post.title, post.location)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-bold text-foreground active:opacity-70 transition-opacity"
                        >
                          <Pencil size={12} />编辑
                        </button>
                        <button
                          onClick={() => setConfirmDelete(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-xs font-bold text-destructive active:opacity-70 transition-opacity ml-auto"
                        >
                          <Trash2 size={12} />删除
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
              <button
                onClick={onOpenPublish}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm active:opacity-80 transition-opacity flex items-center justify-center gap-2 mt-2"
              >
                <Plus size={16} />
                发布新信息
              </button>
            </div>
          </div>
        )}

        {/* Favorites */}
        {id === "favorites" && (
          <div className="px-4 py-4 space-y-3">
            {myFavorites.map((m) => (
              <div key={m.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Store size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-foreground font-bold text-sm truncate">{m.name}</h3>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${m.isOpen ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {m.isOpen ? "营业" : "打烊"}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">{m.address}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-primary fill-primary" />
                        <span className="text-xs font-bold text-foreground">{m.rating}</span>
                      </div>
                      <span className="text-xs text-primary font-semibold">{m.discount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        {id === "messages" && (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <button key={msg.id} className="w-full flex items-start gap-3 px-4 py-4 active:bg-muted transition-colors text-left">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm ${msg.sender === "系统通知" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"}`}>
                  {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-foreground font-semibold text-sm truncate">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{msg.time}</span>
                  </div>
                  <p className="text-muted-foreground text-xs line-clamp-2">{msg.preview}</p>
                </div>
                {msg.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
              </button>
            ))}
          </div>
        )}

        {/* Reviews */}
        {id === "reviews" && (
          <div className="px-4 py-4 space-y-3">
            {[
              { merchant: "星城咖啡 · 天河店", rating: 5, comment: "环境非常好，咖啡很香，用 Pi 支付还打了折，很满意！", date: "2026/03/10" },
              { merchant: "优选烤肉 · 海珠店", rating: 4, comment: "烤肉质量不错，服务也好，下次还会来。", date: "2026/02/28" },
            ].map((r, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-semibold text-sm">{r.merchant}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={12} className="text-primary fill-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{r.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">{r.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Settings pages */}
        {(id === "notifications" || id === "privacy" || id === "account" || id === "merchant-cert" || id === "privacy-policy") && (
          <div className="px-4 py-4">
            {id === "notifications" && (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {[
                  { label: "商家活动通知", on: true },
                  { label: "优惠信息推送", on: true },
                  { label: "消息回复提醒", on: true },
                  { label: "系统公告", on: false },
                ].map((item, i, arr) => (
                  <div key={item.label} className={`flex items-center justify-between px-4 py-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-foreground text-sm font-medium">{item.label}</span>
                    <div className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors ${item.on ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                      <div className="w-5 h-5 rounded-full bg-card shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {id === "privacy" && (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {["数据与隐私", "账号安全", "第三方授权", "注销账号"].map((item, i, arr) => (
                  <button key={item} className={`w-full flex items-center justify-between px-4 py-4 active:bg-muted transition-colors ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <span className={`text-sm font-medium ${item === "注销账号" ? "text-destructive" : "text-foreground"}`}>{item}</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
            {id === "account" && <AccountSettingsPanel />}
            {id === "merchant-cert" && <MerchantCertPanel />}
            {id === "privacy-policy" && <PrivacyPolicyPanel />}
          </div>
        )}

        {/* Help */}
        {id === "help" && (
          <div className="px-4 py-4 space-y-3">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {["使用说明", "常见问题", "联系客服", "意见反馈", "关于派城"].map((item, i, arr) => (
                <button key={item} className={`w-full flex items-center justify-between px-4 py-4 active:bg-muted transition-colors ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-foreground text-sm font-medium">{item}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
            <div className="bg-secondary rounded-2xl p-4 text-center">
              <p className="text-secondary-foreground/60 text-xs">派城 PiCity v1.0.0</p>
              <p className="text-secondary-foreground/40 text-[11px] mt-1">基于 Pi Network 生态 · 让城市商业更简单</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
