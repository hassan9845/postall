import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface PostPublic {
    id: PostId;
    mediaFilename: string;
    createdAt: Timestamp;
    originalCaption: string;
    publishStatus: PublishStatus;
    updatedAt: Timestamp;
    mediaBlob: ExternalBlob;
    platformResults: Array<PlatformResult>;
    selectedPlatforms: Array<Platform>;
}
export interface AddAccountRequest {
    refreshToken: string;
    platform: Platform;
    accessToken: string;
    accountHandle: string;
}
export type PostId = bigint;
export type PublishStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "publishing";
    publishing: null;
} | {
    __kind__: "success";
    success: null;
} | {
    __kind__: "failed";
    failed: string;
};
export interface PlatformCaption {
    hashtags: Array<string>;
    platform: Platform;
    caption: string;
}
export interface PlatformResult {
    status: PublishStatus;
    postUrl?: string;
    publishedAt?: Timestamp;
    platform: Platform;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SocialAccountPublic {
    id: AccountId;
    createdAt: Timestamp;
    platform: Platform;
    isActive: boolean;
    accountHandle: string;
}
export type AccountId = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CreatePostRequest {
    mediaFilename: string;
    originalCaption: string;
    mediaBlob: ExternalBlob;
    selectedPlatforms: Array<Platform>;
}
export interface OptimizationResult {
    suggestions: Array<PlatformCaption>;
    generatedAt: Timestamp;
    postId: PostId;
}
export enum Platform {
    linkedin = "linkedin",
    tiktok = "tiktok",
    twitter = "twitter",
    instagram = "instagram",
    facebook = "facebook"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addSocialAccount(req: AddAccountRequest): Promise<SocialAccountPublic>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(req: CreatePostRequest): Promise<PostPublic>;
    getCallerUserRole(): Promise<UserRole>;
    getOptimizationResult(postId: PostId): Promise<OptimizationResult | null>;
    getPost(postId: PostId): Promise<PostPublic | null>;
    getPublishResults(postId: PostId): Promise<Array<PlatformResult>>;
    isCallerAdmin(): Promise<boolean>;
    listPosts(): Promise<Array<PostPublic>>;
    listSocialAccounts(): Promise<Array<SocialAccountPublic>>;
    optimizeCaption(postId: PostId): Promise<OptimizationResult>;
    publishPost(postId: PostId): Promise<Array<PlatformResult>>;
    revokeSocialAccount(accountId: AccountId): Promise<boolean>;
    transformAi(input: TransformationInput): Promise<TransformationOutput>;
    transformPublish(input: TransformationInput): Promise<TransformationOutput>;
}
