import type { Platform } from "../types";

export interface PlatformMeta {
  id: Platform;
  displayName: string;
  color: string;
  bgColor: string;
  charLimit: number;
  hashtagLimit: number;
  icon: string; // emoji fallback; pages use react-icons
}

export const PLATFORMS: PlatformMeta[] = [
  {
    id: "instagram",
    displayName: "Instagram",
    color: "#E1306C",
    bgColor: "#fce4ec",
    charLimit: 2200,
    hashtagLimit: 30,
    icon: "📷",
  },
  {
    id: "facebook",
    displayName: "Facebook",
    color: "#1877F2",
    bgColor: "#e3f0fd",
    charLimit: 63206,
    hashtagLimit: 10,
    icon: "👍",
  },
  {
    id: "tiktok",
    displayName: "TikTok",
    color: "#010101",
    bgColor: "#f3f3f3",
    charLimit: 2200,
    hashtagLimit: 20,
    icon: "🎵",
  },
  {
    id: "linkedin",
    displayName: "LinkedIn",
    color: "#0A66C2",
    bgColor: "#e8f3fc",
    charLimit: 3000,
    hashtagLimit: 5,
    icon: "💼",
  },
  {
    id: "twitter",
    displayName: "Twitter / X",
    color: "#1DA1F2",
    bgColor: "#e8f5fd",
    charLimit: 280,
    hashtagLimit: 3,
    icon: "🐦",
  },
];

export const PLATFORM_MAP: Record<Platform, PlatformMeta> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p]),
) as Record<Platform, PlatformMeta>;

export function getPlatform(id: Platform): PlatformMeta {
  return PLATFORM_MAP[id];
}
