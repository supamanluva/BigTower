import { computed, ref, inject, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { logout } from "@/services/auth";

const routeTitles: Record<string, string> = {
  home: "Dashboard",
  containers: "Containers",
  "update-management": "Update Management",
  settings: "Settings",
  login: "Login",
};

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const eventBus = inject("eventBus") as any;

    // Password change state
    const showPasswordDialog = ref(false);
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const passwordError = ref("");
    const changingPassword = ref(false);

    const pageTitle = computed(() => {
      const name = route.name as string;
      return routeTitles[name] || name || "Dashboard";
    });

    const breadcrumbs = computed(() => {
      const crumbs: Array<{ title: string; to?: string; disabled?: boolean }> = [
        { title: "Home", to: "/" },
      ];
      const name = route.name as string;
      if (name && name !== "home") {
        crumbs.push({
          title: routeTitles[name] || name,
          disabled: true,
        });
      }
      return crumbs;
    });

    const userInitial = computed(() => {
      if (props.user?.username) {
        return props.user.username.charAt(0).toUpperCase();
      }
      return "?";
    });

    const confirmError = computed(() => {
      if (confirmPassword.value && confirmPassword.value !== newPassword.value) {
        return "Passwords do not match";
      }
      return "";
    });

    const canChangePassword = computed(() => {
      return (
        currentPassword.value.length > 0 &&
        newPassword.value.length >= 4 &&
        confirmPassword.value === newPassword.value &&
        !changingPassword.value
      );
    });

    const refreshCurrentPage = () => {
      router.go(0);
    };

    const closePasswordDialog = () => {
      showPasswordDialog.value = false;
      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
      passwordError.value = "";
    };

    const changePassword = async () => {
      passwordError.value = "";
      changingPassword.value = true;
      try {
        const response = await fetch("/auth/change-password", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          passwordError.value = data.error || "Failed to change password";
        } else {
          closePasswordDialog();
          eventBus.emit("notify", "Password changed successfully", "info");
        }
      } catch (e: any) {
        passwordError.value = "Network error";
      } finally {
        changingPassword.value = false;
      }
    };

    const performLogout = async () => {
      try {
        const logoutResult = await logout();
        if (logoutResult.logoutUrl) {
          window.location = logoutResult.logoutUrl;
        } else {
          await router.push({
            name: "login",
          });
        }
      } catch (e: any) {
        eventBus.emit(
          "notify",
          `Error when trying to logout (${e.message})`,
          "error",
        );
      }
    };

    return {
      pageTitle,
      breadcrumbs,
      userInitial,
      refreshCurrentPage,
      logout: performLogout,
      showPasswordDialog,
      currentPassword,
      newPassword,
      confirmPassword,
      passwordError,
      confirmError,
      changingPassword,
      canChangePassword,
      closePasswordDialog,
      changePassword,
    };
  },
});
