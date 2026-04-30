import type { backendInterface, PostPublic, SocialAccountPublic, OptimizationResult, PlatformResult } from "../backend";
import { Platform, UserRole } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const mockPost1: PostPublic = {
  id: BigInt(1),
  mediaFilename: "sunset-photo.jpg",
  createdAt: now - BigInt(3600 * 1_000_000_000),
  originalCaption: "Golden hour vibes 🌅 Chasing sunsets and good energy.",
  publishStatus: { __kind__: "success", success: null },
  updatedAt: now - BigInt(3500 * 1_000_000_000),
  mediaBlob: { getBytes: async () => new Uint8Array(), getDirectURL: () => "https://picsum.photos/800/600", withUploadProgress: (fn: (n: number) => void) => ({ getBytes: async () => new Uint8Array(), getDirectURL: () => "https://picsum.photos/800/600", withUploadProgress: (fn2: (n: number) => void) => ({} as any) } as any) } as any,
  platformResults: [
    { status: { __kind__: "success", success: null }, postUrl: "https://instagram.com/p/abc123", publishedAt: now - BigInt(3500 * 1_000_000_000), platform: Platform.instagram },
    { status: { __kind__: "success", success: null }, postUrl: "https://facebook.com/posts/abc123", publishedAt: now - BigInt(3500 * 1_000_000_000), platform: Platform.facebook },
    { status: { __kind__: "failed", failed: "Token expired" }, platform: Platform.tiktok },
  ],
  selectedPlatforms: [Platform.instagram, Platform.facebook, Platform.tiktok],
};

const mockPost2: PostPublic = {
  id: BigInt(2),
  mediaFilename: "product-launch.mp4",
  createdAt: now - BigInt(7200 * 1_000_000_000),
  originalCaption: "Excited to announce our new product launch! Stay tuned for more updates. #launch #product",
  publishStatus: { __kind__: "publishing", publishing: null },
  updatedAt: now - BigInt(7100 * 1_000_000_000),
  mediaBlob: { getBytes: async () => new Uint8Array(), getDirectURL: () => "https://picsum.photos/800/600?grayscale", withUploadProgress: (fn: (n: number) => void) => ({} as any) } as any,
  platformResults: [
    { status: { __kind__: "success", success: null }, postUrl: "https://twitter.com/status/abc", publishedAt: now - BigInt(7000 * 1_000_000_000), platform: Platform.twitter },
    { status: { __kind__: "publishing", publishing: null }, platform: Platform.linkedin },
  ],
  selectedPlatforms: [Platform.twitter, Platform.linkedin],
};

const mockPost3: PostPublic = {
  id: BigInt(3),
  mediaFilename: "team-photo.jpg",
  createdAt: now - BigInt(86400 * 1_000_000_000),
  originalCaption: "Meet our amazing team! We're growing and hiring.",
  publishStatus: { __kind__: "pending", pending: null },
  updatedAt: now - BigInt(86400 * 1_000_000_000),
  mediaBlob: { getBytes: async () => new Uint8Array(), getDirectURL: () => "https://picsum.photos/800/600?blur=2", withUploadProgress: (fn: (n: number) => void) => ({} as any) } as any,
  platformResults: [],
  selectedPlatforms: [Platform.instagram, Platform.facebook, Platform.twitter, Platform.linkedin],
};

const mockAccounts: SocialAccountPublic[] = [
  { id: BigInt(1), createdAt: now - BigInt(30 * 86400 * 1_000_000_000), platform: Platform.instagram, isActive: true, accountHandle: "@mybrand" },
  { id: BigInt(2), createdAt: now - BigInt(30 * 86400 * 1_000_000_000), platform: Platform.facebook, isActive: true, accountHandle: "My Brand Page" },
  { id: BigInt(3), createdAt: now - BigInt(15 * 86400 * 1_000_000_000), platform: Platform.twitter, isActive: true, accountHandle: "@mybrand_official" },
  { id: BigInt(4), createdAt: now - BigInt(10 * 86400 * 1_000_000_000), platform: Platform.linkedin, isActive: false, accountHandle: "My Brand Inc." },
];

const mockOptimization: OptimizationResult = {
  postId: BigInt(1),
  generatedAt: now,
  suggestions: [
    {
      platform: Platform.instagram,
      caption: "Golden hour vibes 🌅 Chasing sunsets and good energy. Double tap if you love sunsets!",
      hashtags: ["#sunset", "#goldenhour", "#nature", "#photography", "#sky", "#vibes", "#photooftheday"],
    },
    {
      platform: Platform.facebook,
      caption: "There's nothing quite like a perfect golden hour. This stunning sunset reminded us to pause and appreciate the beauty around us. 🌅",
      hashtags: ["#sunset", "#goldenhour", "#nature"],
    },
    {
      platform: Platform.twitter,
      caption: "Golden hour vibes 🌅 Chasing sunsets and good energy. #sunset #goldenhour",
      hashtags: ["#sunset", "#goldenhour"],
    },
    {
      platform: Platform.linkedin,
      caption: "Taking a moment to appreciate the beauty of a golden hour sunset. Sometimes the best strategy is to pause and recharge. 🌅",
      hashtags: ["#inspiration", "#mindfulness", "#sunset"],
    },
  ],
};

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async (_hashes) => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async (_blobs) => undefined,
  _immutableObjectStorageCreateCertificate: async (_blobHash) => ({ method: "", blob_hash: "" }),
  _immutableObjectStorageRefillCashier: async (_info) => ({}),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
  addSocialAccount: async (req) => ({
    id: BigInt(99),
    createdAt: now,
    platform: req.platform,
    isActive: true,
    accountHandle: req.accountHandle,
  }),
  assignCallerUserRole: async () => undefined,
  createPost: async (req) => ({
    id: BigInt(10),
    mediaFilename: req.mediaFilename,
    createdAt: now,
    originalCaption: req.originalCaption,
    publishStatus: { __kind__: "pending", pending: null },
    updatedAt: now,
    mediaBlob: req.mediaBlob,
    platformResults: [],
    selectedPlatforms: req.selectedPlatforms,
  }),
  getCallerUserRole: async () => UserRole.user,
  getOptimizationResult: async (_postId) => mockOptimization,
  getPost: async (postId) => {
    if (postId === BigInt(1)) return mockPost1;
    if (postId === BigInt(2)) return mockPost2;
    if (postId === BigInt(3)) return mockPost3;
    return null;
  },
  getPublishResults: async (_postId) => mockPost1.platformResults,
  isCallerAdmin: async () => false,
  listPosts: async () => [mockPost1, mockPost2, mockPost3],
  listSocialAccounts: async () => mockAccounts,
  optimizeCaption: async (_postId) => mockOptimization,
  publishPost: async (_postId) => mockPost1.platformResults,
  revokeSocialAccount: async (_accountId) => true,
  transformAi: async (input) => ({ status: BigInt(200), body: new Uint8Array(), headers: [] }),
  transformPublish: async (input) => ({ status: BigInt(200), body: new Uint8Array(), headers: [] }),
};
