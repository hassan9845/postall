import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronDown,
  History,
  LogOut,
  Moon,
  Send,
  Settings,
  Sun,
  User,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../hooks/use-auth";

const NAV_LINKS = [
  { to: "/compose", label: "Compose", icon: Send },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      data-ocid="header.theme_toggle"
      className="h-9 w-9 rounded-md"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

function UserMenu() {
  const { isLoggedIn, principalText, login, logout } = useAuth();

  if (!isLoggedIn) {
    return (
      <Button size="sm" onClick={login} data-ocid="header.login_button">
        Sign In
      </Button>
    );
  }

  const shortPrincipal = principalText
    ? `${principalText.slice(0, 5)}…${principalText.slice(-4)}`
    : "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9"
          data-ocid="header.user_menu_toggle"
        >
          <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="hidden sm:inline text-xs font-mono text-muted-foreground max-w-[80px] truncate">
            {shortPrincipal}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52"
        data-ocid="header.user_dropdown"
      >
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground font-body">
            Principal ID
          </p>
          <p className="text-xs font-mono text-foreground truncate mt-0.5">
            {principalText}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive gap-2 cursor-pointer"
          data-ocid="header.logout_button"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              to="/compose"
              className="flex items-center gap-2.5 group"
              data-ocid="header.logo_link"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-xs group-hover:bg-primary/90 transition-colors duration-200">
                <Zap className="h-4 w-4 text-primary-foreground fill-current" />
              </div>
              <span className="font-display font-semibold text-foreground text-lg tracking-tight">
                PostAll
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 hidden sm:flex"
              >
                Beta
              </Badge>
            </Link>

            {/* Nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                const isActive =
                  currentPath === to || currentPath.startsWith(`${to}/`);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-body transition-colors duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    data-ocid={`header.nav_${label.toLowerCase() as string}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-border/60 bg-card">
          <div className="flex items-center justify-around px-2 py-1">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => {
              const isActive =
                currentPath === to || currentPath.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-md text-xs font-body transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  data-ocid={`header.mobile_nav_${label.toLowerCase()}`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "stroke-[2.5]" : ""}`}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border/60 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
