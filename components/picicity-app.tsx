"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { HomeTab } from "./home-tab";
import { ActivitiesTab } from "./activities-tab";
import { DealsTab } from "./deals-tab";
import { MapTab } from "./map-tab";
import { ProfileTab } from "./profile-tab";
import { PublishModal, type PublishType } from "./publish-modal";
import { FlashSaleListPage, FlashSaleDetail } from "./flash-sale-page";
import { MerchantBenefitsListPage, MerchantBenefitDetail } from "./merchant-benefits-page";
import { PiExclusiveListPage, PiExclusiveDetail } from "./pi-exclusive-page";
import {
  ActivityDetail,
  DealDetail,
  MerchantDetail,
  CategoryPage,
  ProfileSubPage,
  type PageState,
  type ActivityData,
  type DealData,
  type MerchantData,
  type CategoryData,
  type ProfilePageId,
  type FlashSaleItem,
  type MerchantBenefitItem,
  type PiExclusiveItem,
} from "./detail-pages";

type TabId = "home" | "activities" | "deals" | "map" | "profile";

const tabs: { id: TabId; label: string }[] = [
  { id: "home", label: "首页" },
  { id: "activities", label: "活动" },
  { id: "deals", label: "优惠" },
  { id: "map", label: "地图" },
  { id: "profile", label: "我的" },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z"
        fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round" fillOpacity={active ? 0.2 : 0} />
    </svg>
  );
}
function ActivityIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 9H16M8 13H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 2V6M16 2V6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function DealsIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12.5 2H7L2 7V12.5L13.5 24L22 15.5L12.5 2Z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" />
      <path d="M15 9L9 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.68629 2 6 4.68629 6 8C6 12.9706 12 21 12 21C12 21 18 12.9706 18 8C18 4.68629 15.3137 2 12 2Z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="8" r="2.5" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.8 : 0} stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 20C4 17.3333 6.66667 14 12 14C17.3333 14 20 17.3333 20 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const iconMap: Record<TabId, (active: boolean) => React.ReactNode> = {
  home: (a) => <HomeIcon active={a} />,
  activities: (a) => <ActivityIcon active={a} />,
  deals: (a) => <DealsIcon active={a} />,
  map: (a) => <MapIcon active={a} />,
  profile: (a) => <ProfileIcon active={a} />,
};

