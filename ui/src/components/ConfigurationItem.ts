import IconRenderer from "@/components/IconRenderer.vue";
import { defineComponent } from "vue";

const HIDDEN_KEYS = ["hash", "password", "secretaccesskey", "token", "auth"];
const SENSITIVE_KEYS = ["hash", "password", "secretaccesskey", "token", "auth", "pass", "secret", "key", "privatekey"];
const LABEL_MAP: Record<string, string> = {
  watchbydefault: "Watch by default",
  watchall: "Watch all containers",
  watchevents: "Watch Docker events",
  watchatstart: "Watch at startup",
  cron: "Check schedule (cron)",
  socket: "Docker socket path",
  port: "Port",
  jitter: "Random delay (jitter)",
  url: "URL",
  login: "Username",
  namespace: "Namespace",
  account: "Account",
  region: "Region",
  accesskeyid: "Access key ID",
  user: "Username",
  host: "Host",
  tls: "TLS enabled",
  cafile: "CA certificate file",
  certfile: "Client certificate file",
  keyfile: "Client key file",
  botusername: "Bot username",
  cardcolor: "Card color",
  cardlabel: "Card label",
  to: "To",
  from: "From",
  pass: "Password",
  threshold: "Update level",
  mode: "Mode",
  once: "Once per update",
  prune: "Remove old image",
  dryrun: "Dry run",
};

function getLabel(key: string): string {
  return LABEL_MAP[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s: string) => s.toUpperCase());
}

export default defineComponent({
  components: {
    IconRenderer,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    onUpdate: {
      type: Function,
      default: null,
    },
    onDelete: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      showDetail: false,
      isEditing: false,
      saving: false,
      deleting: false,
      confirmDelete: false,
      editDraft: {} as Record<string, any>,
    };
  },
  computed: {
    configurationItems() {
      const config = this.item.configuration;
      if (!config || typeof config !== "object") {
        return [];
      }
      return Object.keys(config)
        .filter((key) => !HIDDEN_KEYS.includes(key))
        .map((key) => ({
          key,
          label: getLabel(key),
          value: config[key],
        }))
        .filter((item) => item.value !== null && item.value !== undefined && item.value !== "")
        .sort((item1, item2) => item1.label.localeCompare(item2.label));
    },

    editFields() {
      const config = this.item.configuration || {};
      return Object.keys(config).map((key) => {
        const value = config[key];
        let fieldType = "string";
        if (typeof value === "boolean") fieldType = "boolean";
        else if (typeof value === "number") fieldType = "number";
        return {
          key,
          label: getLabel(key),
          type: fieldType,
          sensitive: SENSITIVE_KEYS.includes(key),
        };
      }).sort((a, b) => a.label.localeCompare(b.label));
    },

    displayName() {
      if (this.item.name && this.item.type && this.item.name !== this.item.type) {
        return `${this.item.name} (${this.item.type})`;
      }
      return this.item.name || "Unknown";
    },
  },

  methods: {
    collapse() {
      if (!this.isEditing) {
        this.showDetail = !this.showDetail;
      }
    },
    startEditing() {
      this.editDraft = { ...(this.item.configuration || {}) };
      this.isEditing = true;
      this.showDetail = true;
    },
    cancelEditing() {
      this.isEditing = false;
      this.editDraft = {};
    },
    async saveEditing() {
      if (!this.onUpdate) return;
      this.saving = true;
      try {
        // Clean empty strings to undefined
        const cleaned: Record<string, any> = {};
        for (const [key, val] of Object.entries(this.editDraft)) {
          if (val !== "" && val !== undefined) {
            cleaned[key] = val;
          }
        }
        await this.onUpdate(this.item.type, this.item.name, cleaned);
        this.isEditing = false;
        (this as any).$eventBus.emit("notify", `${this.item.name} updated successfully`);
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        this.saving = false;
      }
    },
    async doDelete() {
      if (!this.onDelete) return;
      this.deleting = true;
      try {
        await this.onDelete(this.item.type, this.item.name);
        this.confirmDelete = false;
        (this as any).$eventBus.emit("notify", `${this.item.name} removed`);
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        this.deleting = false;
      }
    },
    formatValue(value: any) {
      if (value === undefined || value === null || value === "") {
        return "<empty>";
      }
      return value;
    },
    formatDisplayValue(key: string, value: any) {
      if (typeof value === "boolean") {
        return value ? "Yes" : "No";
      }
      if (key === "jitter" && typeof value === "number") {
        return `${value / 1000}s`;
      }
      return value;
    },
  },
});
