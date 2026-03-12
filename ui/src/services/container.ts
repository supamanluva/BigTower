import { apiFetch, apiFetchJson } from "@/services/api";

function getContainerIcon() {
  return "mdi-docker";
}

async function getAllContainers() {
  return apiFetchJson("/api/containers");
}

async function refreshAllContainers() {
  return apiFetchJson("/api/containers/watch", { method: "POST" });
}

async function refreshContainer(containerId) {
  const response = await apiFetch(`/api/containers/${containerId}/watch`, { method: "POST" }).catch((e) => {
    if (e.message?.includes("404")) return undefined;
    throw e;
  });
  if (!response) return undefined;
  return response.json();
}

async function deleteContainer(containerId) {
  return apiFetch(`/api/containers/${containerId}`, { method: "DELETE" });
}

async function getContainerTriggers(containerId) {
  return apiFetchJson(`/api/containers/${containerId}/triggers`);
}

async function runTrigger({ containerId, triggerType, triggerName }) {
  return apiFetchJson(
    `/api/containers/${containerId}/triggers/${triggerType}/${triggerName}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );
}

async function updateContainerSettings(containerId: string, settings: { autoUpdate?: boolean; cron?: string | null }) {
  return apiFetchJson(`/api/containers/${encodeURIComponent(containerId)}/settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

export {
  getContainerIcon,
  getAllContainers,
  refreshAllContainers,
  refreshContainer,
  deleteContainer,
  getContainerTriggers,
  runTrigger,
  updateContainerSettings,
};
