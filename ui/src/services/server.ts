import { apiFetchJson } from "@/services/api";

function getServerIcon() {
  return "mdi-connection";
}

async function getServer() {
  return apiFetchJson("/api/server");
}

export { getServerIcon, getServer };
