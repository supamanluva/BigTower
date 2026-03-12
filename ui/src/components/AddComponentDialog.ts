import { defineComponent } from "vue";

// Known configuration fields per provider type
// This helps users know what to fill in without guessing
const PROVIDER_FIELDS: Record<string, Record<string, Array<{
  key: string;
  label: string;
  type: string;
  required?: boolean;
  sensitive?: boolean;
  placeholder?: string;
}>>> = {
  watcher: {
    docker: [
      { key: "socket", label: "Docker socket path", type: "string", placeholder: "/var/run/docker.sock" },
      { key: "host", label: "Remote host", type: "string", placeholder: "e.g. 192.168.1.100" },
      { key: "port", label: "Port", type: "number", placeholder: "2375" },
      { key: "cron", label: "Check schedule (cron)", type: "string", placeholder: "0 * * * *" },
      { key: "watchbydefault", label: "Watch by default", type: "boolean" },
      { key: "watchall", label: "Watch all containers", type: "boolean" },
      { key: "watchevents", label: "Watch Docker events", type: "boolean" },
      { key: "watchatstart", label: "Watch at startup", type: "boolean" },
    ],
  },
  trigger: {
    discord: [
      { key: "url", label: "Webhook URL", type: "string", required: true, sensitive: true, placeholder: "https://discord.com/api/webhooks/..." },
      { key: "botusername", label: "Bot username", type: "string", placeholder: "BigTower" },
    ],
    slack: [
      { key: "url", label: "Webhook URL", type: "string", required: true, sensitive: true, placeholder: "https://hooks.slack.com/..." },
      { key: "botusername", label: "Bot username", type: "string", placeholder: "BigTower" },
    ],
    smtp: [
      { key: "host", label: "SMTP host", type: "string", required: true, placeholder: "smtp.gmail.com" },
      { key: "port", label: "SMTP port", type: "number", required: true, placeholder: "587" },
      { key: "user", label: "Username", type: "string" },
      { key: "pass", label: "Password", type: "string", sensitive: true },
      { key: "to", label: "To email", type: "string", required: true, placeholder: "user@example.com" },
    ],
    telegram: [
      { key: "bottoken", label: "Bot token", type: "string", required: true, sensitive: true },
      { key: "chatid", label: "Chat ID", type: "string", required: true },
    ],
    pushover: [
      { key: "token", label: "Application token", type: "string", required: true, sensitive: true },
      { key: "user", label: "User key", type: "string", required: true, sensitive: true },
    ],
    ntfy: [
      { key: "url", label: "ntfy server URL", type: "string", required: true, placeholder: "https://ntfy.sh" },
      { key: "topic", label: "Topic", type: "string", required: true },
      { key: "priority", label: "Priority", type: "string", placeholder: "default" },
    ],
    mqtt: [
      { key: "url", label: "Broker URL", type: "string", required: true, placeholder: "mqtt://localhost:1883" },
      { key: "topic", label: "Topic", type: "string", required: true, placeholder: "bigtower/container" },
    ],
    http: [
      { key: "url", label: "Webhook URL", type: "string", required: true, placeholder: "https://example.com/webhook" },
      { key: "method", label: "HTTP method", type: "string", placeholder: "POST" },
    ],
    docker: [
      { key: "prune", label: "Remove old image", type: "boolean" },
      { key: "dryrun", label: "Dry run", type: "boolean" },
      { key: "threshold", label: "Update level", type: "string", placeholder: "all" },
    ],
    apprise: [
      { key: "url", label: "Apprise URL", type: "string", required: true, placeholder: "http://apprise:8000/notify" },
    ],
    gotify: [
      { key: "url", label: "Gotify URL", type: "string", required: true, placeholder: "https://gotify.example.com" },
      { key: "token", label: "Application token", type: "string", required: true, sensitive: true },
    ],
    kafka: [
      { key: "brokers", label: "Broker(s)", type: "string", required: true, placeholder: "localhost:9092" },
      { key: "topic", label: "Topic", type: "string", required: true, placeholder: "bigtower-updates" },
    ],
  },
  registry: {
    hub: [
      { key: "login", label: "Docker Hub username", type: "string" },
      { key: "token", label: "Access token", type: "string", sensitive: true },
    ],
    ghcr: [
      { key: "username", label: "GitHub username", type: "string" },
      { key: "token", label: "Personal access token", type: "string", sensitive: true },
    ],
    gcr: [
      { key: "clientemail", label: "Service account email", type: "string" },
      { key: "privatekey", label: "Private key", type: "string", sensitive: true },
    ],
    ecr: [
      { key: "accesskeyid", label: "AWS access key ID", type: "string" },
      { key: "secretaccesskey", label: "AWS secret access key", type: "string", sensitive: true },
      { key: "region", label: "AWS region", type: "string", required: true, placeholder: "us-east-1" },
    ],
    acr: [
      { key: "clientid", label: "Client ID", type: "string", required: true },
      { key: "clientsecret", label: "Client secret", type: "string", required: true, sensitive: true },
    ],
    gitlab: [
      { key: "token", label: "Access token", type: "string", sensitive: true },
      { key: "url", label: "GitLab URL", type: "string", placeholder: "https://registry.gitlab.com" },
    ],
    gitea: [
      { key: "url", label: "Gitea URL", type: "string", required: true, placeholder: "https://gitea.example.com" },
      { key: "login", label: "Username", type: "string" },
      { key: "token", label: "Access token", type: "string", sensitive: true },
    ],
    custom: [
      { key: "url", label: "Registry URL", type: "string", required: true, placeholder: "https://registry.example.com" },
      { key: "login", label: "Username", type: "string" },
      { key: "password", label: "Password", type: "string", sensitive: true },
    ],
  },
  authentication: {
    basic: [
      { key: "user", label: "Username", type: "string", required: true },
      { key: "hash", label: "Password hash (apr1)", type: "string", required: true, sensitive: true },
    ],
    oidc: [
      { key: "clientid", label: "Client ID", type: "string", required: true },
      { key: "clientsecret", label: "Client secret", type: "string", required: true, sensitive: true },
      { key: "discovery", label: "Discovery URL", type: "string", required: true, placeholder: "https://auth.example.com/.well-known/openid-configuration" },
      { key: "redirect", label: "Redirect URL", type: "string", placeholder: "http://localhost:3000/auth/oidc/redirect" },
    ],
  },
};

