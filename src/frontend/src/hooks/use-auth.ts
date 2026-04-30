import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    loginStatus,
    login,
    clear,
    isAuthenticated,
    isInitializing,
  } = useInternetIdentity();

  const principalText =
    isAuthenticated && identity ? identity.getPrincipal().toText() : null;

  return {
    identity,
    isLoggedIn: isAuthenticated,
    isLoading: isInitializing,
    loginStatus,
    principalText,
    login,
    logout: clear,
  };
}
