"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface UserProfile {
  nickname: string;
  avatarColor: string;   // tailwind bg color token e.g. "bg-primary"
  avatarEmoji: string;   // emoji or initial letter shown inside avatar
  avatarImage: string;   // base64 data URL of uploaded avatar image, empty = not set
  phone: string;         // bound phone number, empty = unbound
}

interface UserProfileContextType {
  profile: UserProfile;
  updateNickname: (name: string) => void;
  updateAvatar: (color: string, emoji: string) => void;
  updateAvatarImage: (dataUrl: string) => void;
  updatePhone: (phone: string) => void;
}

const defaultProfile: UserProfile = {
  nickname: "",
  avatarColor: "bg-primary",
  avatarEmoji: "π",
  avatarImage: "",
  phone: "",
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  function updateNickname(name: string) {
    setProfile((p) => ({ ...p, nickname: name.trim() }));
  }

  function updateAvatar(color: string, emoji: string) {
    setProfile((p) => ({ ...p, avatarColor: color, avatarEmoji: emoji }));
  }

  function updateAvatarImage(dataUrl: string) {
    setProfile((p) => ({ ...p, avatarImage: dataUrl }));
  }

  function updatePhone(phone: string) {
    setProfile((p) => ({ ...p, phone }));
  }

  return (
    <UserProfileContext.Provider value={{ profile, updateNickname, updateAvatar, updateAvatarImage, updatePhone }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
