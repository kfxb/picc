import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "派城 PiCity",
  description: "派城 PiCity — 连接城市商家与社区用户的本地数字商业平台，基于 Pi Network 生态。",
  other: {
    "pi-domain-verification": "aca1a4d64575589152329b6e9e167fca020d2e46079d4a00509b9e3dfb2dea4d549509abff8ce16778fca348f23b6d07bad58bc49eb08b6c2f53b2567fc922ed",
  },
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