const PROVIDERS: Record<string, string[]> = {
  watcher: ["docker"],
  trigger: ["discord", "slack", "smtp", "telegram", "pushover", "ntfy", "mqtt", "http", "docker", "apprise", "gotify", "kafka"],
  registry: ["hub", "ghcr", "gcr", "ecr", "acr", "gitlab", "gitea", "custom"],
  authentication: ["basic", "oidc"],
};

const KIND_LABELS: Record<string, string> = {
  watcher: "Watcher",
  trigger: "Action",
  registry: "Registry",
  authentication: "Authentication",
};

export default defineComponent({
  props: {
    modelValue: { type: Boolean, default: false },
    kind: { type: String, required: true },
    onCreate: { type: Function, required: true },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      step: 1 as 1 | 2,
      selectedType: "",
      instanceName: "",
      configDraft: {} as Record<string, any>,
      saving: false,
      errorMsg: "",
    };
  },
  computed: {
    dialogVisible: {
      get(): boolean {
        return this.modelValue;
      },
      set(val: boolean) {
        this.$emit("update:modelValue", val);
      },
    },
    kindLabel(): string {
      return KIND_LABELS[this.kind] || this.kind;
    },
    providerOptions(): string[] {
      return PROVIDERS[this.kind] || [];
    },
    configFields() {
      const fields = PROVIDER_FIELDS[this.kind]?.[this.selectedType];
      return fields || [];
    },
    nameValid(): boolean {
      return /^[a-zA-Z0-9_-]+$/.test(this.instanceName);
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.step = 1;
        this.selectedType = "";
        this.instanceName = "";
        this.configDraft = {};
        this.errorMsg = "";
      }
    },
    selectedType() {
      // Reset config draft when type changes
      this.configDraft = {};
      const fields = this.configFields;
      for (const f of fields) {
        if (f.type === "boolean") this.configDraft[f.key] = false;
        else if (f.type === "number") this.configDraft[f.key] = undefined;
        else this.configDraft[f.key] = "";
      }
    },
  },
  methods: {
    nameRule(v: string) {
      if (!v) return "Name is required";
      if (!/^[a-zA-Z0-9_-]+$/.test(v)) return "Only letters, numbers, hyphens, underscores";
      return true;
    },
    close() {
      this.dialogVisible = false;
    },
    async save() {
      this.saving = true;
      this.errorMsg = "";
      try {
        // Clean empty strings
        const config: Record<string, any> = {};
        for (const [key, val] of Object.entries(this.configDraft)) {
          if (val !== "" && val !== undefined && val !== null) {
            config[key] = val;
          }
        }
        await this.onCreate({
          type: this.selectedType,
          name: this.instanceName.toLowerCase(),
          configuration: config,
        });
        (this as any).$eventBus.emit("notify", `${this.kindLabel} "${this.instanceName}" created successfully`);
        this.close();
      } catch (e: any) {
        this.errorMsg = e.message || "Failed to create";
      } finally {
        this.saving = false;
      }
    },
  },
});
