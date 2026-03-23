"use client";

import { useState, useMemo } from "react";
import { Search, Plus, MapPin, Clock, Eye, Filter, ChevronRight, Megaphone } from "lucide-react";
import { usePosts } from "@/contexts/posts-context";
import type { ActivityData } from "./detail-pages";

const activityTypes = ["全部", "开业活动", "商品促销", "清仓优惠", "招聘信息", "其他"];

const activities: ActivityData[] = [
  {
    id: 1,
    type: "开业活动",
    typeClass: "bg-green-50 text-green-700",
    title: "盛大开业！全场商品88折，前100名顾客免费礼品一份",
    merchant: "优选生活馆",
    address: "天河区天河路188号",
    time: "今天 10:00 - 21:00",
    views: 3240,
    posted: "1小时前",
    piPayment: true,
  },
  {
    id: 2,
    type: "商品促销",
    typeClass: "bg-orange-50 text-orange-700",
    title: "夏季新品上市，买两件第三件半价，限时三天",
    merchant: "时尚潮流服饰",
    address: "越秀区北京路步行街",
    time: "2026/03/16 - 2026/03/19",
    views: 1820,
    posted: "3小时前",
    piPayment: false,
  },
  {
    id: 3,
    type: "清仓优惠",
    typeClass: "bg-red-50 text-red-700",
    title: "电子产品年终清仓！手机、电脑、平板最低3折起售",
    merchant: "数码城 · 综合馆",
    address: "海珠区工业大道南35号",
    time: "今天起，售完为止",
    views: 5670,
    posted: "昨天",
    piPayment: true,
  },
  {
    id: 4,
    type: "招聘信息",
    typeClass: "bg-blue-50 text-blue-700",
    title: "招聘：全职咖啡师2名、兼职收银员3名，有经验者优先",
    merchant: "蓝山精品咖啡",
    address: "番禺区大学城北路",
    time: "长期有效",
    views: 960,
    posted: "2天前",
    piPayment: false,
  },
  {
    id: 5,
    type: "商品促销",
    typeClass: "bg-orange-50 text-orange-700",
    title: "进口红酒品鉴会，满200减50，Pi支付额外9折",
    merchant: "洋酒坊",
    address: "荔湾区龙津路",
    time: "每周六 19:00",
    views: 1430,
    posted: "3天前",
    piPayment: true,
  },
  {
    id: 6,
    type: "开业活动",
    typeClass: "bg-green-50 text-green-700",
    title: "新店开业，首周免费停车，消费满100送价值50元礼券",
    merchant: "城市广场超市",
    address: "白云区白云大道北",
    time: "2026/03/20 起",
    views: 2150,
    posted: "4天前",
    piPayment: true,
  },
];

interface ActivitiesTabProps {
  onOpenActivity: (data: ActivityData) => void;
  onOpenPublish: () => void;
}

export function ActivitiesTab({ onOpenActivity, onOpenPublish }: ActivitiesTabProps) {
  const [activeType, setActiveType] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const { posts } = usePosts();

  // Convert user-published activity posts into ActivityData entries and prepend them
  const userActivities = useMemo<ActivityData[]>(() =>
    posts
      .filter((p) => p.kind === "activity" && p.status === "已发布")
      .map((p) => ({
        id: 9000 + p.id,
        type: "我发布",
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

  const allActivities = [...userActivities, ...activities];

  const filtered = allActivities.filter((a) => {
    const matchType = activeType === "全部" || a.type === activeType;
    const matchSearch =
      !searchText || a.title.includes(searchText) || a.merchant.includes(searchText);
    return matchType && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-secondary px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-secondary-foreground font-bold text-xl">商家活动</h1>
          <button
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-2 rounded-full text-xs font-bold active:opacity-80 transition-opacity"
          >
            <Plus size={14} />
            发布活动
          </button>
        </div>
        <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-4 py-3">
          <Search size={15} className="text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索活动..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent text-secondary-foreground text-sm placeholder:text-secondary-foreground/45 outline-none"
          />
          <Filter size={14} className="text-secondary-foreground/50 flex-shrink-0" />
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none bg-card border-b border-border">
        {activityTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Megaphone size={36} className="opacity-25 mb-3" />
            <p className="text-sm font-medium">暂无相关活动</p>
          </div>
        )}

        {filtered.map((activity) => (
          <button
            key={activity.id}
            onClick={() => onOpenActivity(activity)}
            className="w-full bg-card rounded-2xl p-4 border border-border shadow-sm active:bg-muted/40 transition-colors text-left"
          >
            {/* Type + Pi badge */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${activity.typeClass}`}>
                {activity.type}
              </span>
              {activity.piPayment && (
                <span className="flex items-center gap-1 text-[11px] bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">
                  <span className="font-black leading-none">π</span> 支持
                </span>
              )}
            </div>

            <h3 className="text-foreground font-semibold text-sm leading-snug line-clamp-3 mb-2">
              {activity.title}
            </h3>
            <p className="text-muted-foreground text-xs font-semibold mb-2.5">{activity.merchant}</p>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{activity.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity.views.toLocaleString()}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.posted}</span>
              </div>
              <span className="flex items-center gap-0.5 text-primary text-xs font-semibold">
                查看详情 <ChevronRight size={13} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
