export type Platform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "twitter";

export type PublishStatus = "pending" | "publishing" | "success" | "failed";

export interface PlatformResult {
  platform: Platform;
  status: PublishStatus;
  postUrl?: string;
  publishedAt?: bigint;
}

export interface PostPublic {
  id: string;
  mediaBlob: Uint8Array | null;
  mediaFilename: string;
  originalCaption: string;
  selectedPlatforms: Platform[];
  publishStatus: PublishStatus;
  platformResults: PlatformResult[];
  createdAt: bigint;
  updatedAt: bigint;
}

export interface SocialAccountPublic {
  id: string;
  platform: Platform;
  accountHandle: string;
  isActive: boolean;
  createdAt: bigint;
}

export interface PlatformSuggestion {
  platform: Platform;
  caption: string;
  hashtags: string[];
}

export interface OptimizationResult {
  postId: string;
  suggestions: PlatformSuggestion[];
  generatedAt: bigint;
}
