import { c as createLucideIcon, j as jsxRuntimeExports, d as Badge, aI as ChartColumn } from "./index-_EXHJPko.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent, f as SiInstagram, e as SiFacebook, d as SiTiktok, B as Briefcase, S as SiX } from "./index-CZ4rFF0r.js";
import { m as motion } from "./proxy-s0jopiL6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
const STAT_CARDS = [
  {
    label: "Total Posts",
    value: "24",
    icon: ChartColumn,
    trend: "+4 this week",
    iconClass: "text-primary bg-primary/10"
  },
  {
    label: "Total Reach",
    value: "15.2K",
    icon: TrendingUp,
    trend: "+12% vs last month",
    iconClass: "text-accent bg-accent/10"
  },
  {
    label: "Total Engagement",
    value: "892",
    icon: Activity,
    trend: "+8% vs last month",
    iconClass: "text-chart-1 bg-chart-1/10"
  },
  {
    label: "Active Platforms",
    value: "5",
    icon: Share2,
    trend: "All connected",
    iconClass: "text-chart-3 bg-chart-3/10"
  }
];
const PLATFORM_ROWS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: SiInstagram,
    color: "#E1306C",
    followers: "12.4K",
    likes: 341,
    shares: 45,
    reach: "4.2K"
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: SiFacebook,
    color: "#1877F2",
    followers: "8.9K",
    likes: 187,
    shares: 23,
    reach: "2.8K"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "#010101",
    followers: "22.1K",
    likes: 523,
    shares: 89,
    reach: "6.1K"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Briefcase,
    color: "#0A66C2",
    followers: "5.6K",
    likes: 98,
    shares: 12,
    reach: "1.3K"
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: SiX,
    color: "#000000",
    followers: "9.3K",
    likes: 203,
    shares: 37,
    reach: "2.8K"
  }
];
function StatCardItem({
  card,
  index
}) {
  const Icon = card.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.07 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border shadow-subtle hover:shadow-elevated transition-shadow duration-200",
          "data-ocid": `analytics.stat_card.${index + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground uppercase tracking-wide mb-1", children: card.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-display font-bold text-foreground tracking-tight", children: card.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground mt-1.5", children: card.trend })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconClass}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
              }
            )
          ] }) })
        }
      )
    }
  );
}
function PlatformTableRow({
  row,
  index
}) {
  const Icon = row.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.tr,
    {
      initial: { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.25, delay: 0.15 + index * 0.07 },
      className: "border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors duration-150",
      "data-ocid": `analytics.platform_row.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
              style: { background: `${row.color}18` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", style: { color: row.color } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-medium text-foreground", children: row.name })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-semibold text-foreground", children: row.followers }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-right hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: row.likes.toLocaleString() }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-right hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: row.shares }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-semibold text-primary", children: row.reach }) })
      ]
    }
  );
}
function AnalyticsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-background py-6", "data-ocid": "analytics.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold text-foreground", children: "Performance Insights" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 font-body", children: "Track engagement, reach, and growth across all your connected platforms." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "flex items-center gap-1.5 text-xs bg-muted/60 text-muted-foreground border-border/80 h-7 px-3",
          "data-ocid": "analytics.sample_data_badge",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5 flex-shrink-0" }),
            "Sample data — connect your accounts to see real insights"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mb-8", "data-ocid": "analytics.stats_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: STAT_CARDS.map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardItem, { card, index: i }, card.label)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.section,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: 0.2 },
        "data-ocid": "analytics.platform_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-subtle overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-0 pt-5 px-4 sm:px-6 bg-muted/30 border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-display font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
              "Platform Breakdown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs h-5 px-2 font-body",
                children: "5 platforms"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                className: "w-full",
                "aria-label": "Platform performance breakdown",
                "data-ocid": "analytics.platform_table",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 bg-muted/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-left text-xs font-body font-medium text-muted-foreground uppercase tracking-wide", children: "Platform" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide", children: "Followers" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Likes" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Shares" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 text-right text-xs font-body font-medium text-muted-foreground uppercase tracking-wide", children: "Reach" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: PLATFORM_ROWS.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformTableRow, { row, index: i }, row.id)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 bg-muted/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-muted-foreground", children: "Aggregated across all 5 connected platforms" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-body", children: "Total Likes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "1,352" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden md:block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-body", children: "Total Shares" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "206" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-body", children: "Total Reach" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-primary", children: "17.2K" })
                ] })
              ] })
            ] })
          ] })
        ] })
      }
    )
  ] }) });
}
export {
  AnalyticsPage
};
