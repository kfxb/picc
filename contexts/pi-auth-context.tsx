"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import type {
  Product,
  SDKLiteInstance,
  UserPurchaseBalance,
} from "@/lib/sdklite-types";

export interface WalletInfo {
  address: string;
  balance: number | null;
  username: string;
}

export interface PiPaymentData {
  amount: number;       // Pi amount
  memo: string;         // Description shown to user
  metadata: Record<string, unknown>; // App-defined metadata
}

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: SDKLiteInstance | null;
  products: Product[] | null;
  restoredPurchases: UserPurchaseBalance[] | null;
  reinitialize: () => Promise<void>;
  // Wallet
  wallet: WalletInfo | null;
  walletLoading: boolean;
  walletError: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  // Payments
  createPayment: (data: PiPaymentData) => Promise<string | null>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.Pi !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });
};

const loadSDKLite = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.SDKLite !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_LITE_URL) {
      reject(new Error("SDKLite URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_LITE_URL;
    script.async = true;

    script.onload = () => {
      console.log("SDKLite script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load SDKLite script");
      reject(new Error("Failed to load SDKLite script"));
    };

    document.head.appendChild(script);
  });
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("正在初始化 Pi Network...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<
    UserPurchaseBalance[] | null
  >(null);
  const [wallet, setWallet] = useState<WalletInfo | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("picicity_wallet");
      return raw ? (JSON.parse(raw) as WalletInfo) : null;
    } catch {
      return null;
    }
  });
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const connectWallet = async (): Promise<void> => {
    if (walletLoading) return;
    setWalletLoading(true);
    setWalletError(null);
    try {
      if (typeof window.Pi === "undefined") {
        throw new Error("Pi SDK 未加载，请在 Pi Browser 中使用。");
      }
      // Request Pi authentication scopes including wallet address
      const scopes = ["username", "payments", "wallet_address"];
      const authResult = await new Promise<{
        user: { uid: string; username: string };
        accessToken: string;
      }>((resolve, reject) => {
        window.Pi.authenticate(scopes, async (payment: { identifier: string; transaction?: { txid: string } }) => {
          // Official docs: incomplete payments MUST be resolved before new payments can be created
          if (!payment?.identifier) return;
          try {
            if (payment.transaction?.txid) {
              // Transaction submitted but not completed — call server complete
              await fetch("/api/payments/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction.txid }),
              });
            } else {
              // Payment approved but no transaction — call server approve to resume
              await fetch("/api/payments/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId: payment.identifier }),
              });
            }
          } catch (e) {
            console.error("[PiCity] Failed to resolve incomplete payment:", e);
          }
        })
          .then(resolve)
          .catch(reject);
      });

      const walletInfo: WalletInfo = {
        address: authResult.user.uid,
        balance: null,
        username: authResult.user.username,
      };
      setWallet(walletInfo);
      try { localStorage.setItem("picicity_wallet", JSON.stringify(walletInfo)); } catch {}
    } catch (err) {
      console.error("[PiCity] Wallet connect failed:", err);
      const msg = err instanceof Error ? err.message : "连接钱包失败，请重试。";
      setWalletError(msg);
      throw err;
    } finally {
      setWalletLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setWalletError(null);
    try { localStorage.removeItem("picicity_wallet"); } catch {}
  };

  // Pi Payment — returns paymentId on success, null on failure/cancel
  const createPayment = async (data: PiPaymentData): Promise<string | null> => {
    if (typeof window.Pi === "undefined") {
      console.error("[PiCity] Pi SDK not loaded");
      return null;
    }
    return new Promise((resolve) => {
      window.Pi.createPayment(
        {
          amount: data.amount,
          memo: data.memo,
          metadata: data.metadata,
        },
        {
          // Called when payment dialog is ready — call your server to approve
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch("/api/payments/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId }),
              });
            } catch (e) {
              console.error("[PiCity] Server approval failed:", e);
            }
          },
          // Called when Pi Network confirms payment — call your server to complete
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            try {
              await fetch("/api/payments/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid }),
              });
              resolve(paymentId);
            } catch (e) {
              console.error("[PiCity] Server completion failed:", e);
              resolve(paymentId);
            }
          },
          onCancel: (paymentId: string) => {
            console.log("[PiCity] Payment cancelled:", paymentId);
            resolve(null);
          },
          onError: (error: Error) => {
            console.error("[PiCity] Payment error:", error);
            resolve(null);
          },
        }
      );
    });
  };

  const fetchProducts = async (sdkInstance: SDKLiteInstance): Promise<void> => {
    try {
      const { products } = await sdkInstance.state.products();
      setProducts(products);
    } catch (e) {
      console.error("Failed to load products:", e);
      setProducts([]);
    }
  };

  const initialize = async () => {
    setHasError(false);
    setRestoredPurchases(null);
    try {
      setAuthMessage("正在加载 Pi SDK...");
      await loadPiSDK();
      setAuthMessage("正在初始化 Pi Network...");
      await window.Pi.init({
        version: "2.0",
        sandbox: false,
      });
      setAuthMessage("正在加载 SDKLite...");
      await loadSDKLite();

      setAuthMessage("正在初始化 SDKLite...");
      const sdkInstance = await window.SDKLite.init();
      setAuthMessage("正在登录...");
      const success = await sdkInstance.login();
      if (!success) {
        throw new Error("登录失败，请重试。");
      }

      setSdk(sdkInstance);
      setIsAuthenticated(true);
      await fetchProducts(sdkInstance);

      try {
        const { purchases } = await sdkInstance.state.restore();
        setRestoredPurchases(purchases);
        console.log("[PiAuth] Purchases restored", purchases);
      } catch (e) {
        console.error("[PiAuth] Failed to restore purchases:", e);
        setRestoredPurchases([]);
      }
    } catch (err) {
      console.error("SDKLite initialization failed:", err);
      setHasError(true);
      setAuthMessage(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.",
      );
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    hasError,
    sdk,
    products,
    restoredPurchases,
    reinitialize: initialize,
    wallet,
    walletLoading,
    walletError,
    connectWallet,
    disconnectWallet,
    createPayment,
  };

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
