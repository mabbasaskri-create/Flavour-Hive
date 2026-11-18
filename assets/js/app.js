const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const money = (n) => "Rs " + Number(n).toLocaleString("en-PK");

const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
};

const state = {
  cart: readStore("ddp_cart_v1", []),
  favs: new Set(readStore("ddp_favs_v1", [])),
  mode: readStore("ddp_mode_v1", null),
  selections: {},
  category: "all",
  query: "",
  slide: 0,
  slideTimer: null,
  review: 0,
  reviewTimer: null,
  modal: null,
};

const REVIEW_INTERVAL = 2000;
const reviewMq = window.matchMedia("(max-width: 720px)");

const heartSvg = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>`;
const heartFilled = `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>`;
const plusSvg = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`;
const starSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1Z"/></svg>`;

function imageTag(src, alt, extra = "") {
  return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" ${extra}>`;
}

function productPrice(product, sel) {
  if (product.prices) {
    const sizeKey = sel.size || (product.cat === "fries" ? "half" : "M");
    let basePrice = product.prices[sizeKey] || 0;
    if (product.cat === "pizza" && product.kind !== "topping" && sel.extraTopping) {
      basePrice += EXTRA_TOPPING_PRICE[sizeKey] || 0;
    }
    return basePrice;
  }
  return product.base || 0;
}

function getSelection(product) {
  if (!state.selections[product.id]) {
    if (product.cat === "pizza") {
      state.selections[product.id] = { size: "M", extraTopping: false };
    } else if (product.cat === "fries" && product.prices) {
      state.selections[product.id] = { size: "half" };
    } else {
      state.selections[product.id] = {};
    }
  }
  return state.selections[product.id];
}

function updateCard(product) {
  const card = $(`[data-product="${product.id}"]`);
  if (!card) return;
  const sel = getSelection(product);
  const labels = product.cat === "pizza" ? PIZZA_SIZES : FRIES_SIZES;

  $$(".size", card).forEach((b) => b.classList.toggle("active", b.dataset.size === sel.size));
  const labelEl = $(".price .unit", card);
  if (labelEl) labelEl.textContent = product.prices ? labels[sel.size]?.label || "" : "";
  const priceEl = $(".price b", card);
  if (priceEl) priceEl.textContent = money(productPrice(product, sel));
}

function modalTotal() {
  if (!state.modal) return 0;
  const product = MENU.find((p) => p.id === state.modal.id);
  if (!product) return 0;
  const sel = getSelection(product);
  return state.modal.extras.reduce((total, id) => {
    const extra = EXTRAS.find((e) => e.id === id);
    return extra ? total + extra.price : total;
  }, productPrice(product, sel));
}

function renderProductModal() {
  const body = $("#pmBody");
  if (!state.modal || !body) return;
  const product = MENU.find((p) => p.id === state.modal.id);
  if (!product) return;

  const sel = getSelection(product);
  const isPizza = product.cat === "pizza";
  const isSized = !!product.prices;
  const selected = state.modal.extras;

  const infoHtml = product.items
    ? `<div class="chips product-items">${product.items.map((i) => `<span class="chip">${i}</span>`).join("")}</div>`
    : product.desc
    ? `<p class="pm-desc">${product.desc}</p>`
    : "";

  const sizeHtml = isSized
    ? `<div class="pm-block">
        <span class="pm-label">Choose size</span>
        <div class="sizes size-price">${sizeButtons(product, sel)}</div>
      </div>`
    : "";

  const toppingHtml = isPizza
    ? `<div class="pm-block">
        <span class="pm-label">Extra Toppings</span>
        <button type="button" class="pm-extra ${sel.extraTopping ? "active" : ""}" data-pm-topping>
          <span>${sel.extraTopping ? "Remove Extra Toppings" : "Add Extra Toppings"}</span>
          <b>+${money(EXTRA_TOPPING_PRICE[sel.size])}</b>
        </button>
      </div>`
    : "";

  const addonsHtml = `
    <div class="pm-block">
      <span class="pm-label">Add Extras</span>
      <div class="pm-addons">
        ${EXTRAS.map((extra) => {
          const active = selected.includes(extra.id);
          return `<button type="button" class="pm-addon ${active ? "active" : ""}" data-pm-addon="${extra.id}">
            <span class="pm-addon-check">${active ? "&#10003;" : "+"}</span>
            <span class="pm-addon-name">${extra.name}</span>
            <span class="pm-addon-price">${money(extra.price)}</span>
          </button>`;
        }).join("")}
      </div>
    </div>`;

  body.innerHTML = `
    <div class="pm-media">${imageTag(product.img, product.name)}</div>
    <div class="pm-content">
      <h2>${product.name}</h2>
      <div class="pm-price"><span>Total</span><b>${money(modalTotal())}</b></div>
      ${infoHtml}
      ${sizeHtml}
      ${toppingHtml}
      ${addonsHtml}
    </div>
    <div class="pm-foot">
      <button type="button" class="btn btn-yellow btn-lg pm-add-btn" data-pm-add>
        ${plusSvg} Add to cart &middot; ${money(modalTotal())}
      </button>
    </div>`;
}

