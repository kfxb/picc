"use client";

import { useState, useEffect } from "react";
import {
  X,
  Megaphone,
  Tag,
  RefreshCw,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Clock,
  ImagePlus,
  CheckCircle2,
  Lock,
  Loader2,
  Gift,
  Sparkles,
  Percent,
  CalendarClock,
} from "lucide-react";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { usePosts } from "@/contexts/posts-context";
import type { PostKind } from "@/contexts/posts-context";

export type PublishType = "activity" | "deal" | "secondhand" | "flash-sale" | "merchant-benefit" | "pi-exclusive" | null;

export interface PublishModalProps {
  onClose: () => void;
  defaultType?: PublishType;
  onViewMyPosts?: () => void;
}

const publishTypes = [
  {
    id: "activity" as PublishType,
    icon: Megaphone,
    label: "商家活动",
    desc: "发布开业、促销、招聘等商家信息",
    color: "text-orange-500 bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "deal" as PublishType,
    icon: Tag,
    label: "本地优惠",
    desc: "分享餐饮、娱乐、购物折扣信息",
    color: "text-blue-500 bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "secondhand" as PublishType,
    icon: RefreshCw,
    label: "二手交易",
    desc: "发布二手商品或求购信息",
    color: "text-teal-500 bg-teal-50",
    borderColor: "border-teal-200",
  },
  {
    id: "flash-sale" as PublishType,
    icon: Clock,
    label: "限时活动",
    desc: "发布倒计时限时特惠，吸引即时客流",
    color: "text-destructive bg-destructive/8",
    borderColor: "border-destructive/20",
  },
  {
    id: "merchant-benefit" as PublishType,
    icon: Gift,
    label: "商家福利",
    desc: "发布入驻权益、流量福利、佣金优惠",
    color: "text-green-600 bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "pi-exclusive" as PublishType,
    icon: Sparkles,
    label: "Pi 专属",
    desc: "为 Pi 用户发布专属折扣与特权优惠",
    color: "text-primary bg-primary/10",
    borderColor: "border-primary/25",
  },
];

const activityTypeOptions = ["开业活动", "商品促销", "清仓优惠", "招聘信息", "其他"];
const dealCategoryOptions = ["餐饮", "咖啡", "娱乐", "购物", "其他"];
const secondhandCategoryOptions = ["数码", "家具", "服饰", "书籍", "家电", "其他"];
const conditionOptions = ["全新", "9成新", "8成新", "7成新以下"];

// ---- Login Gate ----
function LoginGate({ onClose, onLoggedIn }: { onClose: () => void; onLoggedIn: () => void }) {
  const { reinitialize, isAuthenticated, wallet, connectWallet, walletLoading, hasError, authMessage } = usePiAuth();
  const [logging, setLogging] = useState(false);

  // If already logged in via wallet, auto-advance immediately
  useEffect(() => {
    if (isAuthenticated || wallet) onLoggedIn();
  }, [isAuthenticated, wallet]);

  async function handleLogin() {
    setLogging(true);
    try {
      // Try connectWallet first (Pi Browser environment)
      await connectWallet();
      onLoggedIn();
    } catch {
      // Fallback to SDK reinitialize
      try {
        await reinitialize();
        onLoggedIn();
      } catch {
        // error shown via hasError/authMessage
      }
    } finally {
      setLogging(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 text-center">
      {/* Pi logo */}
      <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        <span className="text-primary font-black text-4xl leading-none">π</span>
      </div>
      <h3 className="text-foreground font-bold text-xl mb-2">登录后才能发布</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
        请先通过 Pi Browser 登录 Pi Network 账号，登录成功后即可发布内容。
      </p>
      {/* Feature list */}
      <div className="w-full bg-muted rounded-2xl p-4 mb-6 text-left space-y-2.5">
        {[
          "发布商家活动 · 优惠 · 二手信息",
          "发布限时活动与 Pi 专属优惠",
          "管理已发布内容，随时上下线",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={12} className="text-green-600" />
            </div>
            <p className="text-sm text-foreground">{item}</p>
          </div>
        ))}
      </div>
      {hasError && (
        <div className="w-full bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3 mb-4 text-left">
          <p className="text-destructive text-xs font-medium">{authMessage}</p>
          <p className="text-destructive/70 text-xs mt-1">请确认在 Pi Browser 中打开本应用</p>
        </div>
      )}
      <button
        onClick={handleLogin}
        disabled={logging}
        className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-sm active:opacity-80 transition-opacity mb-3 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {logging ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            正在登录…
          </>
        ) : (
          <>
            <Lock size={15} />
            连接 Pi Network 账号
          </>
        )}
      </button>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-2xl border border-border text-muted-foreground text-sm font-medium active:opacity-80 transition-opacity"
      >
        稍后再说
      </button>
    </div>
  );
}

