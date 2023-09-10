const y = (() => {
  let m = !1;
  return (u, M, f) => {
    const n = f ?? "theme-mode", h = M ?? "dark";
    let s = !1;
    try {
      localStorage.setItem("a", "a"), localStorage.removeItem("a"), s = !0;
    } catch {
      s = !1;
    }
    const a = "matchMedia" in window, l = a && typeof window.matchMedia("(prefers-color-scheme: light)").matches == "boolean", d = () => {
      if (s) {
        const e = localStorage.getItem(n) ?? "";
        if (["light", "dark", "system"].includes(e))
          return e;
      }
      return null;
    }, i = () => a && l ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark" : null, c = () => {
      const e = i(), t = d();
      return t && t !== "system" ? t : e || h;
    }, o = (e, t) => {
      t && s && localStorage.setItem(n, e);
      const r = e === "system" ? i() ?? h : e, E = document.documentElement;
      u.forEach((g) => {
        E.style.setProperty(
          `--${g}`,
          `var(--${g}-${r})`
        );
      });
    }, T = () => {
      o(c() === "light" ? "dark" : "light", !0);
    }, p = () => {
      o("system", !0);
    };
    return o(c()), a && l && !m && (window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (t) => {
      const r = d();
      (!r || r === "system") && o(t.matches ? "light" : "dark");
    }), m = !0), {
      getThemeMode: c,
      setThemeMode: o,
      toggleThemeMode: T,
      useSystemThemeMode: p
    };
  };
})();
export {
  y as default
};
