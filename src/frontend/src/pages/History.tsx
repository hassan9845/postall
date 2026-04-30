import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";
import type {
  Platform as BackendPlatform,
  PostPublic as BackendPost,
} from "../backend.d.ts";
import { useBackendActor } from "../hooks/use-backend";
import { getPlatform } from "../lib/platforms";
import type { Platform } from "../types";

// ─── Platform icons ────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<Platform, React.ElementType> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
  linkedin: Briefcase,
  twitter: SiX,
};

// ─── Status config ─────────────────────────────────────────────────────────────

type StatusKind = "pending" | "publishing" | "success" | "failed";

function getStatusKind(status: BackendPost["publishStatus"]): StatusKind {
  return status.__kind__ as StatusKind;
}

const STATUS_CONFIG: Record<
  StatusKind,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Scheduled",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    dotClass: "bg-primary",
    icon: CalendarClock,
  },
  publishing: {
    label: "Publishing",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    dotClass: "bg-primary",
    icon: Loader2,
  },
  success: {
    label: "Published",
    badgeClass: "bg-accent/10 text-accent-foreground border-accent/20",
    dotClass: "bg-accent",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
    dotClass: "bg-destructive",
    icon: XCircle,
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatRelativeTime(ts: bigint): string {
  const diff = Date.now() - Number(ts);
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(Number(ts)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(ts: bigint): string {
  return new Date(Number(ts)).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────

function PostCardSkeleton() {
  return (
    <Card className="border-border">
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-32 mt-1" />
          </div>
          <Skeleton className="h-6 w-20 flex-shrink-0 rounded-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Platform result row ───────────────────────────────────────────────────────

function PlatformResultRow({
  platform,
  status,
  postUrl,
  publishedAt,
}: {
  platform: Platform;
  status: StatusKind;
  postUrl?: string;
  publishedAt?: bigint;
}) {
  const pm = getPlatform(platform);
  const PIcon = PLATFORM_ICONS[platform];
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-md bg-muted/40 border border-border/50">
      <div className="flex items-center gap-2.5 min-w-0">
        <PIcon className="h-4 w-4 flex-shrink-0" style={{ color: pm.color }} />
        <span className="text-sm font-body font-medium text-foreground">
          {pm.displayName}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {publishedAt && (
          <span className="text-xs text-muted-foreground font-mono hidden sm:block">
            {formatDateTime(publishedAt)}
          </span>
        )}
        <Badge
          variant="outline"
          className={`gap-1 text-xs h-6 ${cfg.badgeClass}`}
        >
          <StatusIcon
            className={`h-3 w-3 ${status === "publishing" ? "animate-spin" : ""}`}
          />
          {cfg.label}
        </Badge>
        {postUrl && status === "success" && (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200 font-body"
            aria-label={`View ${pm.displayName} post`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Scheduled banner ──────────────────────────────────────────────────────────

function ScheduledBanner({ createdAt }: { createdAt: bigint }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/8 border border-primary/20">
      <CalendarClock className="h-3.5 w-3.5 text-primary flex-shrink-0" />
      <span className="text-xs font-body text-primary">
        Queued {formatRelativeTime(createdAt)} — awaiting publish
      </span>
    </div>
  );
}

// ─── Post card ─────────────────────────────────────────────────────────────────

function PostCard({ post, index }: { post: BackendPost; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const overallKind = getStatusKind(post.publishStatus);
  const cfg = STATUS_CONFIG[overallKind];
  const StatusIcon = cfg.icon;
  const hasPlatformResults = post.platformResults.length > 0;
  const isScheduled = overallKind === "pending" || overallKind === "publishing";

  return (
    <Card
      className="border-border shadow-subtle hover:shadow-elevated transition-shadow duration-200"
      data-ocid={`history.item.${index}`}
    >
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body text-foreground line-clamp-2 leading-relaxed">
              {post.originalCaption}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5 font-mono truncate">
              {post.mediaFilename}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`flex-shrink-0 gap-1 text-xs h-6 ${cfg.badgeClass}`}
          >
            <StatusIcon
              className={`h-3 w-3 ${overallKind === "publishing" ? "animate-spin" : ""}`}
            />
            {cfg.label}
          </Badge>
        </div>

        {/* Scheduled banner (pending/publishing posts) */}
        {isScheduled && <ScheduledBanner createdAt={post.createdAt} />}

        {/* Platform summary row */}
        <div className="flex items-center gap-3 flex-wrap">
          {(post.selectedPlatforms as Platform[]).map((platform) => {
            const pm = getPlatform(platform);
            const result = post.platformResults.find(
              (r) => r.platform === (platform as BackendPlatform),
            );
            const PIcon = PLATFORM_ICONS[platform];
            const pStatus = result ? getStatusKind(result.status) : "pending";
            return (
              <div key={platform} className="flex items-center gap-1.5">
                <PIcon className="h-3.5 w-3.5" style={{ color: pm.color }} />
                <span className="text-xs text-muted-foreground">
                  {pm.displayName}
                </span>
                {pStatus === "success" && (
                  <CheckCircle2 className="h-3 w-3 text-accent" />
                )}
                {pStatus === "failed" && (
                  <XCircle className="h-3 w-3 text-destructive" />
                )}
                {(pStatus === "pending" || pStatus === "publishing") && (
                  <Clock className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer: time + expand */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs text-muted-foreground font-mono">
            {formatRelativeTime(post.createdAt)}
          </span>
          {hasPlatformResults && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200 font-body"
              data-ocid={`history.expand_button.${index}`}
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? "Collapse platform details"
                  : "Expand platform details"
              }
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  <span>Details</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Expanded platform details */}
        <AnimatePresence initial={false}>
          {expanded && hasPlatformResults && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-1 space-y-2 border-t border-border/60">
                <p className="text-xs font-body text-muted-foreground pt-2 pb-0.5 uppercase tracking-wide font-medium">
                  Platform Results
                </p>
                {post.platformResults.map((r) => (
                  <PlatformResultRow
                    key={r.platform as string}
                    platform={r.platform as Platform}
                    status={getStatusKind(r.status)}
                    postUrl={r.postUrl ?? undefined}
                    publishedAt={r.publishedAt ?? undefined}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────

const EMPTY_STATE_COPY: Record<FilterTab, { heading: string; body: string }> = {
  all: {
    heading: "No posts yet",
    body: "Create your first post and share it across all your social platforms in one click.",
  },
  scheduled: {
    heading: "No scheduled posts",
    body: "Posts waiting to be published will appear here.",
  },
  published: {
    heading: "No published posts",
    body: "Successfully published posts will appear here.",
  },
  failed: {
    heading: "No failed posts",
    body: "Any posts that encountered errors will appear here.",
  },
};

function EmptyState({ filter }: { filter: FilterTab }) {
  const copy = EMPTY_STATE_COPY[filter];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      data-ocid="history.empty_state"
    >
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        {filter === "scheduled" ? (
          <CalendarClock className="h-7 w-7 text-primary" />
        ) : (
          <FileText className="h-7 w-7 text-primary" />
        )}
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg mb-2">
        {copy.heading}
      </h3>
      <p className="text-sm text-muted-foreground font-body max-w-xs leading-relaxed mb-6">
        {copy.body}
      </p>
      {filter === "all" && (
        <Link to="/compose">
          <Button
            size="sm"
            className="gap-2"
            data-ocid="history.empty_compose_button"
          >
            <Send className="h-4 w-4" />
            Create First Post
          </Button>
        </Link>
      )}
    </motion.div>
  );
}

// ─── History page ──────────────────────────────────────────────────────────────

export type FilterTab = "all" | "scheduled" | "published" | "failed";

const VALID_TABS = new Set<FilterTab>([
  "all",
  "scheduled",
  "published",
  "failed",
]);

function resolveTab(raw: string | undefined): FilterTab {
  if (raw && VALID_TABS.has(raw as FilterTab)) return raw as FilterTab;
  return "all";
}

export function HistoryPage() {
  const search = useSearch({ strict: false }) as { tab?: string };
  const navigate = useNavigate();
  const activeFilter = resolveTab(search.tab);

  const { actor, isFetching: actorLoading } = useBackendActor();

  const { data: posts = [], isLoading } = useQuery<BackendPost[]>({
    queryKey: ["listPosts"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listPosts();
      return [...result].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt),
      );
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 10_000,
  });

  function setFilter(tab: FilterTab) {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: (tab === "all" ? {} : { tab }) as any,
      replace: true,
    });
  }

  const filteredPosts = posts.filter((post) => {
    const kind = getStatusKind(post.publishStatus);
    if (activeFilter === "scheduled")
      return kind === "pending" || kind === "publishing";
    if (activeFilter === "published") return kind === "success";
    if (activeFilter === "failed") return kind === "failed";
    return true;
  });

  const scheduledCount = posts.filter((p) => {
    const k = getStatusKind(p.publishStatus);
    return k === "pending" || k === "publishing";
  }).length;
  const publishedCount = posts.filter(
    (p) => getStatusKind(p.publishStatus) === "success",
  ).length;
  const failedCount = posts.filter(
    (p) => getStatusKind(p.publishStatus) === "failed",
  ).length;

  return (
    <div className="flex-1 bg-background py-6" data-ocid="history.page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Post History
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-body">
              All your published and scheduled posts across platforms.
            </p>
          </div>
          <Link to="/compose">
            <Button
              size="sm"
              className="gap-2 flex-shrink-0"
              data-ocid="history.compose_button"
            >
              <Send className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <Tabs
          value={activeFilter}
          onValueChange={(v) => setFilter(v as FilterTab)}
          className="mb-5"
        >
          <TabsList className="h-9 bg-muted/60 border border-border/60">
            <TabsTrigger
              value="all"
              className="text-xs h-7 px-4 data-[state=active]:bg-card"
              data-ocid="history.filter.tab.all"
            >
              All
              {posts.length > 0 && (
                <span className="ml-1.5 text-muted-foreground">
                  {posts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="scheduled"
              className="text-xs h-7 px-4 data-[state=active]:bg-card"
              data-ocid="history.filter.tab.scheduled"
            >
              Scheduled
              {scheduledCount > 0 && (
                <span className="ml-1.5 text-primary font-medium">
                  {scheduledCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="text-xs h-7 px-4 data-[state=active]:bg-card"
              data-ocid="history.filter.tab.published"
            >
              Published
              {publishedCount > 0 && (
                <span className="ml-1.5 text-muted-foreground">
                  {publishedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="failed"
              className="text-xs h-7 px-4 data-[state=active]:bg-card"
              data-ocid="history.filter.tab.failed"
            >
              Failed
              {failedCount > 0 && (
                <span className="ml-1.5 text-destructive font-medium">
                  {failedCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {isLoading || actorLoading ? (
          <div className="space-y-3" data-ocid="history.loading_state">
            {[1, 2, 3].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
            data-ocid="history.list"
          >
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id.toString()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <PostCard post={post} index={idx + 1} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