// ---- Type Selector ----
function TypeSelector({ onSelect }: { onSelect: (type: PublishType) => void }) {
  return (
    <div className="px-4 pt-2 pb-8 space-y-3">
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">选择你要发布的内容类型：</p>
      {publishTypes.map((pt) => {
        const Icon = pt.icon;
        return (
          <button
            key={pt.id}
            onClick={() => onSelect(pt.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-card border-2 ${pt.borderColor} active:scale-[0.98] transition-transform text-left`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${pt.color}`}>
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-bold text-sm">{pt.label}</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-snug">{pt.desc}</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
}

// ---- Field helpers ----
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground mb-1.5 px-1">
      {children}{required && <span className="text-primary ml-0.5">*</span>}
    </p>
  );
}

function TextInput({
  placeholder, value, onChange, multiline, rows,
}: {
  placeholder: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number;
}) {
  const cls = "w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/50 transition-colors";
  if (multiline) {
    return <textarea rows={rows ?? 3} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none`} />;
  }
  return <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />;
}

function ChipSelector({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${value === opt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function LocationInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <MapPin size={14} className="absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
      <input type="text" placeholder="填写详细地址或区域" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/50 transition-colors" />
    </div>
  );
}

function ImageUpload() {
  const [previews, setPreviews] = useState<string[]>([]);
  const uploadId = "img-upload-" + Math.random().toString(36).slice(2);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const added: string[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (previews.length + added.length >= 4) return;
      added.push(URL.createObjectURL(file));
    });
    if (added.length > 0) {
      setPreviews((prev) => [...prev, ...added].slice(0, 4));
    }
    // reset so same file can be re-selected
    e.target.value = "";
  }

  function removeImage(index: number) {
    setPreviews((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      return next;
    });
  }

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2.5 flex-wrap">
        {/* Existing previews */}
        {previews.map((src, i) => (
          <div
            key={src}
            className="relative w-20 h-20 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-muted"
          >
            <img src={src} alt={`预览图 ${i + 1}`} className="w-full h-full object-cover" crossOrigin="anonymous" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"
              aria-label="删除图片"
            >
              <X size={11} className="text-white" />
            </button>
          </div>
        ))}

        {/* Add button — uses <label> so click always opens file picker reliably */}
        {previews.length < 4 && (
          <label
            htmlFor={uploadId}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 bg-muted/50 active:bg-muted transition-colors flex-shrink-0 cursor-pointer select-none"
          >
            <ImagePlus size={18} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground leading-tight text-center px-1">
              {previews.length === 0 ? "上传图片" : "继续添加"}
            </span>
            <input
              id={uploadId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="sr-only"
              onChange={handleFiles}
            />
          </label>
        )}
      </div>

      {previews.length > 0 && (
        <p className="text-[11px] text-muted-foreground px-0.5">
          已选 {previews.length} / 4 张 · 点击缩略图右上角可删除
        </p>
      )}
      {previews.length === 0 && (
        <p className="text-[11px] text-muted-foreground px-0.5">
          最多上传 4 张，支持 JPG / PNG / WebP
        </p>
      )}
    </div>
  );
}

function Toggle({ on, onChange, label, sub }: { on: boolean; onChange: (v: boolean) => void; label: string; sub: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 px-4 bg-muted rounded-xl">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <button type="button" onClick={() => onChange(!on)}
        className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${on ? "bg-primary justify-end" : "bg-border justify-start"}`}>
        <span className="w-5 h-5 bg-white rounded-full shadow-sm block" />
      </button>
    </div>
  );
}

function SubmitButton({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={disabled ? undefined : onClick}
      className={`w-full py-4 rounded-2xl font-bold text-sm transition-opacity ${disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground active:opacity-80"}`}>
      {label}
    </button>
  );
}

// ---- Activity Form ----
function ActivityForm({ onSubmit }: { onSubmit: (title: string, location: string) => void }) {
  const [actType, setActType] = useState(activityTypeOptions[0]);
  const [title, setTitle] = useState("");
  const [merchant, setMerchant] = useState("");
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");
  const [piPayment, setPiPayment] = useState(false);
  const canSubmit = title.trim() && merchant.trim() && address.trim() && time.trim();

  return (
    <div className="px-4 pb-8 space-y-4">
      <div><FieldLabel>活动类型</FieldLabel><ChipSelector options={activityTypeOptions} value={actType} onChange={setActType} /></div>
      <div><FieldLabel required>活动标题</FieldLabel><TextInput placeholder="简短描述你的活动..." value={title} onChange={setTitle} /></div>
      <div><FieldLabel required>商家名称</FieldLabel><TextInput placeholder="你的商家或品牌名称" value={merchant} onChange={setMerchant} /></div>
      <div>
        <FieldLabel required>活动地址</FieldLabel>
        <LocationInput value={address} onChange={setAddress} />
      </div>
      <div>
        <FieldLabel required>活动时间</FieldLabel>
        <div className="relative">
          <Clock size={14} className="absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
          <input type="text" placeholder="例：2026/04/01 - 2026/04/07" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-primary/50 transition-colors" />
        </div>
      </div>
      <div><FieldLabel>活动详情</FieldLabel><TextInput placeholder="详细描述活动内容、规则..." value={desc} onChange={setDesc} multiline rows={3} /></div>
      <div><FieldLabel>图片</FieldLabel><ImageUpload /></div>
      <Toggle on={piPayment} onChange={setPiPayment} label="支持 Pi 支付" sub="勾选后将显示 Pi 支付标识" />
      <SubmitButton label="发布活动" disabled={!canSubmit} onClick={() => onSubmit(title, address)} />
    </div>
  );
}

// ---- Deal Form ----
function DealForm({ onSubmit }: { onSubmit: (title: string, location: string) => void }) {
  const [category, setCategory] = useState(dealCategoryOptions[0]);
  const [title, setTitle] = useState("");
  const [seller, setSeller] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [origPrice, setOrigPrice] = useState("");
  const [desc, setDesc] = useState("");
  const canSubmit = title.trim() && seller.trim() && price.trim();

  return (
    <div className="px-4 pb-8 space-y-4">
      <div><FieldLabel>优惠类别</FieldLabel><ChipSelector options={dealCategoryOptions} value={category} onChange={setCategory} /></div>
      <div><FieldLabel required>标题</FieldLabel><TextInput placeholder="简短描述这个优惠..." value={title} onChange={setTitle} /></div>
      <div><FieldLabel required>商家/发布人</FieldLabel><TextInput placeholder="你的店名或昵称" value={seller} onChange={setSeller} /></div>
      <div><FieldLabel>位置</FieldLabel><LocationInput value={location} onChange={setLocation} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel required>优惠价</FieldLabel><TextInput placeholder="π 0.00" value={price} onChange={setPrice} /></div>
        <div><FieldLabel>原价</FieldLabel><TextInput placeholder="π 0.00" value={origPrice} onChange={setOrigPrice} /></div>
      </div>
      <div><FieldLabel>详情说明</FieldLabel><TextInput placeholder="使用规则、时间限制等..." value={desc} onChange={setDesc} multiline rows={3} /></div>
      <div><FieldLabel>图片</FieldLabel><ImageUpload /></div>
      <SubmitButton label="发布优惠" disabled={!canSubmit} onClick={() => onSubmit(title, location)} />
    </div>
  );
}

// ---- Secondhand Form ----
type SecondhandSubmitPayload = { title: string; location: string; isWanted: boolean; price: string; condition: string; description: string };
function SecondhandForm({ onSubmit }: { onSubmit: (payload: SecondhandSubmitPayload) => void }) {
  const [isWanted, setIsWanted] = useState(false);
  const [category, setCategory] = useState(secondhandCategoryOptions[0]);
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [title, setTitle] = useState("");
  const [seller, setSeller] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const canSubmit = title.trim() && seller.trim() && price.trim();

  return (
    <div className="px-4 pb-8 space-y-4">
      <div className="flex gap-2">
        {["出售", "求购"].map((opt) => (
          <button key={opt} type="button" onClick={() => setIsWanted(opt === "求购")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${(opt === "求购") === isWanted ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}>
            {opt}
          </button>
        ))}
      </div>
      <div><FieldLabel>物品类别</FieldLabel><ChipSelector options={secondhandCategoryOptions} value={category} onChange={setCategory} /></div>
      <div><FieldLabel required>标题</FieldLabel><TextInput placeholder="描述物品名称、品牌、型号..." value={title} onChange={setTitle} /></div>
      {!isWanted && <div><FieldLabel>成色</FieldLabel><ChipSelector options={conditionOptions} value={condition} onChange={setCondition} /></div>}
      <div><FieldLabel required>发布人</FieldLabel><TextInput placeholder="你的昵称" value={seller} onChange={setSeller} /></div>
      <div><FieldLabel>位置</FieldLabel><LocationInput value={location} onChange={setLocation} /></div>
      <div><FieldLabel required>{isWanted ? "预算" : "售价"}</FieldLabel><TextInput placeholder="π 0.00" value={price} onChange={setPrice} /></div>
      <div><FieldLabel>详细描述</FieldLabel><TextInput placeholder="物品状态、购买时间、交易方式..." value={desc} onChange={setDesc} multiline rows={3} /></div>
      {!isWanted && <div><FieldLabel>图片</FieldLabel><ImageUpload /></div>}
      <SubmitButton label={isWanted ? "发布求购" : "发布出售"} disabled={!canSubmit} onClick={() => onSubmit({ title, location, isWanted, price: `π ${price}`, condition: isWanted ? "" : condition, description: desc })} />
    </div>
  );
}

// ---- Flash Sale Form ----
function FlashSaleForm({ onSubmit }: { onSubmit: (title: string, location: string) => void }) {
  const [category, setCategory] = useState(dealCategoryOptions[0]);
  const [title, setTitle] = useState("");
  const [merchant, setMerchant] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [origPrice, setOrigPrice] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [desc, setDesc] = useState("");
  const [piPayment, setPiPayment] = useState(true);
  const canSubmit = title.trim() && merchant.trim() && price.trim() && endsAt.trim();

  return (
    <div className="px-4 pb-8 space-y-4">
      <div><FieldLabel>活动类别</FieldLabel><ChipSelector options={dealCategoryOptions} value={category} onChange={setCategory} /></div>
      <div><FieldLabel required>活动标题</FieldLabel><TextInput placeholder="例：美式咖啡买一送一" value={title} onChange={setTitle} /></div>
      <div><FieldLabel required>商家名称</FieldLabel><TextInput placeholder="你的商家或品牌名称" value={merchant} onChange={setMerchant} /></div>
      <div><FieldLabel>地址</FieldLabel><LocationInput value={location} onChange={setLocation} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel required>限时价格</FieldLabel><TextInput placeholder="π 0.00" value={price} onChange={setPrice} /></div>
        <div><FieldLabel>原价</FieldLabel><TextInput placeholder="π 0.00" value={origPrice} onChange={setOrigPrice} /></div>
      </div>
      <div>
        <FieldLabel required>截止时间</FieldLabel>
        <div className="relative">
          <CalendarClock size={14} className="absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
          <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors" />
        </div>
      </div>
      <div><FieldLabel>活动说明</FieldLabel><TextInput placeholder="活动规则、限量说明..." value={desc} onChange={setDesc} multiline rows={3} /></div>
      <div><FieldLabel>图片</FieldLabel><ImageUpload /></div>
      <Toggle on={piPayment} onChange={setPiPayment} label="支持 Pi 支付" sub="开启后 Pi 用户可享专属折扣" />
      <SubmitButton label="发布限时活动" disabled={!canSubmit} onClick={() => onSubmit(title, location)} />
    </div>
  );
}

// ---- Merchant Benefit Form ----
function MerchantBenefitForm({ onSubmit }: { onSubmit: (title: string, location: string) => void }) {
  const benefitTypes = ["入驻优惠", "流量权益", "推广礼包", "发布权益", "佣金优惠"];
  const [benefitType, setBenefitType] = useState(benefitTypes[0]);
  const [title, setTitle] = useState("");
  const [requirement, setRequirement] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [desc, setDesc] = useState("");
  const [piOnly, setPiOnly] = useState(false);
  const canSubmit = title.trim() && requirement.trim() && endsAt.trim();

  return (
    <div className="px-4 pb-8 space-y-4">
      <div><FieldLabel>福利类型</FieldLabel><ChipSelector options={benefitTypes} value={benefitType} onChange={setBenefitType} /></div>
      <div><FieldLabel required>福利标题</FieldLabel><TextInput placeholder="简短描述此项福利..." value={title} onChange={setTitle} /></div>
      <div><FieldLabel required>领取条件</FieldLabel><TextInput placeholder="描述商家需满足的条件..." value={requirement} onChange={setRequirement} /></div>
      <div>
        <FieldLabel required>截止日期</FieldLabel>
        <div className="relative">
          <CalendarClock size={14} className="absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
          <input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors" />
        </div>
      </div>
      <div><FieldLabel>详细说明</FieldLabel><TextInput placeholder="详细描述福利内容与使用规则..." value={desc} onChange={setDesc} multiline rows={3} /></div>
      <Toggle on={piOnly} onChange={setPiOnly} label="仅限 Pi 用户" sub="勾选后仅对 Pi Network Pioneer 开放" />
      <SubmitButton label="发布商家福利" disabled={!canSubmit} onClick={() => onSubmit(title, "")} />
    </div>
  );
}

// ---- Pi Exclusive Form ----
function PiExclusiveForm({ onSubmit }: { onSubmit: (title: string, location: string) => void }) {
  const categories = ["餐饮", "购物", "娱乐", "运动", "生鲜", "其他"];
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState("");
  const [merchant, setMerchant] = useState("");
  const [location, setLocation] = useState("");
  const [discount, setDiscount] = useState("");
  const [piAmount, setPiAmount] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [desc, setDesc] = useState("");
  const canSubmit = title.trim() && merchant.trim() && discount.trim();

  return (
    <div className="px-4 pb-8 space-y-4">
      <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center gap-2 border border-primary/15">
        <span className="text-primary font-black text-xl leading-none">π</span>
        <p className="text-primary text-xs font-semibold">此类型仅向 Pi Network Pioneer 用户展示</p>
      </div>
      <div><FieldLabel>类别</FieldLabel><ChipSelector options={categories} value={category} onChange={setCategory} /></div>
      <div><FieldLabel required>优惠标题</FieldLabel><TextInput placeholder="例：Pi 支付享9折，全品类通用" value={title} onChange={setTitle} /></div>
      <div><FieldLabel required>商家名称</FieldLabel><TextInput placeholder="你的商家或品牌名称" value={merchant} onChange={setMerchant} /></div>
      <div><FieldLabel>地址</FieldLabel><LocationInput value={location} onChange={setLocation} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>折扣力度</FieldLabel>
          <div className="relative">
            <Percent size={13} className="absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
            <input type="text" placeholder="例：9折、半价" value={discount} onChange={(e) => setDiscount(e.target.value)}
              className="w-full bg-muted rounded-xl pl-9 pr-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors" />
          </div>
        </div>
        <div><FieldLabel>最低 Pi 用量</FieldLabel><TextInput placeholder="π 0.00" value={piAmount} onChange={setPiAmount} /></div>
      </div>
      <div>
        <FieldLabel>截止日期</FieldLabel>
        <div className="relative">
          <CalendarClock size={14} className="absolute left-3.5 top-3.5 text-muted-foreground pointer-events-none" />
          <input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-3 text-sm text-foreground outline-none border border-transparent focus:border-primary/50 transition-colors" />
        </div>
      </div>
      <div><FieldLabel>权益说明</FieldLabel><TextInput placeholder="详细描述优惠使用规则与限制..." value={desc} onChange={setDesc} multiline rows={3} /></div>
      <div><FieldLabel>图片</FieldLabel><ImageUpload /></div>
      <SubmitButton label="发布 Pi 专属优惠" disabled={!canSubmit} onClick={() => onSubmit(title, location)} />
    </div>
  );
}

// ---- Success Screen ----
function SuccessScreen({ type, onClose, onViewPosts }: { type: PublishType; onClose: () => void; onViewPosts?: () => void }) {
  const labels: Record<NonNullable<PublishType>, string> = { activity: "活动", deal: "优惠", secondhand: "交易信息", "flash-sale": "限时活动", "merchant-benefit": "商家福利", "pi-exclusive": "Pi 专属优惠" };
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
        <CheckCircle2 size={48} className="text-green-500" />
      </div>
      <h3 className="text-foreground font-bold text-xl mb-2">{labels[type!]}发布成功！</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
        你的信息已提交审核，审核通过后将出现在平台列表中并展示给附近用户。
      </p>

      {/* Status card */}
      <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 mb-6 text-left flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Clock size={15} className="text-amber-600" />
        </div>
        <div>
          <p className="text-amber-800 font-bold text-sm">审核中</p>
          <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">预计 24 小时内完成审核。审核通过后你将收到通知，状态将更新为「已发布」。</p>
        </div>
      </div>

      {/* Actions */}
      {onViewPosts && (
        <button
          onClick={onViewPosts}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm active:opacity-80 transition-opacity mb-3"
        >
          进入审核页面
        </button>
      )}
      <button
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl border border-border text-muted-foreground font-bold text-sm active:opacity-80 transition-opacity"
      >
        继续浏览
      </button>
    </div>
  );
}

// ---- Main Modal ----
export function PublishModal({ onClose, defaultType = null, onViewMyPosts }: PublishModalProps) {
  const { isAuthenticated, wallet } = usePiAuth();
  const { addPost } = usePosts();
  const [selectedType, setSelectedType] = useState<PublishType>(defaultType);
  const [submitted, setSubmitted] = useState(false);
  // User is considered authed if Pi SDK authenticated OR wallet is connected
  const isLoggedIn = isAuthenticated || !!wallet;
  const [authed, setAuthed] = useState(isLoggedIn);
  // Keep authed in sync whenever either auth source becomes true
  if (isLoggedIn && !authed) setAuthed(true);

  const currentTypeMeta = publishTypes.find((p) => p.id === selectedType);

  const kindMap: Record<NonNullable<PublishType>, { kind: PostKind; kindLabel: string; kindClass: string }> = {
    activity:         { kind: "activity",         kindLabel: "活动",     kindClass: "bg-orange-50 text-orange-700" },
    deal:             { kind: "deal",             kindLabel: "优惠",     kindClass: "bg-blue-50 text-blue-700" },
    secondhand:       { kind: "secondhand",       kindLabel: "二手",     kindClass: "bg-teal-50 text-teal-700" },
    "flash-sale":     { kind: "flash-sale",       kindLabel: "限时活动", kindClass: "bg-destructive/10 text-destructive" },
    "merchant-benefit": { kind: "merchant-benefit", kindLabel: "商家福利", kindClass: "bg-green-50 text-green-700" },
    "pi-exclusive":   { kind: "pi-exclusive",     kindLabel: "Pi专属",  kindClass: "bg-primary/10 text-primary" },
  };

  function handleActivitySubmit(title: string, location: string) {
    addPost({ kind: "activity", kindLabel: "活动", kindClass: "bg-orange-50 text-orange-700", title, location, price: "", condition: "", description: "" });
    setSubmitted(true);
  }
  function handleDealSubmit(title: string, location: string) {
    addPost({ kind: "deal", kindLabel: "优惠", kindClass: "bg-blue-50 text-blue-700", title, location, price: "", condition: "", description: "" });
    setSubmitted(true);
  }
  function handleSecondhandSubmit({ title, location, isWanted, price, condition, description }: SecondhandSubmitPayload) {
    const meta = isWanted
      ? { kindLabel: "求购", kindClass: "bg-blue-50 text-blue-700" }
      : { kindLabel: "二手", kindClass: "bg-teal-50 text-teal-700" };
    addPost({ kind: "secondhand", ...meta, title, location, price, condition, description });
    setSubmitted(true);
  }
  function handleFlashSaleSubmit(title: string, location: string) {
    addPost({ kind: "flash-sale", kindLabel: "限时活动", kindClass: "bg-destructive/10 text-destructive", title, location, price: "", condition: "", description: "" });
    setSubmitted(true);
  }
  function handleMerchantBenefitSubmit(title: string, location: string) {
    addPost({ kind: "merchant-benefit", kindLabel: "商家福利", kindClass: "bg-green-50 text-green-700", title, location, price: "", condition: "", description: "" });
    setSubmitted(true);
  }
  function handlePiExclusiveSubmit(title: string, location: string) {
    addPost({ kind: "pi-exclusive", kindLabel: "Pi专属", kindClass: "bg-primary/10 text-primary", title, location, price: "", condition: "", description: "" });
    setSubmitted(true);
  }

  const title = submitted
    ? "发布成功"
    : selectedType
    ? `发布${currentTypeMeta?.label ?? ""}`
    : "我要发布";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-background rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          {selectedType && !submitted ? (
            <button onClick={() => setSelectedType(null)} className="p-2 -ml-2 rounded-full active:bg-muted transition-colors" aria-label="返回">
              <ArrowLeft size={20} className="text-foreground" />
            </button>
          ) : (
            <div className="w-9" />
          )}
          <h2 className="flex-1 text-center text-foreground font-bold text-base">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full active:bg-muted transition-colors" aria-label="关闭">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain pt-4">
          {!authed ? (
            <LoginGate onClose={onClose} onLoggedIn={() => setAuthed(true)} />
          ) : submitted ? (
            <SuccessScreen type={selectedType} onClose={onClose} onViewPosts={onViewMyPosts} />
          ) : selectedType === null ? (
            <TypeSelector onSelect={setSelectedType} />
          ) : selectedType === "activity" ? (
            <ActivityForm onSubmit={handleActivitySubmit} />
          ) : selectedType === "deal" ? (
            <DealForm onSubmit={handleDealSubmit} />
          ) : selectedType === "secondhand" ? (
            <SecondhandForm onSubmit={handleSecondhandSubmit} />
          ) : selectedType === "flash-sale" ? (
            <FlashSaleForm onSubmit={handleFlashSaleSubmit} />
          ) : selectedType === "merchant-benefit" ? (
            <MerchantBenefitForm onSubmit={handleMerchantBenefitSubmit} />
          ) : (
            <PiExclusiveForm onSubmit={handlePiExclusiveSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}