export function PiCityApp() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  // Stack of pages — push to navigate forward, pop to go back
  const [pageStack, setPageStack] = useState<PageState[]>([]);
  const [showPublish, setShowPublish] = useState(false);
  const [publishDefaultType, setPublishDefaultType] = useState<PublishType>(null);

  function openPublish(type: PublishType = null) {
    setPublishDefaultType(type);
    setShowPublish(true);
  }

  const currentPage = pageStack[pageStack.length - 1] ?? null;

  function push(page: PageState) {
    setPageStack((s) => [...s, page]);
  }
  function pop() {
    setPageStack((s) => s.slice(0, -1));
  }

  function openActivity(data: ActivityData) { push({ type: "activity", data }); }
  function openDeal(data: DealData) { push({ type: "deal", data }); }
  function openMerchant(data: MerchantData) { push({ type: "merchant", data }); }
  function openCategory(data: CategoryData) { push({ type: "category", data }); }
  function openProfilePage(id: ProfilePageId) { push({ type: "profile-sub", id }); }
  function openFlashSale(data: FlashSaleItem) { push({ type: "flash-sale", data }); }
  function openMerchantBenefit(data: MerchantBenefitItem) { push({ type: "merchant-benefit", data }); }
  function openPiExclusive(data: PiExclusiveItem) { push({ type: "pi-exclusive", data }); }

  function handleOpenBanner(id: string) {
    if (id === "flash-sale")       push({ type: "flash-sale-list" });
    else if (id === "merchant-benefit") push({ type: "merchant-benefit-list" });
    else if (id === "pi-exclusive")     push({ type: "pi-exclusive-list" });
  }

  function handleTabChange(tab: TabId) {
    setPageStack([]);
    setActiveTab(tab);
  }

  const isDetailVisible = currentPage !== null;

  return (
    <div className="relative flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden shadow-2xl">
      {/* Publish Modal */}
      {showPublish && (
        <PublishModal
          onClose={() => { setShowPublish(false); setPublishDefaultType(null); }}
          defaultType={publishDefaultType}
          onViewMyPosts={() => {
            setShowPublish(false);
            setPublishDefaultType(null);
            setActiveTab("profile");
            setPageStack([{ type: "profile-sub", id: "my-posts", initialStatusFilter: "审核中" }]);
          }}
        />
      )}

      <main className="flex-1 overflow-y-auto overscroll-contain">
        {isDetailVisible ? (
          <>
            {currentPage.type === "activity" && (
              <ActivityDetail data={currentPage.data} onBack={pop} />
            )}
            {currentPage.type === "deal" && (
              <DealDetail data={currentPage.data} onBack={pop} />
            )}
            {currentPage.type === "merchant" && (
              <MerchantDetail data={currentPage.data} onBack={pop} />
            )}
            {currentPage.type === "category" && (
              <CategoryPage
                data={currentPage.data}
                onBack={pop}
                onOpenActivity={openActivity}
                onOpenDeal={openDeal}
                onOpenMerchant={openMerchant}
              />
            )}
            {currentPage.type === "profile-sub" && (
              <ProfileSubPage
                id={currentPage.id}
                onBack={pop}
                initialStatusFilter={currentPage.initialStatusFilter}
                onOpenPublish={() => {
                  pop();
                  openPublish();
                }}
              />
            )}
            {currentPage.type === "flash-sale-list" && (
              <FlashSaleListPage
                onBack={pop}
                onOpenItem={openFlashSale}
                onOpenPublish={() => openPublish("flash-sale")}
              />
            )}
            {currentPage.type === "flash-sale" && (
              <FlashSaleDetail
                data={currentPage.data}
                onBack={pop}
                onOpenPublish={() => openPublish("flash-sale")}
              />
            )}
            {currentPage.type === "merchant-benefit-list" && (
              <MerchantBenefitsListPage
                onBack={pop}
                onOpenItem={openMerchantBenefit}
                onOpenPublish={() => openPublish("merchant-benefit")}
              />
            )}
            {currentPage.type === "merchant-benefit" && (
              <MerchantBenefitDetail
                data={currentPage.data}
                onBack={pop}
                onOpenPublish={() => openPublish("merchant-benefit")}
              />
            )}
            {currentPage.type === "pi-exclusive-list" && (
              <PiExclusiveListPage
                onBack={pop}
                onOpenItem={openPiExclusive}
                onOpenPublish={() => openPublish("pi-exclusive")}
              />
            )}
            {currentPage.type === "pi-exclusive" && (
              <PiExclusiveDetail
                data={currentPage.data}
                onBack={pop}
                onOpenPublish={() => openPublish("pi-exclusive")}
              />
            )}
          </>
        ) : (
          <>
            {activeTab === "home" && (
              <HomeTab
                onOpenActivity={openActivity}
                onOpenDeal={openDeal}
                onOpenCategory={openCategory}
                onOpenBanner={handleOpenBanner}
              />
            )}
            {activeTab === "activities" && (
              <ActivitiesTab onOpenActivity={openActivity} onOpenPublish={() => openPublish("activity")} />
            )}
            {activeTab === "deals" && (
              <DealsTab onOpenDeal={openDeal} onOpenPublish={() => openPublish("deal")} />
            )}
            {activeTab === "map" && (
              <MapTab onOpenMerchant={openMerchant} />
            )}
            {activeTab === "profile" && (
              <ProfileTab onOpenPage={openProfilePage} />
            )}
          </>
        )}
      </main>

      {/* Floating Action Button — publish shortcut */}
      {!isDetailVisible && activeTab !== "profile" && (
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+68px)] right-4 pointer-events-none" style={{ zIndex: 40 }}>
          <button
            onClick={() => openPublish()}
            className="pointer-events-auto w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center active:opacity-80 active:scale-95 transition-all"
            aria-label="发布内容"
          >
            <Plus size={26} className="text-primary-foreground" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Bottom nav — always visible */}
      <nav
        className="flex-shrink-0 bg-card border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="主导航"
      >
        <div className="flex items-stretch">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id && !isDetailVisible;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {iconMap[tab.id](isActive)}
                <span className={`text-[10px] font-semibold leading-none ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