function openProductModal(id) {
  state.modal = { id, extras: [] };
  $("#pmBody").scrollTop = 0;
  $("#pmModal").classList.add("open");
  $("#pmOverlay").classList.add("open");
  $("#pmModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  renderProductModal();
}

function closeProductModal() {
  const id = state.modal?.id;
  $("#pmModal").classList.remove("open");
  $("#pmOverlay").classList.remove("open");
  $("#pmModal").setAttribute("aria-hidden", "true");
  if (!$("#cartDrawer").classList.contains("open")) {
    document.body.classList.remove("no-scroll");
  }
  state.modal = null;
  if (id) {
    const product = MENU.find((p) => p.id === id);
    if (product) updateCard(product);
  }
}

function bindProductModal() {
  $("#pmOverlay").addEventListener("click", closeProductModal);
  $("#pmClose").addEventListener("click", closeProductModal);
  $("#pmBody").addEventListener("click", (e) => {
    if (!state.modal) return;
    const product = MENU.find((p) => p.id === state.modal.id);
    if (!product) return;
    const sel = getSelection(product);

    const sizeBtn = e.target.closest("[data-size]");
    if (sizeBtn) {
      sel.size = sizeBtn.dataset.size;
      renderProductModal();
      return;
    }

    const toppingBtn = e.target.closest("[data-pm-topping]");
    if (toppingBtn) {
      sel.extraTopping = !sel.extraTopping;
      renderProductModal();
      return;
    }

    const addonBtn = e.target.closest("[data-pm-addon]");
    if (addonBtn) {
      const id = addonBtn.dataset.pmAddon;
      const index = state.modal.extras.indexOf(id);
      if (index >= 0) state.modal.extras.splice(index, 1);
      else state.modal.extras.push(id);
      renderProductModal();
      return;
    }

    if (e.target.closest("[data-pm-add]")) {
      const isPizza = product.cat === "pizza";
      const labels = product.cat === "pizza" ? PIZZA_SIZES : FRIES_SIZES;
      const extras = state.modal.extras
        .map((id) => EXTRAS.find((x) => x.id === id))
        .filter(Boolean);
      const details = [];
      if (product.prices) details.push(labels[sel.size]?.label);
      if (isPizza && sel.extraTopping) details.push("Extra Toppings");
      extras.forEach((extra) => details.push(extra.name));

      addToCart({
        id: product.id,
        name: product.name,
        img: product.img,
        price: modalTotal(),
        size: product.prices ? sel.size : "",
        sizeLabel: details.filter(Boolean).join(" + "),
        option: isPizza && sel.extraTopping ? "extra-topping" : "",
        extras,
      });
      closeProductModal();
    }
  });
}

function heroMarkup(slide) {
  return `
    <span class="hero-kicker">${slide.kicker}</span>
    <h1>${slide.line1}<br><em>${slide.line2}</em></h1>
    <p>${slide.text}</p>
    <div class="hero-actions">
      <a href="#menu" class="btn btn-yellow btn-lg">${plusSvg} Order Now</a>
      <a href="#deals" class="btn btn-ghost btn-lg" style="color:#fff;border-color:rgba(255,255,255,.32)">View Deals</a>
    </div>
    <div class="hero-meta">
      <div><b>30 min</b><span>Average delivery</span></div>
      <div><b>20</b><span>Value deals</span></div>
      <div><b>Rs 500</b><span>Minimum delivery</span></div>
    </div>`;
}

function renderHero() {
  const slidesEl = $("#heroSlides");
  const dotsEl = $("#heroDots");
  const copy = $("#heroCopy");
  slidesEl.innerHTML = HERO_SLIDES.map(
    (s, i) =>
      `<div class="hero-slide ${i === 0 ? "active" : ""}" style="--img:url('${new URL(s.img, document.baseURI).href}')" aria-hidden="${i !== 0}"></div>`
  ).join("");
  dotsEl.innerHTML = HERO_SLIDES.map(
    (_, i) =>
      `<button type="button" class="${i === 0 ? "active" : ""}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
  ).join("");
  copy.innerHTML = heroMarkup(HERO_SLIDES[0]);

  dotsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-slide]");
    if (!btn) return;
    goToSlide(Number(btn.dataset.slide));
  });
  $("#heroPrev").addEventListener("click", () => goToSlide(state.slide - 1));
  $("#heroNext").addEventListener("click", () => goToSlide(state.slide + 1));
  startSlideshow();
}

function goToSlide(index) {
  const total = HERO_SLIDES.length;
  state.slide = (index + total) % total;
  const slides = $$("#heroSlides .hero-slide");
  const dots = $$("#heroDots button");
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === state.slide);
    s.setAttribute("aria-hidden", i !== state.slide);
  });
  dots.forEach((d, i) => d.classList.toggle("active", i === state.slide));
  const copy = $("#heroCopy");
  copy.style.opacity = "0";
  copy.style.transform = "translateY(10px)";
  window.setTimeout(() => {
    copy.innerHTML = heroMarkup(HERO_SLIDES[state.slide]);
    copy.style.opacity = "1";
    copy.style.transform = "none";
  }, 180);
  startSlideshow();
}

function startSlideshow() {
  window.clearInterval(state.slideTimer);
  state.slideTimer = window.setInterval(() => goToSlide(state.slide + 1), 2000);
}

function categoryButtons(className) {
  return CATEGORIES.map(
    (c) => `<button type="button" class="${className} ${c.id === state.category ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`
  ).join("");
}

function renderTabs() {
  $("#menuTabs").innerHTML = categoryButtons("tab");
  $("#navCategoryMenu").innerHTML = categoryButtons("nav-cat-option");
}

function closeNavCategoryMenu() {
  $("#navCategoryMenu").classList.remove("open");
  $("#navCategoryToggle").setAttribute("aria-expanded", "false");
}

function closeSocialPopover() {
  $("#socialPopover").classList.remove("open");
  $("#socialPopover").setAttribute("aria-hidden", "true");
  $("#socialToggle").setAttribute("aria-expanded", "false");
}

function setCategory(id, scroll) {
  state.category = id;
  $$("[data-cat]").forEach((btn) => btn.classList.toggle("active", btn.dataset.cat === id));
  renderMenu();
  if (scroll) {
    $(id === "deals" ? "#deals" : "#menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function sizeButtons(product, sel) {
  const isPizza = product.cat === "pizza";
  const sizes = isPizza ? PIZZA_SIZES : FRIES_SIZES;
  return Object.entries(sizes)
    .map(
      ([key, value]) => `
      <button type="button" class="size ${key === sel.size ? "active" : ""}" data-size="${key}">
        <span class="size-name">${value.name}</span>
        ${value.inches ? `<span class="size-sub">${value.inches}</span>` : ""}
        <span class="size-amount">${money(product.prices[key])}</span>
      </button>`
    )
    .join("");
}

function productCard(product) {
  const sel = getSelection(product);
  const price = productPrice(product, sel);
  const liked = state.favs.has(product.id);
  const isPizza = product.cat === "pizza";
  const isSized = !!product.prices;
  const labels = isPizza ? PIZZA_SIZES : FRIES_SIZES;
  const unit = isSized ? labels[sel.size]?.label || "" : "";

  const sizeRow = isSized
    ? `<div class="sizes">${Object.entries(labels)
        .map(
          ([key, val]) =>
            `<button type="button" class="size ${key === sel.size ? "active" : ""}" data-size="${key}">${val.name.charAt(0)}</button>`
        )
        .join("")}</div>`
    : "";

  const desc =
    product.desc ||
    (product.items ? product.items.join(" + ") : "") ||
    (product.toppings ? product.toppings.join(", ") : "");

  const tagClass = product.tag === "New" ? "green" : product.tag === "Hot" ? "hot" : product.tag === "Veg" ? "green" : "";

  return `
    <article class="product" data-product="${product.id}">
      <div class="product-media">
        ${imageTag(product.img, product.name)}
        ${product.tag ? `<span class="badge ${tagClass}">${product.tag}</span>` : ""}
        <button type="button" class="fav ${liked ? "liked" : ""}" data-fav="${product.id}" aria-label="Save ${product.name}">${liked ? heartFilled : heartSvg}</button>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="desc">${desc}</p>
        ${sizeRow}
        <div class="product-foot">
          <div class="price">
            ${unit ? `<span class="unit">${unit}</span>` : ""}
            <b>${money(price)}</b>
          </div>
          <button type="button" class="add-btn" data-add="${product.id}" aria-label="Add ${product.name} to cart">${plusSvg}</button>
        </div>
      </div>
    </article>`;
}

function renderMenu() {
  const grid = $("#menuGrid");
  grid.dataset.cat = state.category;
  if (state.category === "deals") {
    grid.innerHTML = `<div class="empty-state deals-callout"><b>20 value deals</b><p>All combo deals are listed in the Value Deals section.</p><a href="#deals" class="btn btn-yellow">Jump to deals</a></div>`;
    return;
  }
  const q = state.query.trim().toLowerCase();
  const list = MENU.filter(
    (p) =>
      (state.category === "all" || p.cat === state.category) &&
      (!q ||
        p.name.toLowerCase().includes(q) ||
        (p.desc || "").toLowerCase().includes(q) ||
        (p.toppings || []).join(" ").toLowerCase().includes(q) ||
        (p.items || []).join(" ").toLowerCase().includes(q))
  );
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><b>Nothing on the menu</b><p>Try a different search or category.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(productCard).join("");
}

function dealCard(deal) {
  return `
    <article class="deal">
      <div class="deal-media">
        ${imageTag(deal.img, deal.title)}
        <span class="deal-save">Deal ${deal.num}</span>
      </div>
      <div class="deal-body">
        <h3>${deal.title}</h3>
        <ul class="deal-items">${deal.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        <div class="deal-foot">
          <div class="deal-price"><b>${money(deal.price)}</b></div>
          <button type="button" class="deal-add" data-add-deal="${deal.id}" aria-label="Add Deal ${deal.num} to cart">${plusSvg}</button>
        </div>
      </div>
    </article>`;
}

function renderDeals() {
  $("#dealGrid").innerHTML = DEALS.map(dealCard).join("");
}

function renderGallery() {
  $("#galleryGrid").innerHTML = GALLERY.map(
    (g) => `<figure class="gallery-item ${g.cls || ""}">${imageTag(g.img, g.label)}<span>${g.label}</span></figure>`
  ).join("");
}

function reviewItems() {
  return $$("#reviewGrid .review");
}

function setReview(index) {
  const items = reviewItems();
  if (!items.length) return;
  state.review = (index + items.length) % items.length;
  items.forEach((el, i) => el.classList.toggle("is-active", i === state.review));
  const count = $("#reviewCount");
  if (count) count.textContent = `${state.review + 1} / ${items.length}`;
}

function stopReviewTimer() {
  window.clearInterval(state.reviewTimer);
  state.reviewTimer = null;
}

function startReviewTimer() {
  stopReviewTimer();
  if (!reviewMq.matches) return;
  state.reviewTimer = window.setInterval(() => setReview(state.review + 1), REVIEW_INTERVAL);
}

function renderReviews() {
  $("#reviewGrid").innerHTML = REVIEWS.map(
    (r) => `
    <article class="review">
      <div class="stars">${Array(5).fill(starSvg).join("")}</div>
      <p>"${r.text}"</p>
      <div class="reviewer">
        <span class="avatar">${r.name.charAt(0)}</span>
        <div><b>${r.name}</b><span>${r.meta}</span></div>
      </div>
    </article>`
  ).join("");
  setReview(state.review);
  startReviewTimer();
}

function persistCart() {
  writeStore("ddp_cart_v1", state.cart);
}

function persistFavs() {
  writeStore("ddp_favs_v1", Array.from(state.favs));
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart({ id, name, img, price, size = "", sizeLabel = "", option = "", extras = [] }) {
  const extrasKey = extras
    .map((extra) => extra.id)
    .sort()
    .join("|");
  const key = `${id}::${size}::${option}::${extrasKey}`;
  const existing = state.cart.find((i) => i.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ key, id, name, img, price, size, sizeLabel, qty: 1 });
  }
  persistCart();
  updateCart();
  showToast(`${name} added to your order`);
}

function changeQty(key, delta) {
  const item = state.cart.find((i) => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((i) => i.key !== key);
  }
  persistCart();
  updateCart();
}

function updateCart() {
  const count = cartCount();
  const subtotal = cartSubtotal();
  const isPickup = state.mode === "pickup";
  const belowMin = !isPickup && subtotal > 0 && subtotal < SITE.minDelivery;
  const delivery = isPickup || subtotal === 0 || subtotal >= SITE.freeDeliveryOver ? 0 : SITE.deliveryFee;
  const total = subtotal + delivery;

  $$(".cart-count").forEach((el) => {
    el.textContent = count;
    el.dataset.empty = count === 0 ? "true" : "false";
  });
  const headCount = $("#cartHeadCount");
  if (headCount) headCount.textContent = count;

  const itemsEl = $("#cartItems");
  if (!state.cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
        </div>
        <b>Your cart is empty</b>
        <p>Add a pizza, a deal or a late-night snack to get started.</p>
        <a href="#menu" class="btn btn-yellow" data-close-cart>Browse the menu</a>
      </div>`;
  } else {
    itemsEl.innerHTML = state.cart
      .map(
        (item) => `
      <div class="cart-item">
        ${imageTag(item.img, item.name)}
        <div class="cart-item-info">
          <b>${item.name}</b>
          ${item.sizeLabel ? item.sizeLabel.split(" + ").map((part) => `<span>${part}</span>`).join("") : ""}
          <strong>${money(item.price * item.qty)}</strong>
        </div>
        <div class="qty">
          <button type="button" data-qty="-1" data-key="${item.key}" aria-label="Decrease quantity">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12h14"/></svg>
          </button>
          <b>${item.qty}</b>
          <button type="button" data-qty="1" data-key="${item.key}" aria-label="Increase quantity">${plusSvg}</button>
        </div>
      </div>`
      )
      .join("");
  }

  $("#cartSubtotal").textContent = money(subtotal);
  $("#cartDelivery").textContent = isPickup ? "Free (pickup)" : delivery === 0 ? "Free" : money(delivery);
  $("#cartTotal").textContent = money(total);

  const note = $("#freeShipNote");
  if (isPickup) {
    note.textContent = "Pickup from 17-B, Comm. Sher Shah Colony, Raiwind Road";
    note.className = "free-ship";
  } else if (subtotal === 0) {
    note.textContent = `Minimum delivery ${money(SITE.minDelivery)} - free delivery over ${money(SITE.freeDeliveryOver)}`;
    note.className = "free-ship pending";
  } else if (belowMin) {
    note.textContent = `Add ${money(SITE.minDelivery - subtotal)} more to reach the ${money(SITE.minDelivery)} minimum delivery order`;
    note.className = "free-ship pending";
  } else if (delivery === 0) {
    note.textContent = "You unlocked free delivery";
    note.className = "free-ship";
  } else {
    note.textContent = `Add ${money(SITE.freeDeliveryOver - subtotal)} more for free delivery`;
    note.className = "free-ship pending";
  }

  const empty = state.cart.length === 0;
  $("#checkoutBtn").disabled = empty || belowMin;
  $("#checkoutBtn").style.opacity = empty || belowMin ? "0.55" : "1";
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartOverlay").classList.add("open");
  document.body.classList.add("no-scroll");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartOverlay").classList.remove("open");
  document.body.classList.remove("no-scroll");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
}

function updateModeUI() {
  const isPickup = state.mode === "pickup";
  const label = isPickup ? "Pickup" : "Delivery";
  const cartLabel = isPickup ? "Pickup - Sher Shah Colony" : "Delivery";
  const topLabel = $("#modeBtnLabel");
  if (topLabel) topLabel.textContent = label;
  const cartModeLabel = $("#cartModeLabel");
  if (cartModeLabel) cartModeLabel.textContent = cartLabel;
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  $("#toastText").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function checkout() {
  if (!state.cart.length) {
    showToast("Your cart is empty. Add something tasty first.");
    return;
  }
  const subtotal = cartSubtotal();
  const isPickup = state.mode === "pickup";
  if (!isPickup && subtotal < SITE.minDelivery) {
    showToast(`Minimum delivery order is ${money(SITE.minDelivery)}.`);
    return;
  }

  const itemLines = state.cart.map((item, index) => {
    const labels = item.size ? PIZZA_SIZES[item.size] || FRIES_SIZES[item.size] : null;
    const sizeLabel = labels?.label || "";
    const isDeal = DEALS.some((deal) => deal.id === item.id);
    const parts = (item.sizeLabel || "").split(" + ").filter(Boolean);
    const toppingParts = isDeal ? [] : parts.filter((part) => part !== sizeLabel);

    let line = `${index + 1}. ${item.name}`;
    if (sizeLabel) line += `, Size: ${sizeLabel}`;
    if (toppingParts.length) line += `, with toppings: ${toppingParts.join(", ")}`;
    return line;
  });

  const message = ["Assalam-o-Alikum Sir, Sir I have To order", ...itemLines].join("\n");

  const waUrl = `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

function bindEvents() {
  $("#navCategoryToggle").addEventListener("click", () => {
    const menu = $("#navCategoryMenu");
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    $("#navCategoryToggle").setAttribute("aria-expanded", String(open));
  });

  $(".nav-dropdown > a").addEventListener("click", closeNavCategoryMenu);

  $("#socialToggle").addEventListener("click", () => {
    const popover = $("#socialPopover");
    const open = !popover.classList.contains("open");
    popover.classList.toggle("open", open);
    popover.setAttribute("aria-hidden", String(!open));
    $("#socialToggle").setAttribute("aria-expanded", String(open));
  });

  $$("#socialPopover a").forEach((link) => link.addEventListener("click", closeSocialPopover));

  document.addEventListener("click", (e) => {
    const catBtn = e.target.closest("[data-cat]");
    if (catBtn) {
      const fromHeader = !!catBtn.closest("#navCategoryMenu");
      setCategory(catBtn.dataset.cat, fromHeader || catBtn.dataset.cat === "deals");
      closeNavCategoryMenu();
      return;
    }
    if (!e.target.closest(".nav-dropdown")) closeNavCategoryMenu();
    if (!e.target.closest("#floatingSocial")) closeSocialPopover();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNavCategoryMenu();
      closeSocialPopover();
    }
  });

  $("#menuSearch").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderMenu();
  });

  $("#menuGrid").addEventListener("click", (e) => {
    const card = e.target.closest("[data-product]");

    const sizeBtn = e.target.closest("[data-size]");
    if (sizeBtn && card) {
      const product = MENU.find((p) => p.id === card.dataset.product);
      getSelection(product).size = sizeBtn.dataset.size;
      updateCard(product);
      return;
    }

    const extraBtn = e.target.closest("[data-extra]");
    if (extraBtn && card) {
      const product = MENU.find((p) => p.id === card.dataset.product);
      const sel = getSelection(product);
      sel.extraTopping = !sel.extraTopping;
      updateCard(product);
      return;
    }

    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) {
      const id = favBtn.dataset.fav;
      if (state.favs.has(id)) {
        state.favs.delete(id);
        favBtn.classList.remove("liked");
        favBtn.innerHTML = heartSvg;
      } else {
        state.favs.add(id);
        favBtn.classList.add("liked");
        favBtn.innerHTML = heartFilled;
        showToast("Saved to your favourites");
      }
      persistFavs();
      return;
    }

    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      const product = MENU.find((p) => p.id === addBtn.dataset.add);
      const sel = getSelection(product);
      const price = productPrice(product, sel);
      const isPizza = product.cat === "pizza" && product.kind !== "topping";
      const labels = product.cat === "pizza" ? PIZZA_SIZES : FRIES_SIZES;
      const details = [];
      if (product.prices) details.push(labels[sel.size]?.label);
      if (isPizza && sel.extraTopping) details.push("Extra Toppings");

      addToCart({
        id: product.id,
        name: product.name,
        img: product.img,
        price,
        size: product.prices ? sel.size : "",
        sizeLabel: details.filter(Boolean).join(" + "),
        option: isPizza && sel.extraTopping ? "extra-topping" : "",
      });
      return;
    }

    if (card) openProductModal(card.dataset.product);
  });

  $("#dealGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-deal]");
    if (!btn) return;
    const deal = DEALS.find((d) => d.id === btn.dataset.addDeal);
    addToCart({
      id: deal.id,
      name: `Deal ${deal.num}: ${deal.title}`,
      img: deal.img,
      price: deal.price,
      sizeLabel: deal.items.join(" + "),
    });
  });

  const modeBtn = $(".mode-btn");
  if (modeBtn) {
    modeBtn.addEventListener("click", () => {
      state.mode = state.mode === "pickup" ? "delivery" : "pickup";
      writeStore("ddp_mode_v1", state.mode);
      updateModeUI();
      updateCart();
    });
  }

  $$("[data-open-cart]").forEach((btn) => btn.addEventListener("click", openCart));
  $("#cartClose").addEventListener("click", closeCart);
  $("#cartOverlay").addEventListener("click", closeCart);
  $("#cartItems").addEventListener("click", (e) => {
    const close = e.target.closest("[data-close-cart]");
    if (close) {
      closeCart();
      return;
    }
    const btn = e.target.closest("[data-qty]");
    if (!btn) return;
    changeQty(btn.dataset.key, Number(btn.dataset.qty));
  });
  $("#checkoutBtn").addEventListener("click", checkout);

  bindProductModal();

  $("#reviewPrev")?.addEventListener("click", () => {
    setReview(state.review - 1);
    startReviewTimer();
  });
  $("#reviewNext")?.addEventListener("click", () => {
    setReview(state.review + 1);
    startReviewTimer();
  });
  const onReviewMqChange = () => {
    if (reviewMq.matches) startReviewTimer();
    else stopReviewTimer();
  };
  if (reviewMq.addEventListener) reviewMq.addEventListener("change", onReviewMqChange);
  else if (reviewMq.addListener) reviewMq.addListener(onReviewMqChange);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      if (state.modal) closeProductModal();
    }
  });

  const header = $("#siteHeader");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const sections = $$("main section[id]");
  const navLinks = $$(".main-nav a");
  const observedSections = sections.filter((section) =>
    navLinks.some((link) => link.getAttribute("href") === `#${section.id}`)
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  observedSections.forEach((s) => observer.observe(s));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (img && img.tagName === "IMG" && !img.dataset.fallback) {
      img.dataset.fallback = "true";
      img.removeAttribute("loading");
      img.src = "assets/img/logo.png";
      img.style.objectFit = "contain";
      img.style.padding = "22%";
      img.style.background = "#fff2bf";
    }
  },
  true
);

renderHero();
renderTabs();
renderMenu();
renderDeals();
renderGallery();
renderReviews();
bindEvents();
updateModeUI();
updateCart();
