/**
 * Get registry component icon.
 * @returns {string}
 */
function getRegistryIcon() {
  return "mdi-database-search";
}

/**
 * Get registry provider icon (acr, ecr...).
 * @param provider
 * @returns {string}
 */
function getRegistryProviderIcon(provider) {
  let icon = "si-linuxcontainers";
  switch (provider.split(".")[0]) {
    case "acr":
      icon = "si-microsoftazure";
      break;
    case "custom":
      icon = "si-opencontainersinitiative";
      break;
    case "ecr":
      icon = "si-amazonaws";
      break;
    case "forgejo":
      icon = "si-forgejo";
      break;
    case "gcr":
      icon = "si-googlecloud";
      break;
    case "ghcr":
      icon = "si-github";
      break;
    case "gitea":
      icon = "si-gitea";
      break;
    case "gitlab":
      icon = "si-gitlab";
      break;
    case "hub":
      icon = "si-docker";
      break;
    case "quay":
      icon = "si-redhat";
      break;
    case "lscr":
      icon = "si-linuxserver";
      break;
    case "trueforge":
      icon = "si-linuxcontainers";
      break;
  }
  return icon;
}

import { apiFetch, apiFetchJson } from "@/services/api";

/**
 * get all registries.
 * @returns {Promise<any>}
 */
async function getAllRegistries() {
  return apiFetchJson("/api/registries");
}

async function createRegistry(data: { type: string; name: string; configuration: Record<string, any> }) {
  return apiFetchJson("/api/registries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function updateRegistry(type: string, name: string, configuration: Record<string, any>) {
  return apiFetchJson(`/api/registries/${type}/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ configuration }),
  });
}

async function deleteRegistry(type: string, name: string) {
  return apiFetchJson(`/api/registries/${type}/${name}`, { method: "DELETE" });
}

export { getRegistryIcon, getRegistryProviderIcon, getAllRegistries, createRegistry, updateRegistry, deleteRegistry };
