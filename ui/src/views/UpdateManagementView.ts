import { defineComponent } from "vue";
import {
  getAllContainers,
  updateContainerSettings,
  refreshContainer,
  getContainerTriggers,
  runTrigger,
} from "@/services/container";

interface ContainerRow {
  id: string;
  name: string;
  displayName: string;
  status: string;
  watcher: string;
  image: any;
  autoUpdate: boolean;
  cron: string | null;
  updateAvailable: boolean;
  updateKind: any;
  result: any;
  triggerInclude: string | undefined;
  triggerExclude: string | undefined;
  // UI state
  saving: boolean;
  editingCron: boolean;
  cronDraft: string;
}

const CRON_PRESETS = [
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Every 30 minutes", value: "*/30 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every 12 hours", value: "0 */12 * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Daily at 3 AM", value: "0 3 * * *" },
  { label: "Weekly (Sunday midnight)", value: "0 0 * * 0" },
  { label: "Custom", value: "__custom__" },
];

export default defineComponent({
  data() {
    return {
      containers: [] as ContainerRow[],
      loading: true,
      searchQuery: "",
      filterMode: "all" as "all" | "auto-update" | "custom-schedule" | "updates-available",
      settingsDialog: false,
      selectedContainer: null as ContainerRow | null,
      cronPresets: CRON_PRESETS,
      selectedPreset: "",
      customCronInput: "",
      dialogAutoUpdate: false,
      dialogTriggers: [] as any[],
      loadingTriggers: false,
      triggerRunning: "" as string,
    };
  },

  computed: {
    filteredContainers(): ContainerRow[] {
      const query = (this.searchQuery || "").toLowerCase().trim();
      return this.containers
        .filter((c) =>
          query
            ? c.displayName.toLowerCase().includes(query) ||
              c.name.toLowerCase().includes(query) ||
              c.image?.name?.toLowerCase().includes(query)
            : true,
        )
        .filter((c) => {
          switch (this.filterMode) {
            case "auto-update":
              return c.autoUpdate;
            case "custom-schedule":
              return !!c.cron;
            case "updates-available":
              return c.updateAvailable;
            default:
              return true;
          }
        })
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    },
    autoUpdateCount(): number {
      return this.containers.filter((c) => c.autoUpdate).length;
    },
    customScheduleCount(): number {
      return this.containers.filter((c) => !!c.cron).length;
    },
    updatesAvailableCount(): number {
      return this.containers.filter((c) => c.updateAvailable).length;
    },
  },

  methods: {
    async loadContainers() {
      this.loading = true;
      try {
        const raw = await getAllContainers();
        this.containers = raw.map((c: any) => ({
          id: c.id,
          name: c.name,
          displayName: c.displayName || c.name,
          status: c.status,
          watcher: c.watcher,
          image: c.image,
          autoUpdate: c.autoUpdate || false,
          cron: c.cron || null,
          updateAvailable: c.updateAvailable || false,
          updateKind: c.updateKind || { kind: "unknown" },
          result: c.result,
          triggerInclude: c.triggerInclude,
          triggerExclude: c.triggerExclude,
          saving: false,
          editingCron: false,
          cronDraft: c.cron || "",
        }));
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Failed to load containers: ${e.message}`, "error");
      } finally {
        this.loading = false;
      }
    },

    async toggleAutoUpdate(container: ContainerRow) {
      container.saving = true;
      try {
        const newValue = !container.autoUpdate;
        await updateContainerSettings(container.id, { autoUpdate: newValue });
        container.autoUpdate = newValue;
        (this as any).$eventBus.emit(
          "notify",
          `Auto-update ${newValue ? "enabled" : "disabled"} for ${container.displayName}`,
        );
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        container.saving = false;
      }
    },

    async saveCron(container: ContainerRow) {
      container.saving = true;
      try {
        const cronValue = container.cronDraft.trim() || null;
        await updateContainerSettings(container.id, { cron: cronValue });
        container.cron = cronValue;
        container.editingCron = false;
        (this as any).$eventBus.emit(
          "notify",
          cronValue
            ? `Schedule set to "${cronValue}" for ${container.displayName}`
            : `Custom schedule removed for ${container.displayName}`,
        );
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        container.saving = false;
      }
    },

    async removeCron(container: ContainerRow) {
      container.saving = true;
      try {
        await updateContainerSettings(container.id, { cron: null });
        container.cron = null;
        container.cronDraft = "";
        (this as any).$eventBus.emit("notify", `Custom schedule removed for ${container.displayName}`);
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        container.saving = false;
      }
    },

    openSettings(container: ContainerRow) {
      this.selectedContainer = container;
      this.dialogAutoUpdate = container.autoUpdate;
      this.customCronInput = container.cron || "";
      this.selectedPreset = container.cron
        ? CRON_PRESETS.find((p) => p.value === container.cron)
          ? container.cron
          : "__custom__"
        : "";
      this.settingsDialog = true;
      this.loadTriggers(container);
    },

    async loadTriggers(container: ContainerRow) {
      this.loadingTriggers = true;
      try {
        this.dialogTriggers = await getContainerTriggers(container.id);
      } catch {
        this.dialogTriggers = [];
      } finally {
        this.loadingTriggers = false;
      }
    },

    onPresetChange(preset: string) {
      if (preset && preset !== "__custom__") {
        this.customCronInput = preset;
      }
    },

    async saveSettings() {
      if (!this.selectedContainer) return;
      const container = this.selectedContainer;
      container.saving = true;
      try {
        const cronValue =
          this.selectedPreset === "__custom__" || this.selectedPreset === ""
            ? this.customCronInput.trim() || null
            : this.selectedPreset || null;

        await updateContainerSettings(container.id, {
          autoUpdate: this.dialogAutoUpdate,
          cron: cronValue,
        });
        container.autoUpdate = this.dialogAutoUpdate;
        container.cron = cronValue;
        container.cronDraft = cronValue || "";
        this.settingsDialog = false;
        (this as any).$eventBus.emit("notify", `Settings saved for ${container.displayName}`);
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        container.saving = false;
      }
    },

    async triggerManualUpdate(container: ContainerRow) {
      container.saving = true;
      try {
        await refreshContainer(container.id);
        (this as any).$eventBus.emit("notify", `Check triggered for ${container.displayName}`);
        // Reload to get fresh data
        await this.loadContainers();
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        container.saving = false;
      }
    },

    async runContainerTrigger(trigger: any) {
      if (!this.selectedContainer) return;
      this.triggerRunning = trigger.id;
      try {
        await runTrigger({
          containerId: this.selectedContainer.id,
          triggerType: trigger.type,
          triggerName: trigger.name,
        });
        (this as any).$eventBus.emit("notify", `Trigger "${trigger.name}" executed successfully`);
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Trigger error: ${e.message}`, "error");
      } finally {
        this.triggerRunning = "";
      }
    },

    getStatusColor(status: string) {
      switch (status) {
        case "running":
          return "success";
        case "paused":
          return "warning";
        default:
          return "error";
      }
    },

    getSemverColor(diff: string) {
      switch (diff) {
        case "major":
          return "error";
        case "minor":
          return "warning";
        case "patch":
          return "success";
        default:
          return "info";
      }
    },

    getCronDescription(cron: string) {
      const preset = CRON_PRESETS.find((p) => p.value === cron);
      return preset ? preset.label : cron;
    },
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const containers = await getAllContainers();
      next((vm: any) => {
        vm.containers = containers.map((c: any) => ({
          id: c.id,
          name: c.name,
          displayName: c.displayName || c.name,
          status: c.status,
          watcher: c.watcher,
          image: c.image,
          autoUpdate: c.autoUpdate || false,
          cron: c.cron || null,
          updateAvailable: c.updateAvailable || false,
          updateKind: c.updateKind || { kind: "unknown" },
          result: c.result,
          triggerInclude: c.triggerInclude,
          triggerExclude: c.triggerExclude,
          saving: false,
          editingCron: false,
          cronDraft: c.cron || "",
        }));
        vm.loading = false;
      });
    } catch {
      next((vm: any) => {
        vm.loading = false;
      });
    }
  },
});
