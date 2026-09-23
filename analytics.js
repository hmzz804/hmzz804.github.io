(() => {
  const token = window.SITE_CONFIG?.analytics?.cloudflareToken?.trim();
  const isLocal = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

  if (!token || isLocal) return;

  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.dataset.cfBeacon = JSON.stringify({ token, spa: false });
  document.head.appendChild(beacon);
})();
