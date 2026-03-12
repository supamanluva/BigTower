// Google fonts
import "@fontsource/roboto";

// Material design icons
import "@mdi/font/css/materialdesignicons.css";

// Font-awesome
import "@fortawesome/fontawesome-free/css/all.css";

import { createVuetify as createVuetifyInstance } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

export function createVuetify() {
  return createVuetifyInstance({
    components,
    directives,
    defaults: {
      VCard: {
        loader: false,
        elevation: 0,
      },
      VBtn: {
        variant: "flat",
      },
      VTextField: {
        variant: "outlined",
        density: "compact",
      },
      VSelect: {
        variant: "outlined",
        density: "compact",
      },
    },
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            background: "#F4F6F9",
            surface: "#FFFFFF",
            "surface-variant": "#F8FAFC",
            primary: "#1A2B4A",
            "primary-darken-1": "#0F1B33",
            secondary: "#3B82F6",
            "secondary-darken-1": "#2563EB",
            accent: "#10B981",
            error: "#EF4444",
            info: "#3B82F6",
            success: "#10B981",
            warning: "#F59E0B",
            "on-background": "#1E293B",
            "on-surface": "#334155",
          },
        },
        dark: {
          dark: true,
          colors: {
            background: "#0F172A",
            surface: "#1E293B",
            "surface-variant": "#293548",
            primary: "#1E293B",
            "primary-darken-1": "#0F172A",
            secondary: "#60A5FA",
            "secondary-darken-1": "#3B82F6",
            accent: "#34D399",
            error: "#F87171",
            info: "#60A5FA",
            success: "#34D399",
            warning: "#FBBF24",
            "on-background": "#E2E8F0",
            "on-surface": "#CBD5E1",
          },
        },
      },
    },
  });
}
