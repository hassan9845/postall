import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Copy,
  LogOut,
  Plus,
  Trash2,
  User,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";
import { toast } from "sonner";
import { useAuth } from "../hooks/use-auth";
import { useBackendActor } from "../hooks/use-backend";
import { PLATFORMS, PLATFORM_MAP } from "../lib/platforms";
import type { Platform } from "../types";

/* ─── Local type (uses bigint id to match backend) ───────────────────── */
interface LocalAccount {
  id: bigint;
  platform: Platform;
  accountHandle: string;
  isActive: boolean;
  createdAt: bigint;
}

/* ─── Platform icon map ─────────────────────────────────────────────── */
const PLATFORM_ICONS: Record<Platform, React.ElementType> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
  linkedin: Briefcase,
  twitter: SiX,
};

/* ─── Add Account dialog ─────────────────────────────────────────────── */
interface AddAccountDialogProps {
  platform: Platform;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    accessToken: string;
    refreshToken: string;
    accountHandle: string;
  }) => void;
  isSubmitting: boolean;
}

function AddAccountDialog({
  platform,
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: AddAccountDialogProps) {
  const pm = PLATFORM_MAP[platform];
  const PIcon = PLATFORM_ICONS[platform];
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [handle, setHandle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken.trim() || !handle.trim()) {
      toast.error("Handle and access token are required.");
      return;
    }
    onSubmit({ accessToken, refreshToken, accountHandle: handle });
  }

  function handleClose() {
    setAccessToken("");
    setRefreshToken("");
    setHandle("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="max-w-md"
        data-ocid="settings.add_account_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-base">
            <PIcon className="h-4 w-4" style={{ color: pm.color }} />
            Connect {pm.displayName}
          </DialogTitle>
          <DialogDescription className="text-xs font-body text-muted-foreground">
            Enter your {pm.displayName} credentials to link the account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label
              htmlFor="handle"
              className="text-xs font-body font-medium text-foreground"
            >
              Account handle / username
            </Label>
            <Input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={`@your${pm.displayName.toLowerCase()}handle`}
              className="text-sm font-body"
              required
              data-ocid="settings.add_account_handle_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="access-token"
              className="text-xs font-body font-medium text-foreground"
            >
              Access token
            </Label>
            <Input
              id="access-token"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Paste your access token here"
              className="text-sm font-body font-mono"
              required
              data-ocid="settings.add_account_access_token_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="refresh-token"
              className="text-xs font-body font-medium text-foreground"
            >
              Refresh token{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="refresh-token"
              type="password"
              value={refreshToken}
              onChange={(e) => setRefreshToken(e.target.value)}
              placeholder="Paste your refresh token here"
              className="text-sm font-body font-mono"
              data-ocid="settings.add_account_refresh_token_input"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 font-body"
              onClick={handleClose}
              disabled={isSubmitting}
              data-ocid="settings.add_account_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex-1 font-body"
              disabled={isSubmitting}
              data-ocid="settings.add_account_submit_button"
            >
              {isSubmitting ? "Connecting…" : "Connect account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Account row ─────────────────────────────────────────────────────── */
interface AccountRowProps {
  account: LocalAccount;
  index: number;
  onRevoke: (id: bigint) => void;
  isRevoking: boolean;
}

function AccountRow({ account, index, onRevoke, isRevoking }: AccountRowProps) {
  const pm = PLATFORM_MAP[account.platform];
  const PIcon = PLATFORM_ICONS[account.platform];

  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg border ${
        account.isActive
          ? "border-border bg-card"
          : "border-border/40 bg-muted/20"
      }`}
      data-ocid={`settings.account.${index}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${pm.color}18` }}
        >
          <PIcon className="h-4 w-4" style={{ color: pm.color }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-body font-medium text-foreground leading-tight truncate">
              {account.accountHandle}
            </p>
            {account.isActive ? (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 bg-accent/10 text-accent border-accent/30 flex-shrink-0"
              >
                Active
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground flex-shrink-0"
              >
                Revoked
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-body">
            {pm.displayName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
        {account.isActive && <CheckCircle2 className="h-4 w-4 text-accent" />}
        {!account.isActive && (
          <WifiOff className="h-4 w-4 text-muted-foreground" />
        )}
        {account.isActive && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
            onClick={() => onRevoke(account.id)}
            disabled={isRevoking}
            aria-label={`Revoke ${account.accountHandle}`}
            data-ocid={`settings.revoke_button.${index}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ─── Platform section (one per platform) ───────────────────────────── */
interface PlatformSectionProps {
  platformId: Platform;
  accounts: LocalAccount[];
  onAdd: (platform: Platform) => void;
  onRevoke: (id: bigint) => void;
  revokingId: bigint | null;
  accountIndexOffset: number;
}

function PlatformSection({
  platformId,
  accounts,
  onAdd,
  onRevoke,
  revokingId,
  accountIndexOffset,
}: PlatformSectionProps) {
  const pm = PLATFORM_MAP[platformId];
  const PIcon = PLATFORM_ICONS[platformId];
  const activeAccounts = accounts.filter((a) => a.isActive);

  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      data-ocid={`settings.platform_section.${platformId}`}
    >
      {/* Platform header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-2.5">
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${pm.color}20` }}
          >
            <PIcon className="h-3.5 w-3.5" style={{ color: pm.color }} />
          </div>
          <span className="text-sm font-display font-semibold text-foreground">
            {pm.displayName}
          </span>
          {activeAccounts.length > 0 && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 bg-accent/10 text-accent border-accent/30"
            >
              {activeAccounts.length} connected
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 text-xs font-body"
          onClick={() => onAdd(platformId)}
          data-ocid={`settings.add_account_button.${platformId}`}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Account
        </Button>
      </div>

      {/* Accounts list or empty state */}
      <div className="px-4 py-3">
        {accounts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-5 gap-2 text-center"
            data-ocid={`settings.platform_empty.${platformId}`}
          >
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${pm.color}12` }}
            >
              <PIcon className="h-4 w-4" style={{ color: `${pm.color}99` }} />
            </div>
            <p className="text-xs text-muted-foreground font-body">
              No {pm.displayName} accounts connected yet.
            </p>
            <Button
              variant="link"
              size="sm"
              className="text-xs h-auto p-0 font-body text-primary"
              onClick={() => onAdd(platformId)}
              data-ocid={`settings.platform_empty_add_button.${platformId}`}
            >
              + Connect your first account
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {accounts.map((account, i) => (
              <AccountRow
                key={String(account.id)}
                account={account}
                index={accountIndexOffset + i + 1}
                onRevoke={onRevoke}
                isRevoking={revokingId === account.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Settings page ─────────────────────────────────────────────── */
export function SettingsPage() {
  const { principalText, logout } = useAuth();
  const { actor, isFetching: actorLoading } = useBackendActor();
  const queryClient = useQueryClient();

  const [addDialogPlatform, setAddDialogPlatform] = useState<Platform | null>(
    null,
  );
  const [revokingId, setRevokingId] = useState<bigint | null>(null);

  /* ── Queries ── */
  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isError: accountsError,
  } = useQuery<LocalAccount[]>({
    queryKey: ["socialAccounts"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.listSocialAccounts();
      return raw.map((a) => ({
        id: a.id,
        platform: a.platform as unknown as Platform,
        accountHandle: a.accountHandle,
        isActive: a.isActive,
        createdAt: a.createdAt,
      }));
    },
    enabled: !!actor && !actorLoading,
  });

  /* ── Mutations ── */
  const addMutation = useMutation({
    mutationFn: async ({
      platform,
      accessToken,
      refreshToken,
      accountHandle,
    }: {
      platform: Platform;
      accessToken: string;
      refreshToken: string;
      accountHandle: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addSocialAccount({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        platform: platform as any,
        accessToken,
        refreshToken,
        accountHandle,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialAccounts"] });
      toast.success("Account connected successfully!");
      setAddDialogPlatform(null);
    },
    onError: () => {
      toast.error("Failed to connect account. Please check your credentials.");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (accountId: bigint) => {
      if (!actor) throw new Error("Not connected");
      setRevokingId(accountId);
      return actor.revokeSocialAccount(accountId);
    },
    onSuccess: (ok) => {
      queryClient.invalidateQueries({ queryKey: ["socialAccounts"] });
      if (ok) {
        toast.success("Account disconnected.");
      } else {
        toast.error("Could not revoke account.");
      }
    },
    onError: () => {
      toast.error("Failed to revoke account.");
    },
    onSettled: () => {
      setRevokingId(null);
    },
  });

  /* ── Group accounts by platform ── */
  const byPlatform = Object.fromEntries(
    PLATFORMS.map((p) => [p.id, accounts.filter((a) => a.platform === p.id)]),
  ) as Record<Platform, LocalAccount[]>;

  /* ── Index offsets for deterministic data-ocid ── */
  const platformOrder: Platform[] = [
    "instagram",
    "facebook",
    "tiktok",
    "linkedin",
    "twitter",
  ];
  const indexOffsets: Record<Platform, number> = {} as Record<Platform, number>;
  let running = 0;
  for (const pid of platformOrder) {
    indexOffsets[pid] = running;
    running += (byPlatform[pid] ?? []).length;
  }

  function copyPrincipal() {
    if (!principalText) return;
    navigator.clipboard.writeText(principalText).then(() => {
      toast.success("Principal ID copied!");
    });
  }

  return (
    <div className="flex-1 bg-background py-8" data-ocid="settings.page">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-body">
            Manage your Internet Identity and connected social platforms.
          </p>
        </div>

        {/* ── Account info ── */}
        <Card
          className="border-border shadow-subtle"
          data-ocid="settings.account_card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Account
            </CardTitle>
            <CardDescription className="text-xs font-body">
              Your Internet Identity session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wide font-body font-semibold text-muted-foreground mb-1">
                    Internet Identity Principal
                  </p>
                  <p
                    className="text-xs font-mono text-foreground break-all leading-relaxed"
                    data-ocid="settings.principal_text"
                  >
                    {principalText ?? "—"}
                  </p>
                </div>
                {principalText && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={copyPrincipal}
                    aria-label="Copy principal ID"
                    data-ocid="settings.copy_principal_button"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body font-medium text-foreground">
                  Sign out
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  End your current Internet Identity session.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 font-body"
                onClick={() => {
                  logout();
                  toast.success("Signed out successfully.");
                }}
                data-ocid="settings.logout_button"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Connect Your Channels ── */}
        <div data-ocid="settings.platforms_section">
          <div className="mb-4">
            <h2 className="text-base font-display font-semibold text-foreground">
              Connect Your Channels
            </h2>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Link your social accounts to manage and publish content
              seamlessly.
            </p>
          </div>

          {/* Professional flow banner */}
          <div className="flex items-center gap-2 px-4 py-2.5 mb-4 rounded-lg border border-primary/20 bg-primary/5">
            <span className="text-xs font-body text-primary/80 leading-snug">
              <span className="font-semibold text-primary">
                Connect accounts
              </span>
              <span className="mx-1.5 text-muted-foreground">→</span>
              <span className="font-semibold text-primary">Create post</span>
              <span className="mx-1.5 text-muted-foreground">→</span>
              <span className="font-semibold text-primary">
                Schedule or publish instantly.
              </span>
            </span>
          </div>

          {/* Loading skeleton */}
          {accountsLoading && (
            <div
              className="space-y-3"
              data-ocid="settings.accounts_loading_state"
            >
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          )}

          {/* Error state */}
          {accountsError && !accountsLoading && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive"
              data-ocid="settings.accounts_error_state"
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm font-body">
                Failed to load connected accounts. Please refresh the page.
              </p>
            </div>
          )}

          {/* Platform sections */}
          {!accountsLoading && !accountsError && (
            <div className="space-y-3">
              {platformOrder.map((pid) => (
                <PlatformSection
                  key={pid}
                  platformId={pid}
                  accounts={byPlatform[pid] ?? []}
                  onAdd={setAddDialogPlatform}
                  onRevoke={(id) => revokeMutation.mutate(id)}
                  revokingId={revokingId}
                  accountIndexOffset={indexOffsets[pid]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary badge */}
        {!accountsLoading && accounts.filter((a) => a.isActive).length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-accent/30 bg-accent/10">
            <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
            <p className="text-xs font-body text-accent">
              <span className="font-semibold">
                {accounts.filter((a) => a.isActive).length} account
                {accounts.filter((a) => a.isActive).length !== 1 ? "s" : ""}
              </span>{" "}
              ready to publish across{" "}
              {
                new Set(
                  accounts.filter((a) => a.isActive).map((a) => a.platform),
                ).size
              }{" "}
              platform
              {new Set(
                accounts.filter((a) => a.isActive).map((a) => a.platform),
              ).size !== 1
                ? "s"
                : ""}
              .
            </p>
          </div>
        )}
      </div>

      {/* Add Account Dialog */}
      {addDialogPlatform && (
        <AddAccountDialog
          platform={addDialogPlatform}
          open={!!addDialogPlatform}
          onClose={() => setAddDialogPlatform(null)}
          onSubmit={({ accessToken, refreshToken, accountHandle }) =>
            addMutation.mutate({
              platform: addDialogPlatform,
              accessToken,
              refreshToken,
              accountHandle,
            })
          }
          isSubmitting={addMutation.isPending}
        />
      )}
    </div>
  );
}
