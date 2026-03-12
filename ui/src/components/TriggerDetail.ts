import { runTrigger } from "@/services/trigger";
import { defineComponent } from "vue";

const HIDDEN_KEYS = ["simpletitle", "simplebody", "batchtitle"];
const SENSITIVE_KEYS = ["password", "token", "secret", "key", "auth", "pass"];
const LABEL_MAP: Record<string, string> = {
  prune: "Remove old image",
  dryrun: "Dry run",
  autoremovetimeout: "Auto-remove timeout",
  auto: "Auto-trigger",
  threshold: "Update level",
  mode: "Mode",
  once: "Once per update",
  url: "URL",
  to: "To",
  from: "From",
  topic: "Topic",
  token: "Token",
  chatid: "Chat ID",
  user: "User key",
  device: "Device",
  priority: "Priority",
};

function getLabel(key: string): string {
  return LABEL_MAP[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s: string) => s.toUpperCase());
}

export default defineComponent({
  components: {},
  props: {
    trigger: {
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
      showTestForm: false,
      isTriggering: false,
      isEditing: false,
      saving: false,
      deleting: false,
      confirmDelete: false,
      editDraft: {} as Record<string, any>,
      container: {
        id: "123456789",
        name: "container_test",
        watcher: "watcher_test",
        updateKind: {
          kind: "tag",
          semverDiff: "major",
          localValue: "1.2.3",
          remoteValue: "4.5.6",
          result: {
            link: "https://my-container/release-notes/",
          },
        },
      },
    };
  },
  computed: {
    configurationItems() {
      return Object.keys(this.trigger.configuration || [])
        .filter((key) => !HIDDEN_KEYS.includes(key))
        .map((key) => ({
          key,
          label: getLabel(key),
          value: this.trigger.configuration[key],
        }))
        .sort((t1, t2) => t1.label.localeCompare(t2.label));
    },
    editFields() {
      const config = this.trigger.configuration || {};
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
  },

  methods: {
    collapse() {
      if (!this.isEditing) {
        this.showDetail = !this.showDetail;
      }
    },
    startEditing() {
      this.editDraft = { ...(this.trigger.configuration || {}) };
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
        const cleaned: Record<string, any> = {};
        for (const [key, val] of Object.entries(this.editDraft)) {
          if (val !== "" && val !== undefined) {
            cleaned[key] = val;
          }
        }
        await this.onUpdate(this.trigger.type, this.trigger.name, cleaned);
        this.isEditing = false;
        (this as any).$eventBus.emit("notify", `${this.trigger.name} updated successfully`);
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
        await this.onDelete(this.trigger.type, this.trigger.name);
        this.confirmDelete = false;
        (this as any).$eventBus.emit("notify", `${this.trigger.name} removed`);
      } catch (e: any) {
        (this as any).$eventBus.emit("notify", `Error: ${e.message}`, "error");
      } finally {
        this.deleting = false;
      }
    },
    async runTrigger() {
      this.isTriggering = true;
      try {
        await runTrigger({
          triggerType: this.trigger.type,
          triggerName: this.trigger.name,
          container: this.container,
        });
        (this as any).$eventBus.emit("notify", "Trigger executed with success");
      } catch (err: any) {
        (this as any).$eventBus.emit(
          "notify",
          `Trigger executed with error (${err.message})`,
          "error",
        );
      } finally {
        this.isTriggering = false;
      }
    },
    formatValue(value: any) {
      if (value === undefined || value === null || value === "") {
        return "<empty>";
      }
      return value;
    },
  },
});
