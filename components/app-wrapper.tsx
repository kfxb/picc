"use client";

import type { ReactNode } from "react";
import { PiAuthProvider } from "@/contexts/pi-auth-context";
import { PostsProvider } from "@/contexts/posts-context";
import { UserProfileProvider } from "@/contexts/user-profile-context";

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <UserProfileProvider>
        <PostsProvider>
          {children}
        </PostsProvider>
      </UserProfileProvider>
    </PiAuthProvider>
  );
}
