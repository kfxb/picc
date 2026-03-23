"use client";

import { useState } from "react";
import { X, Wallet, CheckCircle, AlertCircle, ExternalLink, Copy, LogOut } from "lucide-react";
import { usePiAuth } from "@/contexts/pi-auth-context";

interface WalletConnectModalProps {
  onClose: () => void;
}

function PiLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="currentColor" fillOpacity="0.15" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fontSize="36" fontWeight="bold" fill="currentColor" fontFamily="Georgia, serif">
        π
      </text>
    </svg>
  );
}

type Step = "idle" | "connecting" | "success" | "error";

export function WalletConnectModal({ onClose }: WalletConnectModalProps) {
  const { wallet, walletLoading, walletError, connectWallet, disconnectWallet } = usePiAuth();
  const [step, setStep] = useState<Step>(wallet ? "success" : "idle");
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleConnect() {
    setStep("connecting");
    setLocalError(null);
    try {
      await connectWallet();
      setStep("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "连接失败，请重试。";
      setLocalError(msg);
      setStep("error");
    }
  }

  function handleDisconnect() {
    disconnectWallet();
    setStep("idle");
  }

  function handleCopy() {
    if (!wallet?.address) return;
    navigator.clipboard.writeText(wallet.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const shortAddress = wallet?.address
    ? wallet.address.slice(0, 6) + "..." + wallet.address.slice(-6)
    : null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="连接 Pi 钱包"
    >
      {/* Sheet */}
      <div className="w-full max-w-md bg-card rounded-t-3xl shadow-2xl overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Pi 钱包</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:bg-muted transition-colors"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-6 space-y-6">

          {/* ── IDLE ── */}
          {step === "idle" && (
            <>
              {/* Pi branding */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-primary">
                  <PiLogo size={64} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-foreground">连接 Pi 钱包</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    连接您的 Pi Network 账号，使用 Pi 支付和查看钱包余额。
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-muted rounded-2xl p-4 space-y-3">
                {[
                  { icon: "π", text: "查看 Pi 余额" },
                  { icon: "✓", text: "使用 Pi 支付本地商家" },
                  { icon: "★", text: "解锁 Pioneer 专属优惠" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{item.icon}</span>
                    </div>
                    <span className="text-sm text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Note */}
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                请在 Pi Browser 中打开以完成连接。连接操作将跳转至 Pi Network 授权页面。
              </p>

              {/* CTA */}
              <button
                onClick={handleConnect}
                disabled={walletLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-4 rounded-2xl active:opacity-80 transition-opacity disabled:opacity-60"
              >
                <Wallet size={18} />
                连接 Pi 钱包
              </button>
            </>
          )}

          {/* ── CONNECTING ── */}
          {step === "connecting" && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <PiLogo size={36} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-foreground">正在连接...</h3>
                <p className="text-sm text-muted-foreground mt-1">请在 Pi Browser 中完成授权</p>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === "success" && wallet && (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-foreground">钱包已连接</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    欢迎回来，{wallet.username}
                  </p>
                </div>
              </div>

              {/* Wallet card */}
              <div className="bg-secondary rounded-2xl p-4 space-y-4">
                {/* Address row */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-foreground/50 text-xs mb-0.5">钱包地址</p>
                    <p className="text-secondary-foreground font-mono text-sm font-medium">{shortAddress}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-primary font-semibold px-3 py-1.5 bg-primary/15 rounded-xl active:opacity-70 transition-opacity"
                  >
                    <Copy size={13} />
                    {copied ? "已复制" : "复制"}
                  </button>
                </div>

                {/* Balance row */}
                <div className="border-t border-secondary-foreground/10 pt-3">
                  <p className="text-secondary-foreground/50 text-xs mb-1">Pi 余额</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-primary font-black text-3xl leading-none">π</span>
                    <span className="text-secondary-foreground font-bold text-2xl leading-none">
                      {wallet.balance !== null ? wallet.balance.toFixed(4) : "—"}
                    </span>
                    <span className="text-secondary-foreground/40 text-xs">（余额需服务端权限）</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://minepi.com/wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-border text-sm font-semibold text-foreground active:bg-muted transition-colors"
                >
                  <ExternalLink size={15} />
                  Pi 钱包
                </a>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-border text-sm font-semibold text-muted-foreground active:bg-muted transition-colors"
                >
                  <LogOut size={15} />
                  断开连接
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl active:opacity-80 transition-opacity"
              >
                完成
              </button>
            </>
          )}

          {/* ── ERROR ── */}
          {step === "error" && (
            <>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
                  <AlertCircle size={36} className="text-destructive" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-foreground">连接失败</h3>
                  <p className="text-sm text-destructive mt-1 leading-relaxed">
                    {localError || walletError || "连接钱包时发生错误，请重试。"}
                  </p>
                </div>
              </div>

              <div className="bg-muted rounded-2xl p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">常见问题：</span><br />
                  • 请确保在 Pi Browser 中打开本应用<br />
                  • 确保已登录 Pi Network 账号<br />
                  • 检查网络连接后重试
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="py-3.5 rounded-2xl border border-border text-sm font-semibold text-muted-foreground active:bg-muted transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConnect}
                  className="py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold active:opacity-80 transition-opacity"
                >
                  重新连接
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
