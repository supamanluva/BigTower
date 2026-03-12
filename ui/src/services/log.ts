import { apiFetchJson } from "@/services/api";

function getLogIcon() {
  return "mdi-bug";
}

async function getLog() {
  return apiFetchJson("/api/log");
}

export { getLogIcon, getLog };
