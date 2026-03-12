import { apiFetchJson } from "@/services/api";

function getStoreIcon() {
  return "mdi-file-multiple";
}

async function getStore() {
  return apiFetchJson("/api/store");
}

export { getStoreIcon, getStore };
