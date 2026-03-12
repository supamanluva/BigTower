import { ref, computed, onMounted, defineComponent } from "vue";
import { useTheme } from "vuetify";
import { getContainerIcon } from "@/services/container";

export default defineComponent({
  setup() {
    const theme = useTheme();
    const mini = ref(false);
    const darkMode = ref(localStorage.darkMode === "true");

    const toggleDarkMode = (value: boolean) => {
      darkMode.value = value;
      localStorage.darkMode = String(darkMode.value);
      theme.global.name.value = darkMode.value ? "dark" : "light";
    };

    onMounted(() => {
      theme.global.name.value = darkMode.value ? "dark" : "light";
    });

    return {
      mini,
      darkMode,
      containerIcon: getContainerIcon(),
      toggleDarkMode,
    };
  },
});
