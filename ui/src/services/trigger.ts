import { apiFetch, apiFetchJson } from "@/services/api";

function getTriggerIcon() {
  return "mdi-bell-ring";
}

async function getAllTriggers() {
  return apiFetchJson("/api/triggers");
}

async function runTrigger({ triggerType, triggerName, container }) {
  return apiFetchJson(`/api/triggers/${triggerType}/${triggerName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(container),
  });
}

async function createTrigger(data: { type: string; name: string; configuration: Record<string, any> }) {
  return apiFetchJson("/api/triggers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function updateTrigger(type: string, name: string, configuration: Record<string, any>) {
  return apiFetchJson(`/api/triggers/${type}/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ configuration }),
  });
}

async function deleteTrigger(type: string, name: string) {
  return apiFetchJson(`/api/triggers/${type}/${name}`, { method: "DELETE" });
}

export { getTriggerIcon, getAllTriggers, runTrigger, createTrigger, updateTrigger, deleteTrigger };
