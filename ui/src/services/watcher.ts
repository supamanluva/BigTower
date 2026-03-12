import { apiFetch, apiFetchJson } from "@/services/api";

function getWatcherIcon() {
  return "mdi-update";
}

async function getAllWatchers() {
  return apiFetchJson("/api/watchers");
}

async function createWatcher(data: { type: string; name: string; configuration: Record<string, any> }) {
  return apiFetchJson("/api/watchers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function updateWatcher(type: string, name: string, configuration: Record<string, any>) {
  return apiFetchJson(`/api/watchers/${type}/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ configuration }),
  });
}

async function deleteWatcher(type: string, name: string) {
  return apiFetchJson(`/api/watchers/${type}/${name}`, { method: "DELETE" });
}

export { getWatcherIcon, getAllWatchers, createWatcher, updateWatcher, deleteWatcher };
