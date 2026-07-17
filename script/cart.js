document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector(".cart-table tbody");
  const checkoutBtn = document.querySelector(".btn-checkout");
  const continueShoppingLinks = document.querySelectorAll(".continue-shopping");
  const cartForm = document.querySelector(".cart-form");
  let couponApplied = false;

  // Load cart from localStorage or initialize with defaults on first visit
  function getCart() {
    const raw = localStorage.getItem("fridayCart");
    let cart = [];
    if (raw === null) {
      cart = [
        {
          id: "red-velvet-sandwich",
          name: "Red Velvet Sandwich",
          price: 18,
          image: "../img/image1.jpg",
          quantity: 1,
        },
        {
          id: "berry-cola",
          name: "Berry Cola",
          price: 25,
          image: "../img/image2.jpg",
          quantity: 1,
        },
      ];
    } else {
      try {
        cart = JSON.parse(raw) || [];
      } catch (e) {
        cart = [];
      }
    }

    const isFriday =
      new Date().getDay() === 5 ||
      window.location.search.includes("friday=true") ||
      localStorage.getItem("forceFriday") === "true";

    let changed = false;
    cart.forEach((item) => {
      if (isFriday && !item.fridayDiscounted) {
        item.originalPrice = item.originalPrice || item.price * 2;
        item.price = Number((item.price * 0.5).toFixed(2));
        item.fridayDiscounted = true;
        changed = true;
      } else if (!isFriday && item.fridayDiscounted) {
        item.price = item.originalPrice || Number((item.price * 2).toFixed(2));
        item.fridayDiscounted = false;
        changed = true;
      }
    });

    if (changed || raw === null) {
      localStorage.setItem("fridayCart", JSON.stringify(cart));
    }
    return cart;
  }

  function saveCart(cart) {
    localStorage.setItem("fridayCart", JSON.stringify(cart));
  }

  function renderCart() {
    if (!tbody) return;
    const cart = getCart();

    tbody.innerHTML = "";

    if (cart.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 4em 2em;">
            <div style="font-size: 3rem; margin-bottom: 0.5em;"><i class="fa-solid fa-cart-shopping" style="color: #cbd5e1;"></i></div>
            <h3 style="font-family: 'Fredoka', sans-serif; font-size: 1.5rem; margin-bottom: 0.5em;">Your Cart is Empty</h3>
            <p style="color: #64748b; margin-bottom: 1.5em;">Looks like you haven't added any treats yet.</p>
            <a href="products.html" style="display: inline-block; background: var(--primary-dark, #1e3a8a); color: #fff; padding: 0.6em 1.5em; border-radius: 20px; text-decoration: none; font-weight: 600;">Browse Products</a>
          </td>
        </tr>
      `;
    } else {
      cart.forEach((item, index) => {
        const lineTotal = item.price * item.quantity;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="product-cell">
            <div class="product-index">${index + 1}</div>
            <div class="product-info">
              <button class="action-btn heart-btn" title="Add to Wishlist">
                <i class="fa-regular fa-heart"></i>
              </button>
              <img src="${item.image}" alt="${item.name}" class="product-img" />
              <span class="product-name">${item.name}</span>
            </div>
          </td>
          <td>
            <div class="quantity-control" data-id="${item.id}">
              <button class="qty-minus">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-plus">+</button>
            </div>
          </td>
          <td class="bold-text">${item.price} EGP</td>
          <td class="bold-text">
            <div class="total-cell">
              <span>${lineTotal} EGP</span>
              <button class="action-btn delete-btn" data-id="${item.id}" title="Remove Item">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    updateSummary(cart);
  }

  function updateSummary(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = totalItems > 0 ? 10 : 0;
    const discount = totalItems > 0 && couponApplied ? 10 : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

    // Find summary elements
    const rows = document.querySelectorAll(".summary-row");
    rows.forEach((row) => {
      const labelEl = row.querySelector(".label");
      const valEl = row.querySelector(".val");
      if (!labelEl || !valEl) return;

      const labelText = labelEl.textContent;
      if (labelText.includes("Subtotal")) {
        const isFriday =
          new Date().getDay() === 5 ||
          window.location.search.includes("friday=true") ||
          localStorage.getItem("forceFriday") === "true";
        labelEl.innerHTML = isFriday
          ? `Subtotal (${totalItems} items <span style="color:#e11d48; font-weight:800;">• 50% FRIDAY OFF</span>):`
          : `Subtotal (${totalItems} items):`;
        valEl.textContent = `${subtotal} EGP`;
      } else if (labelText.includes("Delivery Fee")) {
        valEl.textContent = `${deliveryFee} EGP`;
      } else if (labelText.includes("Discount")) {
        valEl.textContent = discount > 0 ? `-${discount} EGP` : `0 EGP`;
      } else if (labelText.includes("Total")) {
        valEl.textContent = `${finalTotal} EGP`;
      }
    });
  }

  // Handle Coupon Application (Only FRIDAYICE is valid)
  if (cartForm) {
    cartForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = cartForm.querySelector("input");
      const code = input ? input.value.trim().toUpperCase() : "";

      let feedback = document.querySelector(".coupon-feedback");
      if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "coupon-feedback";
        feedback.style.fontSize = "0.9rem";
        feedback.style.marginTop = "0.6em";
        feedback.style.fontWeight = "600";
        cartForm.parentNode.insertBefore(feedback, cartForm.nextSibling);
      }

      if (code === "FRIDAYICE") {
        couponApplied = true;
        feedback.style.color = "#22c55e";
        feedback.textContent = "Coupon 'FRIDAYICE' applied! (-10 EGP discount)";
        updateSummary(getCart());
      } else {
        couponApplied = false;
        feedback.style.color = "#ef4444";
        feedback.textContent = "Invalid code. Only 'FRIDAYICE' is valid.";
        updateSummary(getCart());
      }
    });
  }

  // Handle +, -, and delete buttons via event delegation on tbody
  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const plusBtn = e.target.closest(".qty-plus");
      const minusBtn = e.target.closest(".qty-minus");
      const deleteBtn = e.target.closest(".delete-btn");

      let cart = getCart();

      if (plusBtn) {
        const id = plusBtn.closest(".quantity-control").getAttribute("data-id");
        const item = cart.find((i) => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCart(cart);
          renderCart();
        }
      } else if (minusBtn) {
        const id = minusBtn
          .closest(".quantity-control")
          .getAttribute("data-id");
        const item = cart.find((i) => i.id === id);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart = cart.filter((i) => i.id !== id);
          }
          saveCart(cart);
          renderCart();
        }
      } else if (deleteBtn) {
        const id = deleteBtn.getAttribute("data-id");
        cart = cart.filter((i) => i.id !== id);
        saveCart(cart);
        renderCart();
      }
    });
  }

  // Handle Continue Shopping link
  continueShoppingLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "products.html";
    });
  });

  // Handle Checkout Confirmation Modal
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty. Please add some products first!");
        return;
      }

      // Show confirmation modal
      let modalOverlay = document.querySelector(".checkout-modal-overlay");
      if (modalOverlay) {
        modalOverlay.classList.add("active");
        // Empty the cart
        saveCart([]);
        renderCart();
      }
    });
  }

  // Close modal button handler
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest(".checkout-modal-btn");
    if (closeBtn) {
      const overlay = document.querySelector(".checkout-modal-overlay");
      if (overlay) overlay.classList.remove("active");
    }
  });

  // Initial render
  renderCart();
});
