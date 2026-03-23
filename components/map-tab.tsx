"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Star, Phone, Clock, ChevronRight, Navigation, LayoutList, Map, Locate } from "lucide-react";
import type { MerchantData } from "./detail-pages";

const merchantCategories = ["全部", "餐饮", "咖啡", "购物", "娱乐", "服务"];

// Real coordinates for Guangzhou merchants
const merchants: MerchantData[] = [
  {
    id: 1, name: "星城咖啡 · 天河店", category: "咖啡",
    address: "天河区天河路123号", distance: "0.3km", rating: 4.8, reviews: 320,
    isOpen: true, hours: "08:00 – 22:00", phone: "020-8888-0001",
    tags: ["精品咖啡", "舒适环境"], discount: "Pi 支付享9折",
    pinX: "28%", pinY: "38%", lat: 23.1291, lng: 113.3270,
  },
  {
    id: 2, name: "优选烤肉 · 海珠店", category: "餐饮",
    address: "海珠区江南大道中56号", distance: "0.8km", rating: 4.6, reviews: 218,
    isOpen: true, hours: "11:00 – 23:00", phone: "020-8888-0002",
    tags: ["日式烤肉", "家庭聚餐"], discount: "新用户享85折",
    pinX: "58%", pinY: "28%", lat: 23.1050, lng: 113.3180,
  },
  {
    id: 3, name: "潮流服饰 · 正佳广场", category: "购物",
    address: "天河区天河路228号正佳广场3F", distance: "1.1km", rating: 4.4, reviews: 156,
    isOpen: true, hours: "10:00 – 22:00", phone: "020-8888-0003",
    tags: ["国潮品牌", "新品上市"], discount: "满 π 50 减 π 8",
    pinX: "72%", pinY: "55%", lat: 23.1267, lng: 113.3326,
  },
  {
    id: 4, name: "城市书吧 · 越秀店", category: "娱乐",
    address: "越秀区北京路98号", distance: "1.5km", rating: 4.9, reviews: 408,
    isOpen: false, hours: "09:00 – 21:00", phone: "020-8888-0004",
    tags: ["安静阅读", "会员借阅"], discount: "会员免费借阅",
    pinX: "20%", pinY: "65%", lat: 23.1285, lng: 113.2640,
  },
  {
    id: 5, name: "蓝山精品咖啡", category: "咖啡",
    address: "番禺区大学城北路10号", distance: "2.0km", rating: 4.7, reviews: 190,
    isOpen: true, hours: "08:30 – 21:30", phone: "020-8888-0005",
    tags: ["手冲咖啡", "单品豆"], discount: "下午茶套餐 π 8起",
    pinX: "44%", pinY: "72%", lat: 23.0490, lng: 113.3960,
  },
  {
    id: 6, name: "数码城 · 综合馆", category: "购物",
    address: "海珠区工业大道南35号", distance: "2.4km", rating: 4.3, reviews: 531,
    isOpen: true, hours: "10:00 – 21:00", phone: "020-8888-0006",
    tags: ["电子产品", "维修服务"], discount: "Pi 支付加赠延保1年",
    pinX: "82%", pinY: "35%", lat: 23.0890, lng: 113.2950,
  },
];

// ─── Leaflet Map Component (dynamically loaded to avoid SSR issues) ───────────

interface LeafletMapProps {
  merchants: MerchantData[];
  onPinClick: (m: MerchantData) => void;
}

