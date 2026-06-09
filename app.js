const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if ("serviceWorker" in navigator) {
  const appScriptUrl = document.currentScript?.src || new URL("app.js", window.location.href).href;
  const appBaseUrl = new URL(".", appScriptUrl);
  const serviceWorkerUrl = new URL("sw.js", appBaseUrl);

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(serviceWorkerUrl).catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
