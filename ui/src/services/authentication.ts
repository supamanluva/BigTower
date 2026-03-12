import { apiFetch, apiFetchJson } from "@/services/api";

function getAuthenticationIcon() {
  return "mdi-lock";
}

async function getAllAuthentications() {
  return apiFetchJson("/api/authentications");
}

async function createAuthentication(data: { type: string; name: string; configuration: Record<string, any> }) {
  return apiFetchJson("/api/authentications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function updateAuthentication(type: string, name: string, configuration: Record<string, any>) {
  return apiFetchJson(`/api/authentications/${type}/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ configuration }),
  });
}

async function deleteAuthentication(type: string, name: string) {
  return apiFetchJson(`/api/authentications/${type}/${name}`, { method: "DELETE" });
}

export { getAuthenticationIcon, getAllAuthentications, createAuthentication, updateAuthentication, deleteAuthentication };