function LeafletMap({ merchants: pins, onPinClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!isMounted || !mapRef.current) return;

      // Center on Guangzhou
      const map = L.map(mapRef.current, {
        center: [23.1291, 113.2640],
        zoom: 12,
        zoomControl: false,
        attributionControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom Pi marker icon
      const piIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:36px;height:42px;display:flex;flex-direction:column;align-items:center;
        ">
          <div style="
            width:32px;height:32px;border-radius:50%;
            background:oklch(0.72 0.165 55);
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
            font-weight:900;font-size:16px;color:#1a1200;
          ">π</div>
          <div style="width:2px;height:8px;background:oklch(0.72 0.165 55);margin-top:-1px;"></div>
        </div>`,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -44],
      });

      // Add zoom control bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add merchant markers
      pins.forEach((merchant) => {
        if (!merchant.lat || !merchant.lng) return;
        const marker = L.marker([merchant.lat, merchant.lng], { icon: piIcon }).addTo(map);
        marker.bindPopup(`
          <div style="min-width:160px;font-family:system-ui,sans-serif;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${merchant.name}</div>
            <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${merchant.address}</div>
            <div style="font-size:11px;color:oklch(0.72 0.165 55);font-weight:600;">${merchant.discount}</div>
          </div>
        `, { maxWidth: 220 });
        marker.on("click", () => onPinClick(merchant));
      });

      // Current location dot
      const locIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:16px;height:16px;border-radius:50%;
          background:oklch(0.62 0.14 200);
          border:3px solid white;
          box-shadow:0 0 0 4px rgba(99,189,200,0.25);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      L.marker([23.1291, 113.2640], { icon: locIcon }).addTo(map);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // When filter changes, re-add markers — handled by key prop on parent
  return <div ref={mapRef} className="w-full h-full" />;
}

// ─── Map Tab ──────────────────────────────────────────────────────────────────

interface MapTabProps {
  onOpenMerchant: (data: MerchantData) => void;
}

export function MapTab({ onOpenMerchant }: MapTabProps) {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchText, setSearchText] = useState("");
  const [showMap, setShowMap] = useState(true);
  const [mapKey, setMapKey] = useState(0);

  const filtered = merchants.filter((m) => {
    const matchCat = activeCategory === "全部" || m.category === activeCategory;
    const matchSearch = !searchText || m.name.includes(searchText) || m.address.includes(searchText);
    return matchCat && matchSearch;
  });

  function handleNavigate(merchant: MerchantData) {
    const query = encodeURIComponent(merchant.name + " " + merchant.address);
    if (merchant.lat && merchant.lng) {
      window.open(`https://maps.google.com/maps?daddr=${merchant.lat},${merchant.lng}`, "_blank");
    } else {
      window.open(`https://maps.google.com/?q=${query}`, "_blank");
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-secondary px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-secondary-foreground font-bold text-xl">Pi 商家地图</h1>
          <button
            onClick={() => { setShowMap(!showMap); setMapKey((k) => k + 1); }}
            className="flex items-center gap-1.5 bg-white/10 text-secondary-foreground px-3.5 py-2 rounded-full text-xs font-bold active:opacity-80 transition-opacity"
          >
            {showMap ? <><LayoutList size={13} /> 列表</> : <><Map size={13} /> 地图</>}
          </button>
        </div>
        <div className="flex items-center gap-2.5 bg-white/10 rounded-xl px-4 py-3">
          <Search size={15} className="text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="搜索支持 Pi 支付的商家..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent text-secondary-foreground text-sm placeholder:text-secondary-foreground/45 outline-none"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none bg-card border-b border-border">
        {merchantCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Leaflet Map */}
      {showMap && (
        <div className="px-4 pt-3 pb-1">
          <div className="h-56 rounded-2xl overflow-hidden border border-border shadow-sm relative">
            <LeafletMap key={mapKey} merchants={filtered} onPinClick={onOpenMerchant} />
            {/* Navigate to current location button */}
            <button
              onClick={() => {
                navigator.geolocation?.getCurrentPosition(
                  (pos) => {
                    window.open(`https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`, "_blank");
                  },
                  () => window.open("https://maps.google.com/", "_blank")
                );
              }}
              className="absolute top-2 right-2 z-[1000] w-9 h-9 bg-card rounded-xl shadow-md flex items-center justify-center border border-border active:bg-muted transition-colors"
              aria-label="定位当前位置"
            >
              <Locate size={16} className="text-accent" />
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            点击地图上的 <span className="font-bold text-primary">π</span> 标记查看商家详情
          </p>
        </div>
      )}

      {/* Merchant Count */}
      <div className="px-4 py-2.5">
        <p className="text-xs text-muted-foreground">
          找到 <span className="text-foreground font-bold">{filtered.length}</span> 家附近 Pi 商家
        </p>
      </div>

      {/* Merchant List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {filtered.map((merchant) => (
          <button
            key={merchant.id}
            onClick={() => onOpenMerchant(merchant)}
            className="w-full bg-card rounded-2xl p-4 border border-border shadow-sm active:bg-muted/40 transition-colors text-left"
          >
            {/* Name + status + Pi badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-foreground font-bold text-sm">{merchant.name}</h3>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${merchant.isOpen ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {merchant.isOpen ? "营业中" : "已打烊"}
                  </span>
                </div>
              </div>
              <span className="flex-shrink-0 flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                <span className="font-black text-sm leading-none">π</span> 支付
              </span>
            </div>

            {/* Discount */}
            <div className="bg-primary/8 border border-primary/15 rounded-xl px-3 py-2 mb-3">
              <span className="text-primary text-xs font-semibold">{merchant.discount}</span>
            </div>

            {/* Details */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{merchant.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{merchant.hours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone size={11} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{merchant.phone}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {merchant.tags.map((tag) => (
                <span key={tag} className="text-[11px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">{tag}</span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-primary fill-primary" />
                  <span className="text-sm font-bold text-foreground">{merchant.rating}</span>
                  <span className="text-xs text-muted-foreground">({merchant.reviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation size={11} className="text-accent" />
                  <span className="text-xs text-accent font-semibold">{merchant.distance}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Inline navigate button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleNavigate(merchant); }}
                  className="flex items-center gap-1 bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-full active:opacity-80 transition-opacity"
                >
                  <Navigation size={11} />
                  导航
                </button>
                <span className="flex items-center gap-0.5 text-primary text-xs font-semibold">
                  详情 <ChevronRight size={13} />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
