import { getContainerIcon, getAllContainers } from "@/services/container";
import { getRegistryIcon, getAllRegistries } from "@/services/registry";
import { getTriggerIcon, getAllTriggers } from "@/services/trigger";
import { getWatcherIcon, getAllWatchers } from "@/services/watcher";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      loading: true,
      containersCount: 0,
      containersToUpdateCount: 0,
      triggersCount: 0,
      watchersCount: 0,
      registriesCount: 0,
      updatableContainers: [] as any[],
      motdDismissed: false,
      updatesByKind: {
        major: 0,
        minor: 0,
        patch: 0,
        other: 0,
      },
      containerIcon: getContainerIcon(),
      registryIcon: getRegistryIcon(),
      triggerIcon: getTriggerIcon(),
      watcherIcon: getWatcherIcon(),
    };
  },

  methods: {
    dismissMotd() {
      this.motdDismissed = true;
      // Remember dismissal for this session (resets on page reload)
      sessionStorage.setItem("motd-dismissed", "true");
    },
  },

  async beforeRouteEnter(to, from, next) {
    try {
      const [containers, watchers, registries, triggers] = await Promise.all([
        getAllContainers(),
        getAllWatchers(),
        getAllRegistries(),
        getAllTriggers(),
      ]);

      const updatable = containers.filter(
        (container: any) => container.updateAvailable,
      );

      const updatesByKind = { major: 0, minor: 0, patch: 0, other: 0 };
      updatable.forEach((c: any) => {
        const diff = c.updateKind?.semverDiff;
        if (diff === "major") updatesByKind.major++;
        else if (diff === "minor") updatesByKind.minor++;
        else if (diff === "patch") updatesByKind.patch++;
        else updatesByKind.other++;
      });

      next((vm: any) => {
        vm.containersCount = containers.length;
        vm.triggersCount = triggers.length;
        vm.watchersCount = watchers.length;
        vm.registriesCount = registries.length;
        vm.containersToUpdateCount = updatable.length;
        vm.updatableContainers = updatable;
        vm.updatesByKind = updatesByKind;
        vm.motdDismissed = sessionStorage.getItem("motd-dismissed") === "true";
        vm.loading = false;
      });
    } catch (e) {
      next((vm: any) => {
        vm.loading = false;
        console.log(e);
      });
    }
  },
});
