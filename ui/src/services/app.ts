import { apiFetchJson } from "@/services/api";

async function getAppInfos() {
  return apiFetchJson("/api/app");
}

export { getAppInfos };
