const themeInitScript = `(function(){try{var stored=localStorage.getItem("theme");var theme=stored==="dark"||stored==="light"?stored:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.classList.toggle("dark",theme==="dark");}catch(e){}})();`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
      suppressHydrationWarning
    />
  );
}
