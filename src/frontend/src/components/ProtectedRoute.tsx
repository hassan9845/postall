import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div
        className="flex flex-1 items-center justify-center min-h-[60vh]"
        data-ocid="auth.loading_state"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-body">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="flex flex-1 items-center justify-center min-h-[60vh]"
        data-ocid="auth.gate"
      >
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">
            Sign in to continue
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            PostAll uses Internet Identity for secure, passwordless
            authentication.
          </p>
          <Button
            onClick={login}
            className="w-full"
            data-ocid="auth.login_button"
          >
            Sign in with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
