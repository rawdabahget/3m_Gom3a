document.addEventListener("DOMContentLoaded", () => {
  const catBtn = document.querySelector(".cat_btn");
  const catList = document.querySelector(".list");
  const catItems = document.querySelectorAll(".list li");
  const productsGrid = document.querySelector(".products-grid");
  const productCards = Array.from(document.querySelectorAll(".products-grid .product-card"));
  const showingCount = document.querySelector(".showing span");
  const searchInput = document.getElementById("item");
  const sortSelect = document.getElementById("sort");

  productCards.forEach((card, index) => {
    card.setAttribute("data-original-index", index);
  });

  if (catBtn && catList) {
    catBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      catList.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!catBtn.contains(e.target) && !catList.contains(e.target)) {
        catList.classList.remove("show");
      }
    });
  }

  catItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedCategory = item.textContent.trim();
      if (catBtn) {
        catBtn.innerHTML = `${selectedCategory} <i class="fa-solid fa-chevron-down"></i>`;
      }
      catList.classList.remove("show");
      filterAndSortProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterAndSortProducts);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", filterAndSortProducts);
  }

  function applyFridayDiscountToCards() {
    const isFriday =
      new Date().getDay() === 5 ||
      window.location.search.includes("friday=true") ||
      localStorage.getItem("forceFriday") === "true";

    if (!isFriday) return;

    productCards.forEach((card) => {
      const priceEl = card.querySelector(".price");
      if (!priceEl || card.getAttribute("data-friday-applied") === "true") return;

      const origPrice = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ""));
      if (isNaN(origPrice) || origPrice <= 0) return;

      const fridayPrice = Number((origPrice * 0.5).toFixed(2));
      card.setAttribute("data-original-price", origPrice);
      card.setAttribute("data-friday-price", fridayPrice);
      card.setAttribute("data-friday-applied", "true");

      priceEl.innerHTML = `<s style="color: #94a3b8; font-size: 0.8em; margin-right: 5px;">${origPrice} EGP</s><span style="color: #e11d48; font-weight: 800;">${fridayPrice} EGP</span>`;
    });
  }

  applyFridayDiscountToCards();

  function getCardPrice(card) {
    if (card.hasAttribute("data-friday-price")) {
      return parseFloat(card.getAttribute("data-friday-price")) || 0;
    }
    const priceEl = card.querySelector(".price");
    if (!priceEl) return 0;
    const num = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  }

  function getCardRating(card) {
    const ratingEl = card.querySelector(".rating span");
    if (!ratingEl) return 0;
    const num = parseFloat(ratingEl.textContent);
    return isNaN(num) ? 0 : num;
  }

  function filterAndSortProducts() {
    const category = catBtn ? catBtn.textContent.trim() : "All";
    const searchText = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const sortValue = sortSelect ? sortSelect.value : "newest";

    const sortedCards = [...productCards].sort((a, b) => {
      if (sortValue === "low-high") {
        return getCardPrice(a) - getCardPrice(b);
      } else if (sortValue === "high-low") {
        return getCardPrice(b) - getCardPrice(a);
      } else if (sortValue === "popular") {
        return getCardRating(b) - getCardRating(a);
      } else {
        const aNew = a.querySelector(".badge.new") ? 1 : 0;
        const bNew = b.querySelector(".badge.new") ? 1 : 0;
        if (bNew !== aNew) return bNew - aNew;
        return (
          parseInt(a.getAttribute("data-original-index"), 10) -
          parseInt(b.getAttribute("data-original-index"), 10)
        );
      }
    });

    let visibleCount = 0;
    sortedCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const titleEl = card.querySelector(".product-info h3");
      const productName = titleEl ? titleEl.textContent.toLowerCase() : "";

      const matchesCategory =
        category === "All" ||
        category === "Categories" ||
        cardCategory === category;
      const matchesSearch = productName.includes(searchText);

      if (productsGrid) {
        productsGrid.appendChild(card);
      }

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (showingCount) {
      showingCount.textContent = visibleCount;
    }
  }

  document.addEventListener("click", (e) => {
    const addToCartBtn = e.target.closest(".add-to-cart-btn");
    if (!addToCartBtn) return;

    const card = addToCartBtn.closest(".product-card");
    if (!card) return;

    const titleEl = card.querySelector(".product-info h3");
    const name = titleEl ? titleEl.textContent.trim() : "Ice Cream";
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let price = 60;
    if (card.hasAttribute("data-friday-price")) {
      price = parseFloat(card.getAttribute("data-friday-price")) || 30;
    } else {
      const priceEl = card.querySelector(".price");
      price = priceEl
        ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, ""))
        : 60;
    }
    const imgEl = card.querySelector(".product-img img");
    const image = imgEl ? imgEl.getAttribute("src") : "../img/can01.jpg";

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("fridayCart")) || [];
    } catch (err) {
      cart = [];
    }

    const isFriday =
      new Date().getDay() === 5 ||
      window.location.search.includes("friday=true") ||
      localStorage.getItem("forceFriday") === "true";

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
        fridayDiscounted: isFriday,
        originalPrice: isFriday ? price * 2 : price,
      });
    }

    localStorage.setItem("fridayCart", JSON.stringify(cart));

    const originalText = addToCartBtn.innerHTML;
    addToCartBtn.innerHTML = `<i class="fa-solid fa-check" style="color: #22c55e;"></i> Added!`;
    addToCartBtn.style.borderColor = "#22c55e";
    addToCartBtn.style.color = "#22c55e";

    setTimeout(() => {
      addToCartBtn.innerHTML = originalText;
      addToCartBtn.style.borderColor = "";
      addToCartBtn.style.color = "";
    }, 1500);
  });
});