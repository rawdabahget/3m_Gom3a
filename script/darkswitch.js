// Immediate execution to prevent flash of light theme
(function () {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const isDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

  if (isDark) {
    document.documentElement.classList.add("dark-mode");
    if (document.body) document.body.classList.add("dark-mode");
    document.documentElement.style.colorScheme = "dark";
  } else {
    document.documentElement.classList.remove("dark-mode");
    if (document.body) document.body.classList.remove("dark-mode");
    document.documentElement.style.colorScheme = "light";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const isDark = document.documentElement.classList.contains("dark-mode");
  const navContainer = document.querySelector(".nav-container");
  if (isDark) {
    document.body.classList.add("dark-mode");
    if (navContainer) navContainer.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
    if (navContainer) navContainer.classList.remove("dark-mode");
  }

  // Handle toggles
  document.addEventListener("click", (e) => {
    const lightIce = e.target.closest(".light-ice");
    const darkIce = e.target.closest(".dark-ice");

    if (lightIce) {
      e.preventDefault();
      setTheme(true);
    } else if (darkIce) {
      e.preventDefault();
      setTheme(false);
    }
  });

  function setTheme(isDark) {
    const navContainer = document.querySelector(".nav-container");
    if (isDark) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
      document.documentElement.style.colorScheme = "dark";
      if (navContainer) navContainer.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
      document.documentElement.style.colorScheme = "light";
      if (navContainer) navContainer.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }

  // Initialize Mini Cart Hover Dropdown on Navbar Cart Icon
  function initMiniCartHover() {
    const cartLink = document.querySelector(".icons a.cart, .icons a[href*='cart']");
    if (!cartLink) return;

    // Create wrapper if not wrapped
    let wrapper = cartLink.parentElement;
    if (!wrapper || !wrapper.classList.contains("cart-hover-wrapper")) {
      wrapper = document.createElement("div");
      wrapper.className = "cart-hover-wrapper";
      cartLink.parentNode.insertBefore(wrapper, cartLink);
      wrapper.appendChild(cartLink);
    }

    // Create dropdown card
    let dropdown = wrapper.querySelector(".mini-cart-dropdown");
    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.className = "mini-cart-dropdown";
      wrapper.appendChild(dropdown);
    }

    function renderMiniCart() {
      const raw = localStorage.getItem("fridayCart");
      let cart = [];
      try {
        cart = raw ? JSON.parse(raw) : [];
      } catch (e) {
        cart = [];
      }

      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const subtotal = cart.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      if (cart.length === 0) {
        dropdown.innerHTML = `
          <div class="mini-cart-header">
            <h4 class="mini-cart-title">Your Cart</h4>
            <span class="mini-cart-badge">0 items</span>
          </div>
          <div class="mini-cart-empty">
            <i class="fa-solid fa-basket-shopping" style="font-size: 2rem; color: #94a3b8; margin-bottom: 0.5em; display: block;"></i>
            Your Friday cart is empty
          </div>
          <div class="mini-cart-footer">
            <a href="products.html" class="mini-cart-btn">Browse Products</a>
          </div>
        `;
        return;
      }

      let itemsHtml = "";
      cart.forEach((item) => {
        const qty = item.quantity || 1;
        itemsHtml += `
          <div class="mini-cart-item">
            <img src="${item.image || '../img/can01.jpg'}" alt="${item.name || 'Treat'}" />
            <div class="mini-cart-item-info">
              <div class="mini-cart-item-name">${item.name || 'Delicious Treat'}</div>
              <p class="mini-cart-item-price">${qty} × ${item.price} EGP</p>
            </div>
          </div>
        `;
      });

      dropdown.innerHTML = `
        <div class="mini-cart-header">
          <h4 class="mini-cart-title">Your Cart</h4>
          <span class="mini-cart-badge">${totalItems} ${totalItems === 1 ? 'item' : 'items'}</span>
        </div>
        <div class="mini-cart-items">
          ${itemsHtml}
        </div>
        <div class="mini-cart-footer">
          <div class="mini-cart-subtotal">
            <span>Subtotal:</span>
            <span>${subtotal} EGP</span>
          </div>
          <a href="cart.html" class="mini-cart-btn">View Full Cart</a>
        </div>
      `;
    }

    // Render on initial load and refresh whenever user hovers over wrapper
    renderMiniCart();
    wrapper.addEventListener("mouseenter", renderMiniCart);
  }

  initMiniCartHover();

  // Initialize Live Countdown Timer to Next Friday (or Friday End Timer)
  function initFridayCountdown() {
    function updateTimer() {
      const bars = document.querySelectorAll(".announcement-bar p, .announcement-bar");
      if (!bars.length) return;

      const now = new Date();
      const isFriday =
        now.getDay() === 5 ||
        window.location.search.includes("friday=true") ||
        localStorage.getItem("forceFriday") === "true";

      if (isFriday) {
        const endOfFriday = new Date(now);
        endOfFriday.setHours(23, 59, 59, 999);
        const diff = Math.max(0, endOfFriday - now);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const timerText = `<span>🎉 IT'S FRIDAY! <strong>50% OFF ALL ITEMS</strong> IS LIVE TODAY!</span> <span style="background: rgba(255,255,255,0.22); padding: 4px 14px; border-radius: 16px; font-weight: 600; white-space: nowrap; margin-left: auto;">Ends in: <strong>${hours}h ${minutes}m ${seconds}s</strong> 🍦</span>`;
        bars.forEach((b) => {
          const p = b.tagName === "P" ? b : b.querySelector("p");
          if (p) p.innerHTML = timerText;
        });
      } else {
        const dayOfWeek = now.getDay();
        let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
        if (daysUntilFriday === 0) daysUntilFriday = 7;

        const nextFriday = new Date(now);
        nextFriday.setDate(now.getDate() + daysUntilFriday);
        nextFriday.setHours(0, 0, 0, 0);

        const diff = Math.max(0, nextFriday - now);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const timerText = `<span>🎉 50% OFF ON ALL ITEMS EVERY FRIDAY!</span> <span style="background: rgba(255,255,255,0.22); padding: 4px 14px; border-radius: 16px; font-weight: 600; white-space: nowrap; margin-left: auto;">Next Friday in: <strong>${days}d ${hours}h ${minutes}m ${seconds}s</strong> 🍦</span>`;
        bars.forEach((b) => {
          const p = b.tagName === "P" ? b : b.querySelector("p");
          if (p) p.innerHTML = timerText;
        });
      }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  initFridayCountdown();

  // Initialize Newsletter Subscription Validation & Announcement Banners
  function initNewsletterValidation() {
    const forms = document.querySelectorAll(".email-submit");
    if (!forms.length) return;

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    forms.forEach((form) => {
      form.setAttribute("novalidate", "true");

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = form.querySelector("input[type='email'], input");
        if (!input) return;

        input.classList.remove("input-error");
        const prevErr = form.querySelector(".newsletter-error-msg");
        if (prevErr) prevErr.remove();
        const prevStatus = form.querySelector(".newsletter-status-msg");
        if (prevStatus) prevStatus.remove();

        const emailVal = input.value.trim();

        if (!emailVal || !validateEmail(emailVal)) {
          input.classList.add("input-error");

          const errMsg = document.createElement("span");
          errMsg.className = "newsletter-error-msg";
          errMsg.textContent = !emailVal
            ? "Please enter your email address."
            : "Please enter a valid email address.";
          form.appendChild(errMsg);

          const statusMsg = document.createElement("div");
          statusMsg.className = "newsletter-status-msg error";
          statusMsg.textContent = "Subscription failed: please fix the email error above.";
          form.appendChild(statusMsg);
        } else {
          input.value = "";

          const statusMsg = document.createElement("div");
          statusMsg.className = "newsletter-status-msg success";
          statusMsg.innerHTML = `🎉 Successfully subscribed to our newsletter with <strong>${emailVal}</strong>! Thank you for joining Friday Ice Cream.`;
          form.appendChild(statusMsg);

          setTimeout(() => {
            if (statusMsg.parentNode) {
              statusMsg.remove();
            }
          }, 6000);
        }
      });
    });
  }

  initNewsletterValidation();
});
