var setupTheme=function(){"use strict";return(()=>{let n=!1;return(g,M,T)=>{const m=T??"theme-mode",h=M??"dark";let o=!1;try{localStorage.setItem("a","a"),localStorage.removeItem("a"),o=!0}catch{o=!1}const c="matchMedia"in window,l=c&&typeof window.matchMedia("(prefers-color-scheme: light)").matches=="boolean",i=()=>{if(o){const e=localStorage.getItem(m)??"";if(["light","dark","system"].includes(e))return e}return null},d=()=>c&&l?window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark":null,a=()=>{const e=d(),t=i();return t&&t!=="system"?t:e||h},s=(e,t)=>{t&&o&&localStorage.setItem(m,e);const r=e==="system"?d()??h:e,E=document.documentElement;g.forEach(u=>{E.style.setProperty(`--${u}`,`var(--${u}-${r})`)})},f=()=>{s(a()==="light"?"dark":"light",!0)},p=()=>{s("system",!0)};return s(a()),c&&l&&!n&&(window.matchMedia("(prefers-color-scheme: light)").addEventListener("change",t=>{const r=i();(!r||r==="system")&&s(t.matches?"light":"dark")}),n=!0),{getThemeMode:a,setThemeMode:s,toggleThemeMode:f,useSystemThemeMode:p}}})()}();
