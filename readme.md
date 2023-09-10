# Optimal Theme

- [80% or more of users prefer dark mode](https://thesmallbusinessblog.net/dark-mode-users); therefore, `light` and `dark` modes should be supported on all websites and `dark` mode should be the default setting.
- The easiest way to provide both modes is by using `css variables` on the `:root` document, which can be declared once and then be leveraged by all descendant elements.

**CSS Example**

```css
:root {
  /* Page background color variables. */
  --app-background-light: #ffffff;
  --app-background-dark: #000000;

  /* Page text color variables. */
  --app-textcolor-light: #000000;
  --app-textcolor-dark: #ffffff;

  /* Set the variables to default to dark mode. */
  --app-background: var(--app-background-dark);
  --app-textcolor: var(--app-textcolor-dark);

  /* Override the variables based on system preference. */
  @media (prefers-color-scheme: light) {
    --app-background: var(--app-background-light);
    --app-textcolor: var(--app-textcolor-light);
  }
}

/* Apply the css variables to an element. */
body {
  background-color: var(--app-background);
  color: var(--app-textcolor);
}
```

The body will now automatically be themed according to the user's system preference. This works **without** any javascript needed. You can also style other elements other than body with these variables as long as the variables are declared in the `:root` scope.

## Controlling & Persisting Theme w/ Javascript

- We will likely have some UI menu in our site that allows the user to toggle/set the theme mode.
- We should default to the css system preference above if the user doesn't actively change the theme mode via UI.
- If the user **does** actively override the theme by toggling/setting, the change should be saved for all future page visits by saving the mode to LocalStorage.
- We should also allow for the user to set the theme mode preference as `system`, in case they want it to automatically sync the theme mode to their system.

**Inline IIFE JS Script (Recommended)**

```html
<script>
  // (1) Core minified library (copy/paste line below prettier-ignore)
  // prettier-ignore
  const setupTheme=function(){"use strict";return(u,g,M)=>{const m=M??"theme-mode",n=g??"dark";let s=!1;try{localStorage.setItem("a","a"),localStorage.removeItem("a"),s=!0}catch{s=!1}const c="matchMedia"in window,h=c&&typeof window.matchMedia("(prefers-color-scheme: light)").matches=="boolean",l=()=>{if(s){const e=localStorage.getItem(m)??"";if(["light","dark","system"].includes(e))return e}return null},d=()=>c&&h?window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark":null,a=()=>{const e=d(),t=l();return t&&t!=="system"?t:e||n},o=(e,t)=>{t&&s&&localStorage.setItem(m,e);const r=e==="system"?d()??n:e,p=document.documentElement;u.forEach(i=>{p.style.setProperty(`--${i}`,`var(--${i}-${r})`)})},T=()=>{o(a()==="light"?"dark":"light",!0)},f=()=>{o("system",!0)};return o(a()),c&&h&&window.matchMedia("(prefers-color-scheme: light)").addEventListener("change",t=>{const r=l();(!r||r==="system")&&o(t.matches?"light":"dark")}),{getThemeMode:a,setThemeMode:o,toggleThemeMode:T,useSystemThemeMode:f}}}();

  // (2) Run the setup function (pass css var names that have `-light` & `-dark` suffixes).
  const { getThemeMode, setThemeMode, toggleThemeMode, useSystemThemeMode } =
    setupTheme(["app-background", "app-textcolor"]);

  // (3) Attach the callbacks to window or wherever.
  window.getThemeMode = getThemeMode;
  window.setThemeMode = setThemeMode;
  window.toggleThemeMode = toggleThemeMode;
  window.useSystemThemeMode = useSystemThemeMode;
</script>
```

> `dist/optimal-theme.iife.js` 1.06 kB | gzip: 0.55 kB

**External ESM JS Script**

```html
<script src="optimal-theme.esm.js">
  // (1) Run the setup function (pass css var names that have `-light` & `-dark` suffixes).
  const { getThemeMode, setThemeMode, toggleThemeMode, useSystemThemeMode } =
    setupTheme(["app-background", "app-textcolor"]);

  // (2) Attach the callbacks to window or wherever.
  window.getThemeMode = getThemeMode;
  window.setThemeMode = setThemeMode;
  window.toggleThemeMode = toggleThemeMode;
  window.useSystemThemeMode = useSystemThemeMode;
</script>
```

> `dist/optimal-theme.js` 1.51 kB | gzip: 0.63 kB

- By including this script at the top of the page and by **not** using `async` or `defer`, we **ensure** that there is **never** any flash-of-unstyled-content (FOUC).
- It is recommended to use the IIFE version instead of this version as this version requires an extra network request to retrieve the `optimal-theme.esm.js`, which will pause html parsing/rendering until the script is downloaded and execution is finished.

---

- Use `npm run dev` to see/test in browser.
- See `example/index.html` for an example setup of this configuration.
