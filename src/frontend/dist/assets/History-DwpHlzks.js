import { c as createLucideIcon, r as reactExports, e as useDirection, f as useControllableState, j as jsxRuntimeExports, P as Primitive, g as useId, R as Root, I as Item, h as composeEventHandlers, i as createRovingFocusGroupScope, k as createContextScope, l as Presence, a as cn, m as useSearch, n as useNavigate, o as Link, B as Button, S as Send, p as Skeleton, L as LoaderCircle, d as Badge, C as ChevronDown } from "./index-_EXHJPko.js";
import { C as Card, a as CardContent, S as SiX, B as Briefcase, d as SiTiktok, e as SiFacebook, f as SiInstagram } from "./index-CZ4rFF0r.js";
import { u as useBackendActor, a as useQuery, C as CircleCheck, g as getPlatform } from "./platforms-sm_y_LXH.js";
import { m as motion } from "./proxy-s0jopiL6.js";
import { C as CalendarClock, b as CircleX, a as Clock, A as AnimatePresence } from "./index-D09tekC7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode);
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
const PLATFORM_ICONS = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
  linkedin: Briefcase,
  twitter: SiX
};
function getStatusKind(status) {
  return status.__kind__;
}
const STATUS_CONFIG = {
  pending: {
    label: "Scheduled",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    dotClass: "bg-primary",
    icon: CalendarClock
  },
  publishing: {
    label: "Publishing",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    dotClass: "bg-primary",
    icon: LoaderCircle
  },
  success: {
    label: "Published",
    badgeClass: "bg-accent/10 text-accent-foreground border-accent/20",
    dotClass: "bg-accent",
    icon: CircleCheck
  },
  failed: {
    label: "Failed",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
    dotClass: "bg-destructive",
    icon: CircleX
  }
};
function formatRelativeTime(ts) {
  const diff = Date.now() - Number(ts);
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  if (diff < 6048e5) return `${Math.floor(diff / 864e5)}d ago`;
  return new Date(Number(ts)).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatDateTime(ts) {
  return new Date(Number(ts)).toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function PostCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32 mt-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 flex-shrink-0 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-px w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" }) })
  ] }) });
}
function PlatformResultRow({
  platform,
  status,
  postUrl,
  publishedAt
}) {
  const pm = getPlatform(platform);
  const PIcon = PLATFORM_ICONS[platform];
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2.5 px-3 rounded-md bg-muted/40 border border-border/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PIcon, { className: "h-4 w-4 flex-shrink-0", style: { color: pm.color } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-medium text-foreground", children: pm.displayName })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      publishedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono hidden sm:block", children: formatDateTime(publishedAt) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: `gap-1 text-xs h-6 ${cfg.badgeClass}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusIcon,
              {
                className: `h-3 w-3 ${status === "publishing" ? "animate-spin" : ""}`
              }
            ),
            cfg.label
          ]
        }
      ),
      postUrl && status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: postUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200 font-body",
          "aria-label": `View ${pm.displayName} post`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "View" })
          ]
        }
      )
    ] })
  ] });
}
function ScheduledBanner({ createdAt }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-md bg-primary/8 border border-primary/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-3.5 w-3.5 text-primary flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-body text-primary", children: [
      "Queued ",
      formatRelativeTime(createdAt),
      " — awaiting publish"
    ] })
  ] });
}
function PostCard({ post, index }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const overallKind = getStatusKind(post.publishStatus);
  const cfg = STATUS_CONFIG[overallKind];
  const StatusIcon = cfg.icon;
  const hasPlatformResults = post.platformResults.length > 0;
  const isScheduled = overallKind === "pending" || overallKind === "publishing";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border shadow-subtle hover:shadow-elevated transition-shadow duration-200",
      "data-ocid": `history.item.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-foreground line-clamp-2 leading-relaxed", children: post.originalCaption }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5 font-mono truncate", children: post.mediaFilename })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: `flex-shrink-0 gap-1 text-xs h-6 ${cfg.badgeClass}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatusIcon,
                  {
                    className: `h-3 w-3 ${overallKind === "publishing" ? "animate-spin" : ""}`
                  }
                ),
                cfg.label
              ]
            }
          )
        ] }),
        isScheduled && /* @__PURE__ */ jsxRuntimeExports.jsx(ScheduledBanner, { createdAt: post.createdAt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 flex-wrap", children: post.selectedPlatforms.map((platform) => {
          const pm = getPlatform(platform);
          const result = post.platformResults.find(
            (r) => r.platform === platform
          );
          const PIcon = PLATFORM_ICONS[platform];
          const pStatus = result ? getStatusKind(result.status) : "pending";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PIcon, { className: "h-3.5 w-3.5", style: { color: pm.color } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: pm.displayName }),
            pStatus === "success" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-accent" }),
            pStatus === "failed" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 text-destructive" }),
            (pStatus === "pending" || pStatus === "publishing") && /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-muted-foreground" })
          ] }, platform);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: formatRelativeTime(post.createdAt) }),
          hasPlatformResults && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200 font-body",
              "data-ocid": `history.expand_button.${index}`,
              "aria-expanded": expanded,
              "aria-label": expanded ? "Collapse platform details" : "Expand platform details",
              children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Less" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Details" })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: expanded && hasPlatformResults && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.22, ease: "easeInOut" },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 space-y-2 border-t border-border/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body text-muted-foreground pt-2 pb-0.5 uppercase tracking-wide font-medium", children: "Platform Results" }),
              post.platformResults.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                PlatformResultRow,
                {
                  platform: r.platform,
                  status: getStatusKind(r.status),
                  postUrl: r.postUrl ?? void 0,
                  publishedAt: r.publishedAt ?? void 0
                },
                r.platform
              ))
            ] })
          },
          "details"
        ) })
      ] })
    }
  );
}
const EMPTY_STATE_COPY = {
  all: {
    heading: "No posts yet",
    body: "Create your first post and share it across all your social platforms in one click."
  },
  scheduled: {
    heading: "No scheduled posts",
    body: "Posts waiting to be published will appear here."
  },
  published: {
    heading: "No published posts",
    body: "Successfully published posts will appear here."
  },
  failed: {
    heading: "No failed posts",
    body: "Any posts that encountered errors will appear here."
  }
};
function EmptyState({ filter }) {
  const copy = EMPTY_STATE_COPY[filter];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: "flex flex-col items-center justify-center py-20 px-4 text-center",
      "data-ocid": "history.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5", children: filter === "scheduled" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-7 w-7 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-lg mb-2", children: copy.heading }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body max-w-xs leading-relaxed mb-6", children: copy.body }),
        filter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/compose", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "gap-2",
            "data-ocid": "history.empty_compose_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
              "Create First Post"
            ]
          }
        ) })
      ]
    }
  );
}
const VALID_TABS = /* @__PURE__ */ new Set([
  "all",
  "scheduled",
  "published",
  "failed"
]);
function resolveTab(raw) {
  if (raw && VALID_TABS.has(raw)) return raw;
  return "all";
}
function HistoryPage() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const activeFilter = resolveTab(search.tab);
  const { actor, isFetching: actorLoading } = useBackendActor();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["listPosts"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listPosts();
      return [...result].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt)
      );
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 1e4
  });
  function setFilter(tab) {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: tab === "all" ? {} : { tab },
      replace: true
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
    (p) => getStatusKind(p.publishStatus) === "success"
  ).length;
  const failedCount = posts.filter(
    (p) => getStatusKind(p.publishStatus) === "failed"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-background py-6", "data-ocid": "history.page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold text-foreground", children: "Post History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 font-body", children: "All your published and scheduled posts across platforms." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/compose", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-2 flex-shrink-0",
          "data-ocid": "history.compose_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
            "New Post"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        value: activeFilter,
        onValueChange: (v) => setFilter(v),
        className: "mb-5",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-9 bg-muted/60 border border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "all",
              className: "text-xs h-7 px-4 data-[state=active]:bg-card",
              "data-ocid": "history.filter.tab.all",
              children: [
                "All",
                posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-muted-foreground", children: posts.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "scheduled",
              className: "text-xs h-7 px-4 data-[state=active]:bg-card",
              "data-ocid": "history.filter.tab.scheduled",
              children: [
                "Scheduled",
                scheduledCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-primary font-medium", children: scheduledCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "published",
              className: "text-xs h-7 px-4 data-[state=active]:bg-card",
              "data-ocid": "history.filter.tab.published",
              children: [
                "Published",
                publishedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-muted-foreground", children: publishedCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "failed",
              className: "text-xs h-7 px-4 data-[state=active]:bg-card",
              "data-ocid": "history.filter.tab.failed",
              children: [
                "Failed",
                failedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-destructive font-medium", children: failedCount })
              ]
            }
          )
        ] })
      }
    ),
    isLoading || actorLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "history.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PostCardSkeleton, {}, i)) }) : filteredPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { filter: activeFilter }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
        className: "space-y-3",
        "data-ocid": "history.list",
        children: filteredPosts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.2, delay: idx * 0.05 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: idx + 1 })
          },
          post.id.toString()
        ))
      },
      activeFilter
    )
  ] }) });
}
export {
  HistoryPage
};
