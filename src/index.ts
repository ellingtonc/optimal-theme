/**
 * Sets up the theme to sync css/js/localStorage themeMode
 * and provides callbacks to programmatically retrieve and/or modify the theme mode.
 * It should be inlined in the document's head to avoid flash of unstyled content (FOUC).
 *
 * @param cssVars - Array of themed css variables to toggle between `-light` & `-dark`.
 * @param defaultMode - Default mode set by the CSS (defaults to `dark`).
 * @param localStorageKey - Default key to use for storing theme mode in local storage.
 * @returns {
 *   getThemeMode,
 *   setThemeMode,
 *   toggleThemeMode,
 *   useSystemThemeMode
 * }
 */
const setupTheme = (() => {
  let hasEventListener = false;
  return (
    cssVars: string[],
    defaultMode?: "light" | "dark",
    localStorageKey?: string,
  ) => {
    const LOCAL_STORAGE_THEMEMODE_KEY = localStorageKey ?? "theme-mode";
    const DEFAULT_THEMEMODE = defaultMode ?? "dark";

    // Check Local Storage Support
    let supportsLocalStorage: boolean = false;
    try {
      localStorage.setItem("a", "a");
      localStorage.removeItem("a");
      supportsLocalStorage = true;
    } catch (e) {
      supportsLocalStorage = false;
    }

    // Check Match Media Support
    const supportsMatchMedia = "matchMedia" in window;

    // Check Match Media Theme Support
    const supportsMatchMediaTheme =
      supportsMatchMedia &&
      typeof window.matchMedia("(prefers-color-scheme: light)").matches ===
        "boolean";

    /**
     * Internal callback to get theme mode from local storage.
     *
     * @return "light" | "dark" | "system" | null
     */
    const getLocalStorageThemeMode = () => {
      if (supportsLocalStorage) {
        const lsThemeMode =
          localStorage.getItem(LOCAL_STORAGE_THEMEMODE_KEY) ?? "";
        if (["light", "dark", "system"].includes(lsThemeMode)) {
          return lsThemeMode as "light" | "dark" | "system";
        }
      }
      return null;
    };

    /**
     * Internal callback to get system theme mode from css media query.
     *
     * @return "light" | "dark" | null
     */
    const getSystemPreferenceThemeMode = () => {
      return supportsMatchMedia && supportsMatchMediaTheme
        ? window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
        : null;
    };

    /**
     * User function to get the UI theme mode.
     *
     * @return "light" | "dark"
     */
    const getThemeMode = () => {
      const systemThemeMode = getSystemPreferenceThemeMode();
      const storageThemeMode = getLocalStorageThemeMode();
      if (storageThemeMode && storageThemeMode !== "system") {
        return storageThemeMode;
      }
      return systemThemeMode || DEFAULT_THEMEMODE;
    };

    /**
     * User function to override/set the UI theme mode with javascript.
     *
     * @param newMode {"light" | "dark" | "system"}
     * @param save {boolean | undefined}
     */
    const setThemeMode = (
      newMode: "light" | "dark" | "system",
      save?: boolean,
    ) => {
      if (save && supportsLocalStorage) {
        localStorage.setItem(LOCAL_STORAGE_THEMEMODE_KEY, newMode);
      }
      const setMode =
        newMode === "system"
          ? getSystemPreferenceThemeMode() ?? DEFAULT_THEMEMODE
          : newMode;
      const root = document.documentElement;
      cssVars.forEach((themed_var) => {
        root.style.setProperty(
          `--${themed_var}`,
          `var(--${themed_var}-${setMode})`,
        );
      });
    };

    /**
     * User function to toggle the theme mode.
     */
    const toggleThemeMode = () => {
      setThemeMode(getThemeMode() === "light" ? "dark" : "light", true);
    };

    /**
     * User function to use system's theme mode.
     */
    const useSystemThemeMode = () => {
      setThemeMode("system", true);
    };

    // Sync the current theme mode.
    setThemeMode(getThemeMode());

    // Sync theme mode when `system` changes & localStorage is `null` || `system`.
    if (supportsMatchMedia && supportsMatchMediaTheme && !hasEventListener) {
      const matcher = window.matchMedia("(prefers-color-scheme: light)");
      matcher.addEventListener("change", (newMode) => {
        const lsThemeMode = getLocalStorageThemeMode();
        if (!lsThemeMode || lsThemeMode === "system") {
          setThemeMode(newMode.matches ? "light" : "dark");
        }
      });
      hasEventListener = true;
    }

    // Export the user callable theme mode functions.
    return {
      getThemeMode,
      setThemeMode,
      toggleThemeMode,
      useSystemThemeMode,
    };
  };
})();

export default setupTheme;
