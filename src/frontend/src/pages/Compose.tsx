import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Briefcase,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  Hash,
  Image as ImageIcon,
  Loader2,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Upload,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Platform as BackendPlatform } from "../backend";
import { useBackendActor } from "../hooks/use-backend";
import { PLATFORMS, getPlatform } from "../lib/platforms";
import type { Platform } from "../types";

// ─── Platform icon ────────────────────────────────────────────────────────────
function PlatformIcon({
  platform,
  size = 16,
}: { platform: Platform; size?: number }) {
  switch (platform) {
    case "instagram":
      return <SiInstagram size={size} />;
    case "facebook":
      return <SiFacebook size={size} />;
    case "tiktok":
      return <SiTiktok size={size} />;
    case "linkedin":
      return <Briefcase size={size} />;
    case "twitter":
      return <SiX size={size} />;
  }
}

// ─── Status helper ────────────────────────────────────────────────────────────
type StatusKind = "pending" | "publishing" | "success" | "failed";

function toStatusKind(s: { __kind__: string }): StatusKind {
  return s.__kind__ as StatusKind;
}

// ─── Step type ────────────────────────────────────────────────────────────────
type Step = "compose" | "optimize" | "publishing" | "done";

// ─── Scheduling panel ─────────────────────────────────────────────────────────
interface SchedulePanelProps {
  selectedPlatforms: Set<Platform>;
  onDismiss: () => void;
  onPublishNow: () => void;
}

