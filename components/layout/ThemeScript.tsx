// Inline theme bootstrap that runs before hydration to avoid a flash of the
// wrong color scheme. Mirrors the logic in uiSlice.
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem("3dbharat.theme");var d=t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark");}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
