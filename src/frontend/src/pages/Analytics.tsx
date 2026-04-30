import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  BarChart3,
  Briefcase,
  Info,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  iconClass: string;
}

interface PlatformRow {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  followers: string;
  likes: number;
  shares: number;
  reach: string;
}

// ─── Static data ───────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  {
    label: "Total Posts",
    value: "24",
    icon: BarChart3,
    trend: "+4 this week",
    iconClass: "text-primary bg-primary/10",
  },
  {
    label: "Total Reach",
    value: "15.2K",
    icon: TrendingUp,
    trend: "+12% vs last month",
    iconClass: "text-accent bg-accent/10",
  },
  {
    label: "Total Engagement",
    value: "892",
    icon: Activity,
    trend: "+8% vs last month",
    iconClass: "text-chart-1 bg-chart-1/10",
  },
  {
    label: "Active Platforms",
    value: "5",
    icon: Share2,
    trend: "All connected",
    iconClass: "text-chart-3 bg-chart-3/10",
  },
];

const PLATFORM_ROWS: PlatformRow[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: SiInstagram,
    color: "#E1306C",
    followers: "12.4K",
    likes: 341,
    shares: 45,
    reach: "4.2K",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: SiFacebook,
    color: "#1877F2",
    followers: "8.9K",
    likes: 187,
    shares: 23,
    reach: "2.8K",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "#010101",
    followers: "22.1K",
    likes: 523,
    shares: 89,
    reach: "6.1K",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Briefcase,
    color: "#0A66C2",
    followers: "5.6K",
    likes: 98,
    shares: 12,
    reach: "1.3K",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: SiX,
    color: "#000000",
    followers: "9.3K",
    likes: 203,
    shares: 37,
    reach: "2.8K",
  },
];

// ─── Stat card ─────────────────────────────────────────────────────────────────

function StatCardItem({
  card,
  index,
}: {
  card: StatCard;
  index: number;
}) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
    >
      <Card
        className="border-border shadow-subtle hover:shadow-elevated transition-shadow duration-200"
        data-ocid={`analytics.stat_card.${index + 1}`}
      >
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p className="text-3xl font-display font-bold text-foreground tracking-tight">
                {card.value}
              </p>
              <p className="text-xs font-body text-muted-foreground mt-1.5">
                {card.trend}
              </p>
            </div>
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Platform row ──────────────────────────────────────────────────────────────

function PlatformTableRow({
  row,
  index,
}: {
  row: PlatformRow;
  index: number;
}) {
  const Icon = row.icon;
  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: 0.15 + index * 0.07 }}
      className="border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors duration-150"
      data-ocid={`analytics.platform_row.${index + 1}`}
    >
      {/* Platform */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${row.color}18` }}
          >
            <Icon className="h-4 w-4" style={{ color: row.color }} />
          </div>
          <span className="text-sm font-body font-medium text-foreground">
            {row.name}
          </span>
        </div>
      </td>
      {/* Followers */}
      <td className="py-3.5 px-4 text-right">
        <span className="text-sm font-body font-semibold text-foreground">
          {row.followers}
        </span>
      </td>
      {/* Likes */}
      <td className="py-3.5 px-4 text-right hidden sm:table-cell">
        <span className="text-sm font-body text-foreground">
          {row.likes.toLocaleString()}
        </span>
      </td>
      {/* Shares */}
      <td className="py-3.5 px-4 text-right hidden md:table-cell">
        <span className="text-sm font-body text-foreground">{row.shares}</span>
      </td>
      {/* Reach */}
      <td className="py-3.5 px-4 text-right">
        <span className="text-sm font-body font-semibold text-primary">
          {row.reach}
        </span>
      </td>
    </motion.tr>
  );
}

// ─── Analytics page ────────────────────────────────────────────────────────────

export function AnalyticsPage() {
  return (
    <div className="flex-1 bg-background py-6" data-ocid="analytics.page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-display font-semibold text-foreground">
                Performance Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-body">
                Track engagement, reach, and growth across all your connected
                platforms.
              </p>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 text-xs bg-muted/60 text-muted-foreground border-border/80 h-7 px-3"
              data-ocid="analytics.sample_data_badge"
            >
              <Info className="h-3.5 w-3.5 flex-shrink-0" />
              Sample data — connect your accounts to see real insights
            </Badge>
          </div>
        </div>

        {/* Stat cards grid */}
        <section className="mb-8" data-ocid="analytics.stats_section">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map((card, i) => (
              <StatCardItem key={card.label} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* Platform breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          data-ocid="analytics.platform_section"
        >
          <Card className="border-border shadow-subtle overflow-hidden">
            <CardHeader className="pb-0 pt-5 px-4 sm:px-6 bg-muted/30 border-b border-border/60">
              <div className="flex items-center justify-between pb-4">
                <CardTitle className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Platform Breakdown
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="text-xs h-5 px-2 font-body"
                >
                  5 platforms
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table
                  className="w-full"
                  aria-label="Platform performance breakdown"
                  data-ocid="analytics.platform_table"
                >
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      <th className="py-2.5 px-4 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">
                        Platform
                      </th>
                      <th className="py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">
                        Followers
                      </th>
                      <th className="py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                        Likes
                      </th>
                      <th className="py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                        Shares
                      </th>
                      <th className="py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">
                        Reach
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLATFORM_ROWS.map((row, i) => (
                      <PlatformTableRow key={row.id} row={row} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table footer totals */}
              <div className="border-t border-border/60 bg-muted/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-xs font-body text-muted-foreground">
                  Aggregated across all 5 connected platforms
                </span>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-body">
                      Total Likes
                    </p>
                    <p className="text-sm font-display font-semibold text-foreground">
                      1,352
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-body">
                      Total Shares
                    </p>
                    <p className="text-sm font-display font-semibold text-foreground">
                      206
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-body">
                      Total Reach
                    </p>
                    <p className="text-sm font-display font-semibold text-primary">
                      17.2K
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