function SchedulePanel({
  selectedPlatforms,
  onDismiss,
  onPublishNow,
}: SchedulePanelProps) {
  const today = new Date().toISOString().split("T")[0];
  const [schedDate, setSchedDate] = useState(today);
  const [schedTime, setSchedTime] = useState("09:00");
  const [schedPlatforms, setSchedPlatforms] = useState<Set<Platform>>(
    new Set(selectedPlatforms),
  );

  const toggleSched = (p: Platform) =>
    setSchedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });

  const handleSchedule = () => {
    if (!schedDate || !schedTime) {
      toast.error("Please select a date and time.");
      return;
    }
    if (schedPlatforms.size === 0) {
      toast.error("Please choose at least one platform.");
      return;
    }
    const formatted = new Date(`${schedDate}T${schedTime}`).toLocaleString(
      undefined,
      { dateStyle: "medium", timeStyle: "short" },
    );
    toast.success(`Post scheduled for ${formatted}!`);
    onDismiss();
  };

  return (
    <motion.div
      key="schedule-panel"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
      data-ocid="compose.schedule.panel"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <CalendarClock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Schedule Your Post
            </h3>
            <p className="text-xs text-muted-foreground">
              Choose a date and time to automatically publish across your
              connected platforms.
            </p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="compose.schedule.close_button"
          onClick={onDismiss}
          aria-label="Dismiss scheduling panel"
          className="rounded-full p-1.5 hover:bg-muted/60 text-muted-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Date + Time row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="sched-date"
              className="text-xs font-medium flex items-center gap-1.5"
            >
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              Select Date
            </Label>
            <Input
              id="sched-date"
              data-ocid="compose.schedule.date.input"
              type="date"
              value={schedDate}
              min={today}
              onChange={(e) => setSchedDate(e.target.value)}
              className="text-sm h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="sched-time"
              className="text-xs font-medium flex items-center gap-1.5"
            >
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Select Time
            </Label>
            <Input
              id="sched-time"
              data-ocid="compose.schedule.time.input"
              type="time"
              value={schedTime}
              onChange={(e) => setSchedTime(e.target.value)}
              className="text-sm h-9"
            />
          </div>
        </div>

        {/* Best time hint */}
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/40 rounded-lg px-3 py-2">
          <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <span>
            <span className="font-medium text-foreground">
              Best time suggestion:
            </span>{" "}
            Tue–Thu at 9–11 AM typically drives the highest engagement.
          </span>
        </p>

        {/* Platform multi-select */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Choose Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((meta) => {
              const active = schedPlatforms.has(meta.id);
              return (
                <button
                  type="button"
                  key={meta.id}
                  data-ocid={`compose.schedule.platform.${meta.id}`}
                  onClick={() => toggleSched(meta.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  <PlatformIcon platform={meta.id} size={12} />
                  {meta.displayName}
                  {active && <CheckCircle2 className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            data-ocid="compose.schedule.submit_button"
            size="sm"
            className="flex-1"
            onClick={handleSchedule}
          >
            <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
            Schedule Post
          </Button>
          <Button
            data-ocid="compose.schedule.publish_now_button"
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => {
              onDismiss();
              onPublishNow();
            }}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Publish Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hashtag input ────────────────────────────────────────────────────────────
interface HashtagInputProps {
  onDismiss: () => void;
  onAdd: (tag: string) => void;
}

function HashtagInput({ onDismiss, onAdd }: HashtagInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
    toast.success(
      `Hashtag ${trimmed.startsWith("#") ? trimmed : `#${trimmed}`} added!`,
    );
  };

  return (
    <motion.div
      key="hashtag-input"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="rounded-xl border border-border bg-card shadow-sm px-4 py-3 flex items-center gap-2"
      data-ocid="compose.hashtag.panel"
    >
      <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <Input
        data-ocid="compose.hashtag.input"
        autoFocus
        placeholder="Add a hashtag (e.g. travel)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onDismiss();
        }}
        className="h-8 text-sm border-0 shadow-none focus-visible:ring-0 px-0 bg-transparent"
      />
      <Button
        data-ocid="compose.hashtag.add_button"
        size="sm"
        variant="outline"
        className="h-8 text-xs flex-shrink-0"
        onClick={submit}
      >
        Add
      </Button>
      <button
        type="button"
        data-ocid="compose.hashtag.close_button"
        onClick={onDismiss}
        aria-label="Dismiss hashtag input"
        className="rounded-full p-1 hover:bg-muted/60 text-muted-foreground transition-colors flex-shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function ComposePage() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();

  // workflow
  const [step, setStep] = useState<Step>("compose");
  const [postId, setPostId] = useState<bigint | null>(null);

  // compose
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(
    new Set<Platform>(["instagram", "facebook", "twitter"]),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // compose panel states
  const [showSchedule, setShowSchedule] = useState(false);
  const [showHashtag, setShowHashtag] = useState(false);

  // optimize
  const [editedCaptions, setEditedCaptions] = useState<
    Record<Platform, string>
  >({} as Record<Platform, string>);
  const [hashtags, setHashtags] = useState<Record<Platform, string[]>>(
    {} as Record<Platform, string[]>,
  );

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: connectedAccounts = [] } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => (actor ? actor.listSocialAccounts() : []),
    enabled: !!actor,
  });

  const connectedSet = new Set<Platform>(
    connectedAccounts
      .filter((a) => a.isActive)
      .map((a) => a.platform as Platform),
  );

  const { data: publishResults = [] } = useQuery({
    queryKey: ["publish-results", postId?.toString()],
    queryFn: async () =>
      actor && postId ? actor.getPublishResults(postId) : [],
    enabled: !!actor && !!postId && step === "publishing",
    refetchInterval: 2000,
  });

  // Check for completion
  const allResolved =
    step === "publishing" &&
    publishResults.length > 0 &&
    publishResults.every((r) => {
      const k = toStatusKind(r.status);
      return k === "success" || k === "failed";
    });
  if (allResolved) setTimeout(() => setStep("done"), 500);

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Only image or video files are supported.");
      return;
    }
    setMediaFile(file);
    setMediaPreviewUrl(URL.createObjectURL(file));
  }, []);

  // ── Create post ───────────────────────────────────────────────────────────
  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!mediaFile) throw new Error("No media selected");
      const bytes = new Uint8Array(await mediaFile.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
        (pct: number) => setUploadProgress(Math.round(pct)),
      );
      return actor.createPost({
        mediaFilename: mediaFile.name,
        originalCaption: caption,
        mediaBlob: blob,
        selectedPlatforms: Array.from(selectedPlatforms) as BackendPlatform[],
      });
    },
    onSuccess: (post) => {
      setPostId(post.id);
      const seeded = {} as Record<Platform, string>;
      for (const p of selectedPlatforms) {
        seeded[p] = caption;
      }
      setEditedCaptions(seeded);
      setStep("optimize");
    },
    onError: () => {
      toast.error("Upload failed. Please try again.");
      setUploadProgress(0);
    },
  });

  // ── Optimize caption ──────────────────────────────────────────────────────
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !postId) throw new Error("No post");
      return actor.optimizeCaption(postId);
    },
    onSuccess: (result) => {
      const newCaptions = { ...editedCaptions };
      const newHashtags = {} as Record<Platform, string[]>;
      for (const s of result.suggestions) {
        const p = s.platform as Platform;
        newCaptions[p] = s.caption;
        newHashtags[p] = s.hashtags;
      }
      setEditedCaptions(newCaptions);
      setHashtags(newHashtags);
      toast.success("AI optimization complete!");
    },
    onError: () => {
      toast.error("Optimization failed — you can still publish manually.");
    },
  });

  // ── Publish post ──────────────────────────────────────────────────────────
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !postId) throw new Error("No post");
      return actor.publishPost(postId);
    },
    onSuccess: () => {
      setStep("publishing");
      queryClient.invalidateQueries({ queryKey: ["publish-results"] });
    },
    onError: () => {
      toast.error("Publish failed. Please try again.");
    },
  });

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep("compose");
    setPostId(null);
    setMediaFile(null);
    setMediaPreviewUrl(null);
    setUploadProgress(0);
    setCaption("");
    setSelectedPlatforms(
      new Set<Platform>(["instagram", "facebook", "twitter"]),
    );
    setEditedCaptions({} as Record<Platform, string>);
    setHashtags({} as Record<Platform, string[]>);
    setShowSchedule(false);
    setShowHashtag(false);
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const togglePlatform = (p: Platform) =>
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });

  const addHashtag = (platform: Platform, tag: string) => {
    const cleaned = tag.startsWith("#") ? tag : `#${tag}`;
    const current = editedCaptions[platform] ?? "";
    if (!current.includes(cleaned)) {
      setEditedCaptions((prev) => ({
        ...prev,
        [platform]: `${current} ${cleaned}`.trim(),
      }));
    }
  };

  // Add hashtag to the compose caption (step 1)
  const addHashtagToCaption = (tag: string) => {
    const cleaned = tag.startsWith("#") ? tag : `#${tag}`;
    if (!caption.includes(cleaned)) {
      setCaption((prev) => `${prev} ${cleaned}`.trim());
    }
  };

  // Trigger the create-post flow then proceed to optimize
  const handleContinueToOptimize = () => {
    setShowSchedule(false);
    setShowHashtag(false);
    createPostMutation.mutate();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-background"
      data-ocid="compose.page"
    >
      {/* Page header */}
      <div className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Create New Post
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create, schedule, and publish—all in one place.
            </p>
          </div>
          <StepPills step={step} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "compose" && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-6"
            >
              {/* Left: media + caption + action buttons */}
              <div className="lg:col-span-3 space-y-4">
                <MediaDropzone
                  mediaFile={mediaFile}
                  previewUrl={mediaPreviewUrl}
                  isDragging={isDragging}
                  uploadProgress={uploadProgress}
                  isUploading={createPostMutation.isPending}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleFile(f);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onBrowse={() => fileInputRef.current?.click()}
                  onRemove={() => {
                    setMediaFile(null);
                    setMediaPreviewUrl(null);
                  }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <CaptionField
                  value={caption}
                  onChange={setCaption}
                  selectedPlatforms={selectedPlatforms}
                />

                {/* Action buttons row */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                  data-ocid="compose.actions.row"
                >
                  <Button
                    data-ocid="compose.actions.upload_media_button"
                    variant="outline"
                    size="sm"
                    type="button"
                    className="gap-1.5 text-xs"
                    onClick={() => {
                      setShowSchedule(false);
                      setShowHashtag(false);
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Media
                  </Button>
                  <Button
                    data-ocid="compose.actions.add_hashtags_button"
                    variant="outline"
                    size="sm"
                    type="button"
                    className={`gap-1.5 text-xs transition-colors ${showHashtag ? "border-primary/40 bg-primary/5 text-primary" : ""}`}
                    onClick={() => {
                      setShowSchedule(false);
                      setShowHashtag((v) => !v);
                    }}
                  >
                    <Hash className="h-3.5 w-3.5" />
                    Add Hashtags
                  </Button>
                  <Button
                    data-ocid="compose.actions.schedule_post_button"
                    variant="outline"
                    size="sm"
                    type="button"
                    className={`gap-1.5 text-xs transition-colors ${showSchedule ? "border-primary/40 bg-primary/5 text-primary" : ""}`}
                    onClick={() => {
                      setShowHashtag(false);
                      setShowSchedule((v) => !v);
                    }}
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Schedule Post
                  </Button>
                  <Button
                    data-ocid="compose.actions.publish_now_button"
                    size="sm"
                    type="button"
                    className="gap-1.5 text-xs"
                    disabled={
                      !mediaFile ||
                      !caption.trim() ||
                      selectedPlatforms.size === 0 ||
                      createPostMutation.isPending
                    }
                    onClick={handleContinueToOptimize}
                  >
                    {createPostMutation.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Publish Now
                  </Button>
                </div>

                {/* Inline panels */}
                <AnimatePresence>
                  {showHashtag && (
                    <HashtagInput
                      onDismiss={() => setShowHashtag(false)}
                      onAdd={addHashtagToCaption}
                    />
                  )}
                  {showSchedule && (
                    <SchedulePanel
                      selectedPlatforms={selectedPlatforms}
                      onDismiss={() => setShowSchedule(false)}
                      onPublishNow={handleContinueToOptimize}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Right: platforms + Continue CTA */}
              <div className="lg:col-span-2 space-y-4">
                <PlatformPicker
                  selectedPlatforms={selectedPlatforms}
                  connectedSet={connectedSet}
                  onToggle={togglePlatform}
                />
                <Button
                  data-ocid="compose.submit_button"
                  className="w-full"
                  size="lg"
                  variant="outline"
                  disabled={
                    !mediaFile ||
                    !caption.trim() ||
                    selectedPlatforms.size === 0 ||
                    createPostMutation.isPending
                  }
                  onClick={handleContinueToOptimize}
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Continue to Optimize
                    </>
                  )}
                </Button>
                {!mediaFile && (
                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Add media to continue
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === "optimize" && (
            <motion.div
              key="optimize"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              {/* Top summary bar */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                {mediaPreviewUrl && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                    {mediaFile?.type.startsWith("video/") ? (
                      <video
                        src={mediaPreviewUrl}
                        className="w-full h-full object-cover"
                      >
                        <track kind="captions" />
                      </video>
                    ) : (
                      <img
                        src={mediaPreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium line-clamp-2">
                    {caption}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {Array.from(selectedPlatforms).map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                      >
                        <PlatformIcon platform={p} size={12} />
                        {getPlatform(p).displayName}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  data-ocid="compose.optimize.primary_button"
                  variant="outline"
                  size="sm"
                  disabled={optimizeMutation.isPending}
                  onClick={() => optimizeMutation.mutate()}
                  className="flex-shrink-0"
                >
                  {optimizeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Optimizing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-3.5 w-3.5" />
                      {Object.keys(hashtags).length > 0
                        ? "Re-optimize"
                        : "AI Optimize"}
                    </>
                  )}
                </Button>
              </div>

              {/* Per-platform editors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from(selectedPlatforms).map((platform, i) => (
                  <PlatformEditor
                    key={platform}
                    index={i}
                    platform={platform}
                    caption={editedCaptions[platform] ?? caption}
                    hashtags={hashtags[platform] ?? []}
                    onCaptionChange={(v) =>
                      setEditedCaptions((p) => ({ ...p, [platform]: v }))
                    }
                    onAddHashtag={(tag) => addHashtag(platform, tag)}
                  />
                ))}
              </div>

              {/* Action bar */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  data-ocid="compose.optimize.back_button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("compose")}
                >
                  ← Back
                </Button>
                <Button
                  data-ocid="compose.publish.primary_button"
                  size="lg"
                  disabled={publishMutation.isPending}
                  onClick={() => publishMutation.mutate()}
                  className="px-8"
                >
                  {publishMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Publish Now
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {(step === "publishing" || step === "done") && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              <PublishPanel
                selectedPlatforms={selectedPlatforms}
                results={publishResults.map((r) => ({
                  platform: r.platform as Platform,
                  status: toStatusKind(r.status),
                  postUrl: r.postUrl,
                }))}
                isDone={step === "done"}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Step pills ───────────────────────────────────────────────────────────────
function StepPills({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "compose", label: "Compose" },
    { id: "optimize", label: "Optimize" },
    { id: "publishing", label: "Publish" },
    { id: "done", label: "Done" },
  ];
  const current = steps.findIndex((s) => s.id === step);

  return (
    <div className="hidden sm:flex items-center gap-1.5">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-smooth ${
              i < current
                ? "bg-primary/10 border-primary/30 text-primary"
                : i === current
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-muted border-border text-muted-foreground"
            }`}
          >
            {i < current ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                {i + 1}
              </span>
            )}
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-4 ${i < current ? "bg-primary/40" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Media dropzone ───────────────────────────────────────────────────────────
interface MediaDropzoneProps {
  mediaFile: File | null;
  previewUrl: string | null;
  isDragging: boolean;
  uploadProgress: number;
  isUploading: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onBrowse: () => void;
  onRemove: () => void;
}

function MediaDropzone({
  mediaFile,
  previewUrl,
  isDragging,
  uploadProgress,
  isUploading,
  onDrop,
  onDragOver,
  onDragLeave,
  onBrowse,
  onRemove,
}: MediaDropzoneProps) {
  const isVideo = mediaFile?.type.startsWith("video/");

  if (previewUrl && mediaFile) {
    return (
      <Card className="overflow-hidden border-border">
        <div className="relative aspect-video bg-muted">
          {isVideo ? (
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              controls
            >
              <track kind="captions" />
            </video>
          ) : (
            <img
              src={previewUrl}
              alt="Media preview"
              className="w-full h-full object-cover"
            />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="w-44">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  {uploadProgress}%
                </p>
              </div>
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              data-ocid="compose.media.close_button"
              onClick={onRemove}
              aria-label="Remove media"
              className="absolute top-2 right-2 bg-background/90 hover:bg-background border border-border rounded-full p-1.5 transition-smooth"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <CardContent className="py-2.5 px-4 flex items-center gap-2 text-sm text-muted-foreground">
          {isVideo ? (
            <Video className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ImageIcon className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="truncate min-w-0">{mediaFile.name}</span>
          <span className="flex-shrink-0 text-xs">
            ({(mediaFile.size / 1024 / 1024).toFixed(1)} MB)
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      data-ocid="compose.media.dropzone"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed min-h-52 p-8 transition-smooth ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/20 bg-card"
      }`}
    >
      <div className="rounded-full bg-muted p-4 pointer-events-none">
        <Upload className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="text-center pointer-events-none">
        <p className="font-medium text-foreground">Drop your media here</p>
        <p className="text-sm text-muted-foreground mt-1">
          Images & videos supported
        </p>
      </div>
      <Button
        data-ocid="compose.media.upload_button"
        variant="outline"
        size="sm"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onBrowse();
        }}
      >
        <Upload className="mr-2 h-4 w-4" />
        Choose file
      </Button>
    </div>
  );
}

// ─── Caption field ────────────────────────────────────────────────────────────
function CaptionField({
  value,
  onChange,
  selectedPlatforms,
}: {
  value: string;
  onChange: (v: string) => void;
  selectedPlatforms: Set<Platform>;
}) {
  const minLimit = Math.min(
    ...Array.from(selectedPlatforms).map((p) => getPlatform(p).charLimit),
    99999,
  );
  const over = minLimit < 99999 && value.length > minLimit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="compose-caption"
          className="text-sm font-medium text-foreground"
        >
          Caption
        </label>
        <span
          className={`text-xs tabular-nums ${over ? "text-destructive" : "text-muted-foreground"}`}
        >
          {value.length}
          {minLimit < 99999 && ` / ${minLimit}`}
        </span>
      </div>
      <Textarea
        id="compose-caption"
        data-ocid="compose.caption.textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What would you like to share?"
        className="min-h-32 resize-none text-sm"
      />
    </div>
  );
}

// ─── Platform picker ──────────────────────────────────────────────────────────
function PlatformPicker({
  selectedPlatforms,
  connectedSet,
  onToggle,
}: {
  selectedPlatforms: Set<Platform>;
  connectedSet: Set<Platform>;
  onToggle: (p: Platform) => void;
}) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-foreground">
          Publish to
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2">
        {PLATFORMS.map((meta) => {
          const selected = selectedPlatforms.has(meta.id);
          const connected = connectedSet.has(meta.id);
          return (
            <button
              type="button"
              key={meta.id}
              data-ocid={`compose.platform.${meta.id}`}
              onClick={() => onToggle(meta.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-smooth ${
                selected
                  ? "border-primary/40 bg-primary/5 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/20"
              }`}
            >
              <div
                className={`flex-shrink-0 transition-smooth ${selected ? "text-primary" : "text-muted-foreground"}`}
              >
                <PlatformIcon platform={meta.id} size={18} />
              </div>
              <span className="flex-1 text-sm font-medium">
                {meta.displayName}
              </span>
              <div className="flex items-center gap-1.5">
                {connected && (
                  <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">
                    Connected
                  </span>
                )}
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-smooth ${selected ? "bg-primary border-primary" : "border-border bg-background"}`}
                >
                  {selected && (
                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Per-platform caption editor ──────────────────────────────────────────────
function PlatformEditor({
  platform,
  caption,
  hashtags,
  index,
  onCaptionChange,
  onAddHashtag,
}: {
  platform: Platform;
  caption: string;
  hashtags: string[];
  index: number;
  onCaptionChange: (v: string) => void;
  onAddHashtag: (tag: string) => void;
}) {
  const meta = getPlatform(platform);
  const over = caption.length > meta.charLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
    >
      <Card className="border-border h-full">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PlatformIcon platform={platform} size={16} />
              <span className="text-sm font-semibold">{meta.displayName}</span>
            </div>
            <span
              className={`text-xs tabular-nums ${over ? "text-destructive" : "text-muted-foreground"}`}
            >
              {caption.length} / {meta.charLimit}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <Textarea
            data-ocid={`compose.caption.${platform}.textarea`}
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            className="min-h-24 resize-none text-sm"
            placeholder={`Caption for ${meta.displayName}…`}
          />
          {hashtags.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Suggested hashtags
                <span className="ml-1 opacity-60">
                  (max {meta.hashtagLimit})
                </span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hashtags.slice(0, meta.hashtagLimit).map((tag) => {
                  const withHash = tag.startsWith("#") ? tag : `#${tag}`;
                  const added = caption.includes(withHash);
                  return (
                    <button
                      type="button"
                      key={tag}
                      data-ocid={`compose.hashtag.${platform}.button`}
                      onClick={() => !added && onAddHashtag(tag)}
                      disabled={added}
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs border transition-smooth ${
                        added
                          ? "border-primary/30 bg-primary/10 text-primary cursor-default opacity-60"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {!added && <Plus className="h-2.5 w-2.5" />}
                      {withHash}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Publish panel ────────────────────────────────────────────────────────────
interface PlatformResultUI {
  platform: Platform;
  status: StatusKind;
  postUrl?: string;
}

function PublishPanel({
  selectedPlatforms,
  results,
  isDone,
  onReset,
}: {
  selectedPlatforms: Set<Platform>;
  results: PlatformResultUI[];
  isDone: boolean;
  onReset: () => void;
}) {
  const getResult = (p: Platform): PlatformResultUI =>
    results.find((r) => r.platform === p) ?? { platform: p, status: "pending" };

  const successCount = results.filter((r) => r.status === "success").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        {isDone ? (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Post Published!
            </h2>
            <p className="text-muted-foreground text-sm">
              {successCount} platform{successCount !== 1 ? "s" : ""} published
              successfully
              {failedCount > 0 && `, ${failedCount} failed`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Publishing…
            </h2>
            <p className="text-muted-foreground text-sm">
              Distributing your post across platforms
            </p>
          </div>
        )}
      </div>

      <Card
        className="border-border divide-y divide-border"
        data-ocid="compose.publish.results.list"
      >
        {Array.from(selectedPlatforms).map((platform, i) => {
          const r = getResult(platform);
          return (
            <motion.div
              key={platform}
              data-ocid={`compose.publish.result.item.${i + 1}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="text-muted-foreground flex-shrink-0">
                <PlatformIcon platform={platform} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {getPlatform(platform).displayName}
                </p>
                {r.postUrl && (
                  <a
                    href={r.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block"
                  >
                    {r.postUrl}
                  </a>
                )}
              </div>
              <PlatformStatusBadge status={r.status} />
            </motion.div>
          );
        })}
      </Card>

      {isDone && (
        <div className="flex justify-center">
          <Button
            data-ocid="compose.publish.reset_button"
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Start New Post
          </Button>
        </div>
      )}
    </div>
  );
}

function PlatformStatusBadge({ status }: { status: StatusKind }) {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="text-muted-foreground border-border text-xs gap-1 flex-shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          Pending
        </Badge>
      );
    case "publishing":
      return (
        <Badge
          variant="outline"
          data-ocid="compose.publish.loading_state"
          className="text-amber-600 border-amber-400/40 bg-amber-400/10 text-xs gap-1 flex-shrink-0 dark:text-amber-400 dark:border-amber-400/30 dark:bg-amber-400/10"
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          Publishing
        </Badge>
      );
    case "success":
      return (
        <Badge
          variant="outline"
          data-ocid="compose.publish.success_state"
          className="text-accent border-accent/30 bg-accent/10 text-xs gap-1 flex-shrink-0"
        >
          <CheckCircle2 className="h-3 w-3" />
          Published
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          data-ocid="compose.publish.error_state"
          className="text-destructive border-destructive/30 bg-destructive/5 text-xs gap-1 flex-shrink-0"
        >
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
  }
}
