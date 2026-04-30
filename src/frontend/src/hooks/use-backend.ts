import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

export function useBackendActor() {
  return useActor(createActor);
}
