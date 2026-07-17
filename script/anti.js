document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");

  // Check if user previously saved a theme preference
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    toggle.checked = true;
    setDarkTheme();
  }

  // Listen for toggle switches
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      setDarkTheme();
      localStorage.setItem("theme", "dark");
    } else {
      setLightTheme();
      localStorage.setItem("theme", "light");
    }
  });

  function setDarkTheme() {
    document.documentElement.style.setProperty(
      "--bg-gradient",
      "linear-gradient(135deg, #0e121a 0%, #171d2a 100%)",
    );
    document.documentElement.style.setProperty("--card-bg", "#1d2433");
    document.documentElement.style.setProperty("--input-bg", "#141923");
    document.documentElement.style.setProperty("--text-color", "#f7fafc");
    document.documentElement.style.setProperty("--sub-text", "#cbd5e0");
    document.documentElement.style.setProperty(
      "--box-glow",
      "rgba(255, 107, 139, 0.7)",
    );
  }

  function setLightTheme() {
    document.documentElement.style.setProperty(
      "--bg-gradient",
      "linear-gradient(135deg, #ffeef2 0%, #e3f2fd 100%)",
    );
    document.documentElement.style.setProperty("--card-bg", "#ffffff");
    document.documentElement.style.setProperty("--input-bg", "#ffffff");
    document.documentElement.style.setProperty("--text-color", "#0d2149");
    document.documentElement.style.setProperty("--sub-text", "#555555");
    document.documentElement.style.setProperty(
      "--box-glow",
      "rgba(255, 107, 139, 0.4)",
    );
  }
});
