import ConfigurationItem from "@/components/ConfigurationItem.vue";
import TriggerDetail from "@/components/TriggerDetail.vue";
import AddComponentDialog from "@/components/AddComponentDialog.vue";
import { getAllWatchers, createWatcher, updateWatcher, deleteWatcher } from "@/services/watcher";
import { getAllRegistries, getRegistryProviderIcon, createRegistry, updateRegistry, deleteRegistry } from "@/services/registry";
import { getAllTriggers, createTrigger, updateTrigger, deleteTrigger } from "@/services/trigger";
import { getAllAuthentications, createAuthentication, updateAuthentication, deleteAuthentication } from "@/services/authentication";
import { defineComponent } from "vue";

function getTriggerTypeIcon(type: string): string {
  switch (type) {
    case "docker": return "mdi-docker";
    case "smtp":
    case "mail": return "mdi-email-outline";
    case "slack": return "si-slack";
    case "discord": return "si-discord";
    case "telegram": return "si-telegram";
    case "pushover": return "mdi-bell-outline";
    case "apprise": return "mdi-bell-ring-outline";
    case "mqtt": return "mdi-access-point";
    case "http":
    case "webhook": return "mdi-webhook";
    case "kafka": return "si-apachekafka";
    default: return "mdi-bell-ring-outline";
  }
}

async function loadSafe<T>(fn: () => Promise<T[]>): Promise<{ data: T[]; error: string | null }> {
  try {
    return { data: await fn(), error: null };
  } catch (e: any) {
    return { data: [], error: e.message || "Unknown error" };
  }
}

export default defineComponent({
  components: {
    ConfigurationItem,
    TriggerDetail,
    AddComponentDialog,
  },
  data() {
    return {
      tab: "watchers",
      loading: true,
      watchers: [] as any[],
      registries: [] as any[],
      triggers: [] as any[],
      authentications: [] as any[],
      errors: {
        watchers: null as string | null,
        registries: null as string | null,
        triggers: null as string | null,
        authentications: null as string | null,
      },
      addDialogKind: "" as string,
      showAddDialog: false,
    };
  },

  methods: {
    // ---- Reload helpers ----
    async reloadWatchers() {
      try {
        const watchers = await getAllWatchers();
        this.watchers = watchers.map((w: any) => ({ ...w, icon: "mdi-docker" }));
        this.errors.watchers = null;
      } catch (e: any) {
        this.errors.watchers = e.message;
      }
    },
    async reloadRegistries() {
      try {
        const registries = await getAllRegistries();
        this.registries = registries
          .map((r: any) => ({ ...r, icon: getRegistryProviderIcon(r.type) }))
          .sort((a: any, b: any) => a.id.localeCompare(b.id));
        this.errors.registries = null;
      } catch (e: any) {
        this.errors.registries = e.message;
      }
    },
    async reloadTriggers() {
      try {
        const triggers = await getAllTriggers();
        this.triggers = triggers.map((t: any) => ({ ...t, icon: getTriggerTypeIcon(t.type) }));
        this.errors.triggers = null;
      } catch (e: any) {
        this.errors.triggers = e.message;
      }
    },
    async reloadAuthentications() {
      try {
        const auths = await getAllAuthentications();
        this.authentications = auths.map((a: any) => ({
          ...a,
          icon: a.type === "oidc" ? "mdi-shield-key-outline" : "mdi-account-lock-outline",
        }));
        this.errors.authentications = null;
      } catch (e: any) {
        this.errors.authentications = e.message;
      }
    },

    // ---- Update handlers ----
    async handleUpdateWatcher(type: string, name: string, config: any) {
      await updateWatcher(type, name, config);
      await this.reloadWatchers();
    },
    async handleDeleteWatcher(type: string, name: string) {
      await deleteWatcher(type, name);
      await this.reloadWatchers();
    },
    async handleUpdateRegistry(type: string, name: string, config: any) {
      await updateRegistry(type, name, config);
      await this.reloadRegistries();
    },
    async handleDeleteRegistry(type: string, name: string) {
      await deleteRegistry(type, name);
      await this.reloadRegistries();
    },
    async handleUpdateTrigger(type: string, name: string, config: any) {
      await updateTrigger(type, name, config);
      await this.reloadTriggers();
    },
    async handleDeleteTrigger(type: string, name: string) {
      await deleteTrigger(type, name);
      await this.reloadTriggers();
    },
    async handleUpdateAuth(type: string, name: string, config: any) {
      await updateAuthentication(type, name, config);
      await this.reloadAuthentications();
    },
    async handleDeleteAuth(type: string, name: string) {
      await deleteAuthentication(type, name);
      await this.reloadAuthentications();
    },

    // ---- Create handlers ----
    openAddDialog(kind: string) {
      this.addDialogKind = kind;
      this.showAddDialog = true;
    },
    async handleCreate(data: any) {
      const kind = this.addDialogKind;
      const creators: Record<string, Function> = {
        watcher: createWatcher,
        registry: createRegistry,
        trigger: createTrigger,
        authentication: createAuthentication,
      };
      const reloaders: Record<string, Function> = {
        watcher: this.reloadWatchers,
        registry: this.reloadRegistries,
        trigger: this.reloadTriggers,
        authentication: this.reloadAuthentications,
      };
      if (creators[kind]) {
        await creators[kind](data);
        if (reloaders[kind]) await reloaders[kind]();
      }
    },
  },

  async beforeRouteEnter(to, from, next) {
    // Load each resource independently so one failure doesn't blank the whole page
    const [watchersResult, registriesResult, triggersResult, authResult] =
      await Promise.all([
        loadSafe(getAllWatchers),
        loadSafe(getAllRegistries),
        loadSafe(getAllTriggers),
        loadSafe(getAllAuthentications),
      ]);

    const registriesWithIcons = registriesResult.data
      .map((registry: any) => ({
        ...registry,
        icon: getRegistryProviderIcon(registry.type),
      }))
      .sort((r1: any, r2: any) => r1.id.localeCompare(r2.id));

    const watchersWithIcons = watchersResult.data.map((watcher: any) => ({
      ...watcher,
      icon: "mdi-docker",
    }));

    const authWithIcons = authResult.data.map((auth: any) => ({
      ...auth,
      icon: auth.type === "oidc" ? "mdi-shield-key-outline" : "mdi-account-lock-outline",
    }));

    next((vm: any) => {
      vm.watchers = watchersWithIcons;
      vm.registries = registriesWithIcons;
      vm.triggers = triggersResult.data.map((trigger: any) => ({
        ...trigger,
        icon: getTriggerTypeIcon(trigger.type),
      }));
      vm.authentications = authWithIcons;
      vm.errors = {
        watchers: watchersResult.error,
        registries: registriesResult.error,
        triggers: triggersResult.error,
        authentications: authResult.error,
      };
      vm.loading = false;
      // Restore tab from query if present
      if (to.query.tab) {
        vm.tab = to.query.tab;
      }
    });
  },
});
