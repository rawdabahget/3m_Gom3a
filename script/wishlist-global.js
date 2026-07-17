document.addEventListener("DOMContentLoaded", () => {
  const wishlistCountBadge = document.querySelector(".wishlist-count");
  const wishlistItemsCount = document.querySelector(".wishlist-items-count");
  const wishlistItemsContainer = document.querySelector(".wishlist-items-container");
  const emptyWishlistMsg = document.querySelector(".empty-wishlist-msg");

  let wishlistItems = [];
  try {
    wishlistItems = JSON.parse(localStorage.getItem("wishlistProducts")) || [];
  } catch (err) {
    wishlistItems = [];
  }

  function updateWishlistDOM() {
    localStorage.setItem("wishlistProducts", JSON.stringify(wishlistItems));
    const totalCount = wishlistItems.length;

    if (totalCount > 0) {
      if (wishlistCountBadge) {
        wishlistCountBadge.textContent = totalCount;
        wishlistCountBadge.style.display = "block";
      }
      if (wishlistItemsCount) {
        wishlistItemsCount.textContent = `${totalCount} item${totalCount > 1 ? 's' : ''}`;
      }
      if (emptyWishlistMsg) emptyWishlistMsg.style.display = "none";
    } else {
      if (wishlistCountBadge) wishlistCountBadge.style.display = "none";
      if (wishlistItemsCount) wishlistItemsCount.textContent = "0 items";
      if (emptyWishlistMsg) emptyWishlistMsg.style.display = "block";
    }

    if (wishlistItemsContainer) {
      const existingCards = wishlistItemsContainer.querySelectorAll(".wishlist-dropdown-item");
      existingCards.forEach(card => card.remove());

      wishlistItems.forEach(item => {
        const itemRow = document.createElement("div");
        itemRow.className = "wishlist-dropdown-item";
        itemRow.dataset.id = item.id;

        itemRow.innerHTML = `
          <div class="wishlist-item-info">
            <img src="${item.img}" alt="${item.name}" class="wishlist-item-img">
            <div class="wishlist-item-details">
              <h4>${item.name}</h4>
              <span class="wishlist-item-price">${item.price}</span>
            </div>
          </div>
          <button class="remove-wishlist-item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        `;

        itemRow.querySelector(".remove-wishlist-item").addEventListener("click", (e) => {
          e.stopPropagation();
          wishlistItems = wishlistItems.filter(fav => fav.id !== item.id);
          updateWishlistDOM();
        });

        wishlistItemsContainer.appendChild(itemRow);
      });
    }

    syncProductCardHearts();
  }

  function syncProductCardHearts() {
    const productCards = document.querySelectorAll(".products-grid .product-card");
    if (!productCards.length) return;

    productCards.forEach((card) => {
      const titleEl = card.querySelector(".product-info h3");
      if (!titleEl) return;
      const name = titleEl.textContent.trim();
      const btn = card.querySelector(".wishlist-btn");
      if (!btn) return;
      const icon = btn.querySelector("i");

      const isFavorite = wishlistItems.some(item => item.id === name);
      if (isFavorite) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        btn.style.color = "#ff4d4d";
      } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        btn.style.color = "";
      }
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".wishlist-btn");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const card = btn.closest(".product-card");
    if (!card) return;

    const titleEl = card.querySelector(".product-info h3");
    const name = titleEl ? titleEl.textContent.trim() : "";
    const priceEl = card.querySelector(".price");
    const price = priceEl ? priceEl.textContent.trim() : "";
    const imgEl = card.querySelector(".product-img img");
    const img = imgEl ? imgEl.getAttribute("src") : "";

    const index = wishlistItems.findIndex(item => item.id === name);
    if (index === -1) {
      wishlistItems.push({ id: name, name, price, img });
    } else {
      wishlistItems.splice(index, 1);
    }

    updateWishlistDOM();
  });

  updateWishlistDOM();

  window.addEventListener("storage", (e) => {
    if (e.key === "wishlistProducts") {
      try {
        wishlistItems = JSON.parse(e.newValue) || [];
        updateWishlistDOM();
      } catch (err) {}
    }
  });
});