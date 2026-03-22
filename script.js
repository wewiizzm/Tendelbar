const filtersContainer = document.getElementById("filters");
const menuSection = document.getElementById("menu");
let menuCards = menuSection
  ? Array.from(menuSection.querySelectorAll(".item"))
  : [];
const orderModal = document.getElementById("orderModal");
const closeOrderModalButton = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const itemSelect = document.getElementById("itemSelect");
const itemQuantityInput = document.getElementById("itemQuantity");
const addItemButton = document.getElementById("addItemButton");
const cartItemsContainer = document.getElementById("cartItems");
const cartEmptyText = document.getElementById("cartEmpty");
const orderForm = document.getElementById("orderForm");
const pickupTimeInput = document.getElementById("pickupTime");
const orderNotesInput = document.getElementById("orderNotes");
const customerNameInput = document.getElementById("customerName");
const orderTotalText = document.getElementById("orderTotal");
const submitOrderButton = orderForm?.querySelector(".submit-order");
const ordersPausedBanner = document.getElementById("ordersPausedBanner");
const ordersOnlineBanner = document.getElementById("ordersOnlineBanner");
const ordersScheduleBadge = document.getElementById("ordersScheduleBadge");

const PUBLIC_WHATSAPP_NUMBER_STORAGE_KEY = "tendel_public_whatsapp_number";
const ORDERS_PAUSED_STORAGE_KEY = "tendel_orders_paused";
const ORDERS_OPEN_TIME_STORAGE_KEY = "tendel_orders_open_time";
const ORDERS_CLOSE_TIME_STORAGE_KEY = "tendel_orders_close_time";
const LEGACY_ORDERS_CUTOFF_TIME_STORAGE_KEY = "tendel_orders_cutoff_time";
const MENU_CATALOG_STORAGE_KEY = "tendel_menu_catalog";
const MENU_CATEGORIES_STORAGE_KEY = "tendel_menu_categories";
const ORDER_HISTORY_STORAGE_KEY = "tendel_order_history";
const PUBLIC_STATE_ENDPOINT = "/api/state";
const CREATE_ORDER_ENDPOINT = "/api/orders";
const DEFAULT_ORDERS_OPEN_TIME = "19:00";
const DEFAULT_ORDERS_CLOSE_TIME = "23:00";
const DEFAULT_MENU_CATEGORIES = [
  { id: "lanches", label: "Lanches", hidden: false },
  { id: "pratos", label: "Pratos", hidden: false },
  { id: "bebidas", label: "Bebidas", hidden: false },
  { id: "sobremesas", label: "Sobremesas", hidden: false },
];

let menuCategories = DEFAULT_MENU_CATEGORIES.map((category) => ({
  ...category,
}));
let cart = [];
let ordersPaused = false;
let ordersOpenTime = DEFAULT_ORDERS_OPEN_TIME;
let ordersCloseTime = DEFAULT_ORDERS_CLOSE_TIME;
let whatsappNumber = "";
let activeMenuFilter = "todos";
let availabilityTimerId = null;
let stateRefreshTimerId = null;
let lastOrderModalTrigger = null;

function normalizeCategoryId(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCategoryLabel(value, fallback = "Categoria") {
  const normalized = String(value || "")
    .trim()
    .replace(/\s+/g, " ");
  return normalized || fallback;
}

function categoryLabelFromId(categoryId) {
  const words = String(categoryId || "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);
  return words.join(" ") || "Categoria";
}

function ensureCategoryExists(categoryId, categoryLabel) {
  const normalizedId = normalizeCategoryId(categoryId);
  if (!normalizedId) {
    return null;
  }
  const existing = menuCategories.find(
    (category) => category.id === normalizedId,
  );
  if (existing) {
    return existing.id;
  }
  menuCategories.push({
    id: normalizedId,
    label: formatCategoryLabel(
      categoryLabel,
      categoryLabelFromId(normalizedId),
    ),
    hidden: false,
  });
  return normalizedId;
}

function getDefaultCategoryId() {
  return (
    menuCategories.find((category) => !category.hidden)?.id ||
    menuCategories[0]?.id ||
    "lanches"
  );
}

function normalizeMenuCategory(value, fallback = getDefaultCategoryId()) {
  const normalized = normalizeCategoryId(value);
  if (
    normalized &&
    menuCategories.some((category) => category.id === normalized)
  ) {
    return normalized;
  }
  return fallback;
}

function getCategoryLabel(categoryId) {
  const normalized = normalizeCategoryId(categoryId);
  const found = menuCategories.find((category) => category.id === normalized);
  return found?.label || categoryLabelFromId(normalized);
}

function isCategoryHidden(categoryId) {
  const normalized = normalizeCategoryId(categoryId);
  return Boolean(
    menuCategories.find((category) => category.id === normalized)?.hidden,
  );
}

function isValidFilter(filter) {
  return (
    filter === "todos" ||
    menuCategories.some(
      (category) => category.id === filter && !category.hidden,
    )
  );
}

function parseBRL(priceText) {
  const sanitized = String(priceText || "")
    .trim()
    .replace(/[^\d,.-]/g, "");
  if (!sanitized) {
    return 0;
  }
  let numeric = sanitized;
  if (numeric.includes(",") && numeric.includes(".")) {
    numeric = numeric.replace(/\./g, "").replace(",", ".");
  } else if (numeric.includes(",")) {
    numeric = numeric.replace(",", ".");
  }
  const value = Number.parseFloat(numeric);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload?.error || "Nao foi possivel concluir a requisicao.",
    );
  }
  return payload;
}

function normalizeWhatsappNumber(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function isIosSafari() {
  const userAgent = window.navigator.userAgent;
  const isAppleTouchDevice =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1);
  return (
    isAppleTouchDevice &&
    /Safari/i.test(userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent)
  );
}

function buildWhatsappWebUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function openWhatsappConversation(message) {
  const webUrl = buildWhatsappWebUrl(message);
  window.location.href = webUrl;
}

function formatPickupTime(value) {
  if (!value || !value.includes(":")) {
    return value || "-";
  }
  const [hours, minutes] = value.split(":");
  return `${hours}:${minutes}`;
}

function normalizeTimeValue(value, fallback = "00:00") {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  if (!/^\d{2}:\d{2}$/.test(trimmed)) {
    return fallback;
  }
  const [hoursText, minutesText] = trimmed.split(":");
  const hours = Number.parseInt(hoursText, 10);
  const minutes = Number.parseInt(minutesText, 10);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return fallback;
  }
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return fallback;
  }
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function timeToMinutes(value) {
  if (!value || !value.includes(":")) {
    return null;
  }
  const [hoursText, minutesText] = value.split(":");
  const hours = Number.parseInt(hoursText, 10);
  const minutes = Number.parseInt(minutesText, 10);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

function formatHourLabel(value) {
  const normalized = normalizeTimeValue(value, "00:00");
  return normalized.endsWith(":00") ? `${normalized.slice(0, 2)}h` : normalized;
}

function getScheduleWindowLabel() {
  return `${formatHourLabel(ordersOpenTime)} às ${formatHourLabel(ordersCloseTime)}`;
}

function isWithinScheduleNow() {
  const openMinutes = timeToMinutes(ordersOpenTime);
  const closeMinutes = timeToMinutes(ordersCloseTime);
  if (
    openMinutes === null ||
    closeMinutes === null ||
    openMinutes === closeMinutes
  ) {
    return true;
  }
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (openMinutes < closeMinutes) {
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }
  return nowMinutes >= openMinutes || nowMinutes <= closeMinutes;
}

function areOrdersBlocked() {
  return ordersPaused || !isWithinScheduleNow();
}

function setDefaultPickupTime() {
  if (!pickupTimeInput) {
    return;
  }
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  pickupTimeInput.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getItemsSubtotal() {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function sanitizeMenuText(value, fallback) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || fallback;
}

const seedMenuCatalog = menuCards.map((card, index) => {
  const itemId = `item-${index + 1}`;
  const title =
    card.querySelector("h2")?.textContent?.trim() || `Item ${index + 1}`;
  const priceText =
    card.querySelector(".price")?.textContent?.trim() || "R$ 0,00";
  const ingredients =
    card.dataset.ingredients || "Ingredientes não informados.";
  const category =
    ensureCategoryExists(card.dataset.category, "") || getDefaultCategoryId();
  card.dataset.itemId = itemId;
  card.dataset.category = category;
  return {
    id: itemId,
    title,
    priceText,
    unitPrice: parseBRL(priceText),
    ingredients,
    category,
    hidden: card.dataset.hidden === "1",
    outOfStock: card.dataset.outOfStock === "1",
  };
});

const menuCatalog = [];
const menuById = new Map();

function resetMenuCatalogToSeed() {
  menuCatalog.length = 0;
  menuById.clear();
  seedMenuCatalog.forEach((item) => {
    const copy = { ...item };
    menuCatalog.push(copy);
    menuById.set(copy.id, copy);
  });
}

function getMenuCategoriesPayload() {
  const payload = [];
  const usedIds = new Set();
  menuCategories.forEach((category) => {
    const id = normalizeCategoryId(category?.id);
    if (!id || usedIds.has(id)) {
      return;
    }
    payload.push({
      id,
      label: formatCategoryLabel(category?.label, categoryLabelFromId(id)),
      hidden: Boolean(category?.hidden),
    });
    usedIds.add(id);
  });
  return payload.length > 0
    ? payload
    : DEFAULT_MENU_CATEGORIES.map((category) => ({ ...category }));
}

function getMenuCatalogPayload() {
  return menuCatalog.map((item) => ({
    id: item.id,
    category: item.category,
    categoryLabel: getCategoryLabel(item.category),
    title: item.title,
    ingredients: item.ingredients,
    unitPrice: item.unitPrice,
    hidden: Boolean(item.hidden),
    outOfStock: Boolean(item.outOfStock),
  }));
}

function persistMenuCategoriesToLocalStorage() {
  try {
    localStorage.setItem(
      MENU_CATEGORIES_STORAGE_KEY,
      JSON.stringify(getMenuCategoriesPayload()),
    );
  } catch (_) {}
}

function persistMenuCatalogToLocalStorage() {
  try {
    localStorage.setItem(
      MENU_CATALOG_STORAGE_KEY,
      JSON.stringify(getMenuCatalogPayload()),
    );
  } catch (_) {}
}

function persistSharedState() {
  persistMenuCategoriesToLocalStorage();
  persistMenuCatalogToLocalStorage();
}

function persistPublicStateSnapshot(snapshot) {
  try {
    localStorage.setItem(
      MENU_CATEGORIES_STORAGE_KEY,
      JSON.stringify(
        Array.isArray(snapshot?.categories) ? snapshot.categories : [],
      ),
    );
    localStorage.setItem(
      MENU_CATALOG_STORAGE_KEY,
      JSON.stringify(Array.isArray(snapshot?.menu) ? snapshot.menu : []),
    );
    localStorage.setItem(
      ORDERS_PAUSED_STORAGE_KEY,
      snapshot?.ordersPaused ? "1" : "0",
    );
    localStorage.setItem(
      ORDERS_OPEN_TIME_STORAGE_KEY,
      normalizeTimeValue(
        snapshot?.ordersOpenTime || DEFAULT_ORDERS_OPEN_TIME,
        DEFAULT_ORDERS_OPEN_TIME,
      ),
    );
    localStorage.setItem(
      ORDERS_CLOSE_TIME_STORAGE_KEY,
      normalizeTimeValue(
        snapshot?.ordersCloseTime || DEFAULT_ORDERS_CLOSE_TIME,
        DEFAULT_ORDERS_CLOSE_TIME,
      ),
    );
    localStorage.setItem(
      PUBLIC_WHATSAPP_NUMBER_STORAGE_KEY,
      normalizeWhatsappNumber(snapshot?.whatsappNumber),
    );
  } catch (_) {}
  whatsappNumber = normalizeWhatsappNumber(snapshot?.whatsappNumber);
}

async function syncStateFromServer() {
  const snapshot = await requestJson(PUBLIC_STATE_ENDPOINT, { method: "GET" });
  persistPublicStateSnapshot(snapshot);
  return snapshot;
}

async function refreshStateFromServer() {
  await syncStateFromServer();
  loadStateFromLocalStorage();
  applyMenuCatalogState();
  applyOrdersAvailabilityState();
}

function startRemoteStateRefresh() {
  if (stateRefreshTimerId !== null) {
    window.clearInterval(stateRefreshTimerId);
  }
  stateRefreshTimerId = window.setInterval(() => {
    void refreshStateFromServer().catch(() => {});
  }, 60000);
}

function applyMenuCategoriesSnapshot(savedCategories) {
  menuCategories = DEFAULT_MENU_CATEGORIES.map((category) => ({ ...category }));
  if (!Array.isArray(savedCategories)) {
    return;
  }
  const normalizedCategories = [];
  const usedIds = new Set();
  savedCategories.forEach((savedCategory) => {
    const id = normalizeCategoryId(
      savedCategory?.id || savedCategory?.value || savedCategory,
    );
    if (!id || usedIds.has(id)) {
      return;
    }
    normalizedCategories.push({
      id,
      label: formatCategoryLabel(
        savedCategory?.label || savedCategory?.name || categoryLabelFromId(id),
      ),
      hidden: Boolean(savedCategory?.hidden),
    });
    usedIds.add(id);
  });
  if (normalizedCategories.length > 0) {
    menuCategories = normalizedCategories;
  }
}

function loadMenuCategoriesState() {
  try {
    const raw = localStorage.getItem(MENU_CATEGORIES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    applyMenuCategoriesSnapshot(Array.isArray(parsed) ? parsed : null);
  } catch (_) {
    applyMenuCategoriesSnapshot(null);
  }
}

function applyMenuCatalogSnapshot(savedItems) {
  if (!Array.isArray(savedItems)) {
    resetMenuCatalogToSeed();
    return;
  }
  const normalizedItems = [];
  const usedIds = new Set();
  savedItems.forEach((savedItem, index) => {
    const fallbackId = `item-${index + 1}`;
    const candidateId =
      String(savedItem?.id || fallbackId).trim() || fallbackId;
    const itemId = usedIds.has(candidateId)
      ? `${candidateId}-${index + 1}`
      : candidateId;
    usedIds.add(itemId);
    const unitPrice = parseBRL(savedItem?.unitPrice);
    const categoryId = ensureCategoryExists(
      savedItem?.category,
      savedItem?.categoryLabel || categoryLabelFromId(savedItem?.category),
    );
    normalizedItems.push({
      id: itemId,
      category: normalizeMenuCategory(categoryId, getDefaultCategoryId()),
      title: sanitizeMenuText(savedItem?.title, `Item ${index + 1}`),
      ingredients: sanitizeMenuText(
        savedItem?.ingredients,
        "Ingredientes não informados.",
      ),
      unitPrice,
      priceText: formatBRL(unitPrice),
      hidden: Boolean(savedItem?.hidden),
      outOfStock: Boolean(savedItem?.outOfStock),
    });
  });
  menuCatalog.length = 0;
  menuById.clear();
  normalizedItems.forEach((item) => {
    menuCatalog.push(item);
    menuById.set(item.id, item);
  });
}

function loadMenuCatalogState() {
  try {
    const raw = localStorage.getItem(MENU_CATALOG_STORAGE_KEY);
    if (!raw) {
      resetMenuCatalogToSeed();
      return;
    }
    applyMenuCatalogSnapshot(JSON.parse(raw));
  } catch (_) {
    resetMenuCatalogToSeed();
  }
}

function loadOrdersPausedState() {
  try {
    ordersPaused = localStorage.getItem(ORDERS_PAUSED_STORAGE_KEY) === "1";
  } catch (_) {
    ordersPaused = false;
  }
}

function loadOrdersScheduleState() {
  try {
    const hasNewConfig =
      localStorage.getItem(ORDERS_OPEN_TIME_STORAGE_KEY) !== null ||
      localStorage.getItem(ORDERS_CLOSE_TIME_STORAGE_KEY) !== null;
    if (hasNewConfig) {
      ordersOpenTime = normalizeTimeValue(
        localStorage.getItem(ORDERS_OPEN_TIME_STORAGE_KEY) ||
          DEFAULT_ORDERS_OPEN_TIME,
        DEFAULT_ORDERS_OPEN_TIME,
      );
      ordersCloseTime = normalizeTimeValue(
        localStorage.getItem(ORDERS_CLOSE_TIME_STORAGE_KEY) ||
          DEFAULT_ORDERS_CLOSE_TIME,
        DEFAULT_ORDERS_CLOSE_TIME,
      );
      return;
    }
    ordersOpenTime = DEFAULT_ORDERS_OPEN_TIME;
    ordersCloseTime = normalizeTimeValue(
      localStorage.getItem(LEGACY_ORDERS_CUTOFF_TIME_STORAGE_KEY) ||
        DEFAULT_ORDERS_CLOSE_TIME,
      DEFAULT_ORDERS_CLOSE_TIME,
    );
  } catch (_) {
    ordersOpenTime = DEFAULT_ORDERS_OPEN_TIME;
    ordersCloseTime = DEFAULT_ORDERS_CLOSE_TIME;
  }
}

function loadPublicConfigState() {
  try {
    whatsappNumber = normalizeWhatsappNumber(
      localStorage.getItem(PUBLIC_WHATSAPP_NUMBER_STORAGE_KEY) || "",
    );
  } catch (_) {
    whatsappNumber = "";
  }
}

function loadStateFromLocalStorage() {
  loadMenuCategoriesState();
  loadMenuCatalogState();
  loadOrdersPausedState();
  loadOrdersScheduleState();
  loadPublicConfigState();
  menuCatalog.forEach((item) => {
    ensureCategoryExists(item.category, categoryLabelFromId(item.category));
  });
  persistSharedState();
}

function renderFilterButtons() {
  if (!filtersContainer) {
    return;
  }
  const selectedFilter = isValidFilter(activeMenuFilter)
    ? activeMenuFilter
    : "todos";
  activeMenuFilter = selectedFilter;
  filtersContainer.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = `filter-btn${selectedFilter === "todos" ? " active" : ""}`;
  allButton.dataset.filter = "todos";
  allButton.textContent = "Todos";
  filtersContainer.appendChild(allButton);
  menuCategories
    .filter((category) => !category.hidden)
    .forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-btn${selectedFilter === category.id ? " active" : ""}`;
      button.dataset.filter = category.id;
      button.textContent = category.label;
      filtersContainer.appendChild(button);
    });
}

function createMenuCardElement(item) {
  const article = document.createElement("article");
  article.className = "item";
  article.dataset.category = item.category;
  article.dataset.ingredients = item.ingredients;
  article.dataset.itemId = item.id;
  article.dataset.hidden = item.hidden ? "1" : "0";
  article.dataset.outOfStock = item.outOfStock ? "1" : "0";
  article.classList.toggle("is-out-of-stock", Boolean(item.outOfStock));
  const content = document.createElement("div");
  content.className = "content";
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = getCategoryLabel(item.category);
  content.appendChild(tag);
  if (item.outOfStock) {
    const outOfStockTag = document.createElement("span");
    outOfStockTag.className = "tag tag-out-of-stock";
    outOfStockTag.textContent = "Em falta";
    content.appendChild(outOfStockTag);
  }
  const title = document.createElement("h2");
  title.textContent = item.title;
  const ingredients = document.createElement("p");
  ingredients.className = "item-ingredients";
  ingredients.textContent = item.ingredients;
  const priceRow = document.createElement("div");
  priceRow.className = "price-row";
  const price = document.createElement("span");
  price.className = "price";
  price.textContent = item.priceText;
  const orderButton = document.createElement("button");
  orderButton.type = "button";
  orderButton.className = "order";
  orderButton.textContent = item.outOfStock ? "Em falta" : "Pedir agora";
  orderButton.disabled = Boolean(item.outOfStock);
  priceRow.append(price, orderButton);
  content.append(title, ingredients, priceRow);
  article.appendChild(content);
  return article;
}

function applyFilter(filter) {
  activeMenuFilter = isValidFilter(filter) ? filter : "todos";
  if (!menuSection) {
    return;
  }
  renderFilterButtons();
  menuCards.forEach((item) => {
    item.style.display =
      activeMenuFilter === "todos" || item.dataset.category === activeMenuFilter
        ? ""
        : "none";
  });
}

function syncCartWithMenuCatalog() {
  if (cart.length === 0) {
    return;
  }
  cart = cart
    .map((cartItem) => {
      const currentItem = menuById.get(cartItem.id);
      if (
        !currentItem ||
        currentItem.hidden ||
        currentItem.outOfStock ||
        isCategoryHidden(currentItem.category)
      ) {
        return null;
      }
      return { ...cartItem, ...currentItem };
    })
    .filter(Boolean);
}

function applyMenuCatalogState() {
  const activeFilter = activeMenuFilter;
  const categoryOrder = new Map(
    menuCategories.map((category, index) => [category.id, index]),
  );
  if (menuSection) {
    menuSection.innerHTML = "";
    menuCatalog
      .filter((item) => !item.hidden && !isCategoryHidden(item.category))
      .slice()
      .sort((left, right) => {
        const leftOrder =
          categoryOrder.get(left.category) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder =
          categoryOrder.get(right.category) ?? Number.MAX_SAFE_INTEGER;
        return leftOrder !== rightOrder
          ? leftOrder - rightOrder
          : left.title.localeCompare(right.title, "pt-BR");
      })
      .forEach((item) => {
        menuSection.appendChild(createMenuCardElement(item));
      });
    menuCards = Array.from(menuSection.querySelectorAll(".item"));
    applyFilter(activeFilter);
  } else {
    menuCards = [];
  }
  populateItemSelect();
  syncCartWithMenuCatalog();
  renderCart();
  updateMenuOrderButtonsState();
}

function updateMenuOrderButtonsState() {
  const blocked = areOrdersBlocked();
  document.querySelectorAll(".order").forEach((button) => {
    const card = button.closest(".item");
    const currentItem = card?.dataset.itemId
      ? menuById.get(card.dataset.itemId)
      : null;
    const outOfStock = Boolean(currentItem?.outOfStock);
    button.textContent = outOfStock ? "Em falta" : "Pedir agora";
    button.disabled = blocked || outOfStock;
  });
}

function updateClientScheduleInfo() {
  if (ordersScheduleBadge) {
    ordersScheduleBadge.textContent = `Pedidos online: ${getScheduleWindowLabel()}`;
  }
}

function updateOrdersPausedBanner() {
  if (!ordersPausedBanner) {
    return;
  }
  if (ordersPaused) {
    ordersPausedBanner.textContent =
      "No momento estamos com muitos pedidos presenciais. Os pedidos online serão liberados em breve.";
    ordersPausedBanner.hidden = false;
    if (ordersOnlineBanner) {
      ordersOnlineBanner.hidden = true;
    }
    return;
  }
  if (!isWithinScheduleNow()) {
    ordersPausedBanner.textContent = `No momento estamos fora do horário de pedidos online. Atendemos das ${getScheduleWindowLabel()}.`;
    ordersPausedBanner.hidden = false;
    if (ordersOnlineBanner) {
      ordersOnlineBanner.hidden = true;
    }
    return;
  }
  ordersPausedBanner.hidden = true;
  if (ordersOnlineBanner) {
    ordersOnlineBanner.textContent = `Cardápio online aberto agora. Faça seu pedido (horário: ${getScheduleWindowLabel()}).`;
    ordersOnlineBanner.hidden = false;
  }
}

function notifyOrdersBlocked() {
  updateOrdersPausedBanner();
  if (!ordersPausedBanner || ordersPausedBanner.hidden) {
    return;
  }
  ordersPausedBanner.scrollIntoView({ behavior: "smooth", block: "center" });
}

function updateOrderControlsState() {
  if (
    !submitOrderButton ||
    !addItemButton ||
    !itemSelect ||
    !itemQuantityInput
  ) {
    return;
  }
  const blocked = areOrdersBlocked();
  const noItemsAvailable = itemSelect.options.length === 0;
  const hasCustomerName = Boolean(customerNameInput?.value.trim());
  submitOrderButton.disabled = cart.length === 0 || blocked || !hasCustomerName;
  addItemButton.disabled = blocked || noItemsAvailable;
  itemSelect.disabled = blocked || noItemsAvailable;
  itemQuantityInput.disabled = blocked || noItemsAvailable;
}

function updateTotals() {
  const itemsSubtotal = getItemsSubtotal();
  if (modalPrice) {
    modalPrice.textContent = `Subtotal dos itens: ${formatBRL(itemsSubtotal)}`;
  }
  if (orderTotalText) {
    orderTotalText.textContent = `Valor total: ${formatBRL(itemsSubtotal)}`;
  }
  updateOrderControlsState();
}

function renderCart() {
  if (!cartItemsContainer || !cartEmptyText) {
    updateTotals();
    return;
  }
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartEmptyText.hidden = false;
    updateTotals();
    return;
  }
  cartEmptyText.hidden = true;
  cart.forEach((item) => {
    const row = document.createElement("article");
    row.className = "cart-item";
    row.dataset.itemId = item.id;
    const head = document.createElement("div");
    head.className = "cart-head";
    const name = document.createElement("p");
    name.className = "cart-name";
    name.textContent = `${item.title} (${getCategoryLabel(item.category)})`;
    const price = document.createElement("p");
    price.className = "cart-price";
    price.textContent = formatBRL(item.unitPrice * item.quantity);
    head.append(name, price);
    const ingredients = document.createElement("p");
    ingredients.className = "cart-ingredients";
    ingredients.textContent = `Ingredientes: ${item.ingredients}`;
    const noteWrap = document.createElement("label");
    noteWrap.className = "cart-note";
    const noteLabel = document.createElement("span");
    noteLabel.className = "cart-note-label";
    noteLabel.textContent = "Observação deste item (opcional)";
    const noteInput = document.createElement("textarea");
    noteInput.className = "cart-note-input";
    noteInput.rows = 2;
    noteInput.placeholder = `Ex.: sem cebola neste ${getCategoryLabel(item.category).toLowerCase()}.`;
    noteInput.dataset.action = "note";
    noteInput.value = item.note || "";
    noteWrap.append(noteLabel, noteInput);
    const actions = document.createElement("div");
    actions.className = "cart-actions";
    const qtyControl = document.createElement("div");
    qtyControl.className = "qty-control";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "qty-btn";
    minus.dataset.action = "decrease";
    minus.textContent = "-";
    const qtyValue = document.createElement("span");
    qtyValue.className = "qty-value";
    qtyValue.textContent = String(item.quantity);
    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "qty-btn";
    plus.dataset.action = "increase";
    plus.textContent = "+";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.dataset.action = "remove";
    remove.textContent = "Remover";
    minus.disabled = areOrdersBlocked();
    plus.disabled = areOrdersBlocked();
    remove.disabled = areOrdersBlocked();
    noteInput.disabled = areOrdersBlocked();
    qtyControl.append(minus, qtyValue, plus);
    actions.append(qtyControl, remove);
    row.append(head, ingredients, noteWrap, actions);
    cartItemsContainer.appendChild(row);
  });
  updateTotals();
}

function addItemToCart(itemId, quantity = 1) {
  const selected = menuById.get(itemId);
  if (
    !selected ||
    selected.hidden ||
    selected.outOfStock ||
    isCategoryHidden(selected.category)
  ) {
    return;
  }
  const qty = Math.max(1, Number.parseInt(quantity, 10) || 1);
  const existing = cart.find((entry) => entry.id === itemId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...selected, quantity: qty, note: "" });
  }
  renderCart();
}

function updateItemQuantity(itemId, nextQuantity) {
  const target = cart.find((item) => item.id === itemId);
  if (!target) {
    return;
  }
  if (nextQuantity <= 0) {
    cart = cart.filter((item) => item.id !== itemId);
  } else {
    target.quantity = nextQuantity;
  }
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function openOrderModal() {
  if (!orderModal || !modalTitle) {
    return;
  }
  if (areOrdersBlocked()) {
    notifyOrdersBlocked();
    return;
  }
  lastOrderModalTrigger =
    document.activeElement && typeof document.activeElement.focus === "function"
      ? document.activeElement
      : null;
  modalTitle.textContent = "Seu pedido";
  orderModal.classList.add("is-open");
  orderModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  customerNameInput?.focus();
}

function closeOrderModal() {
  if (!orderModal || !orderForm || !itemQuantityInput) {
    return;
  }
  const focusTarget = lastOrderModalTrigger;
  lastOrderModalTrigger = null;
  orderModal.classList.remove("is-open");
  orderModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  orderForm.reset();
  itemQuantityInput.value = "1";
  setDefaultPickupTime();
  clearCart();
  if (focusTarget && document.contains(focusTarget)) {
    focusTarget.focus();
  }
}

function applyOrdersAvailabilityState() {
  document.body.classList.toggle("orders-paused", areOrdersBlocked());
  updateOrdersPausedBanner();
  updateClientScheduleInfo();
  updateMenuOrderButtonsState();
  if (areOrdersBlocked() && orderModal?.classList.contains("is-open")) {
    closeOrderModal();
  }
  updateTotals();
}

function scheduleAvailabilityUpdates() {
  if (availabilityTimerId !== null) {
    window.clearTimeout(availabilityTimerId);
  }
  const now = new Date();
  const millisecondsToNextMinute =
    (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 20;
  availabilityTimerId = window.setTimeout(
    () => {
      applyOrdersAvailabilityState();
      scheduleAvailabilityUpdates();
    },
    Math.max(1000, millisecondsToNextMinute),
  );
}

function populateItemSelect() {
  if (!itemSelect) {
    return;
  }
  itemSelect.innerHTML = "";
  menuCatalog.forEach((item) => {
    if (item.hidden || item.outOfStock || isCategoryHidden(item.category)) {
      return;
    }
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.title} - ${item.priceText}`;
    itemSelect.appendChild(option);
  });
}

function loadOrderHistory() {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

async function saveOrderHistoryEntry(entry) {
  return requestJson(CREATE_ORDER_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

function saveOrderHistoryEntryInBackground(entry) {
  const body = JSON.stringify(entry);
  if (typeof navigator.sendBeacon === "function") {
    try {
      const payload = new Blob([body], {
        type: "application/json; charset=utf-8",
      });
      if (navigator.sendBeacon(CREATE_ORDER_ENDPOINT, payload)) {
        return true;
      }
    } catch (_) {}
  }
  try {
    void fetch(CREATE_ORDER_ENDPOINT, {
      method: "POST",
      body,
      credentials: "same-origin",
      cache: "no-store",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error(error);
    });
    return true;
  } catch (_) {
    return false;
  }
}

if (filtersContainer) {
  filtersContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (button) {
      applyFilter(button.dataset.filter);
    }
  });
}

if (menuSection) {
  menuSection.addEventListener("click", (event) => {
    const orderButton = event.target.closest(".order");
    if (!orderButton || !orderForm || !itemQuantityInput) {
      return;
    }
    if (areOrdersBlocked()) {
      notifyOrdersBlocked();
      return;
    }
    const card = orderButton.closest(".item");
    const currentItem = card?.dataset.itemId
      ? menuById.get(card.dataset.itemId)
      : null;
    if (!currentItem || currentItem.outOfStock) {
      return;
    }
    orderForm.reset();
    itemQuantityInput.value = "1";
    setDefaultPickupTime();
    clearCart();
    addItemToCart(currentItem.id, 1);
    openOrderModal();
  });
}

if (addItemButton && itemSelect && itemQuantityInput) {
  addItemButton.addEventListener("click", () => {
    if (areOrdersBlocked()) {
      notifyOrdersBlocked();
      return;
    }
    addItemToCart(itemSelect.value, itemQuantityInput.value);
    itemQuantityInput.value = "1";
    itemSelect.focus();
  });
}

if (itemQuantityInput && addItemButton) {
  itemQuantityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addItemButton.click();
    }
  });
}

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton || areOrdersBlocked()) {
      return;
    }
    const itemId = actionButton.closest(".cart-item")?.dataset.itemId;
    const current = itemId ? cart.find((item) => item.id === itemId) : null;
    if (!current) {
      return;
    }
    if (actionButton.dataset.action === "increase") {
      updateItemQuantity(itemId, current.quantity + 1);
    }
    if (actionButton.dataset.action === "decrease") {
      updateItemQuantity(itemId, current.quantity - 1);
    }
    if (actionButton.dataset.action === "remove") {
      updateItemQuantity(itemId, 0);
    }
  });
  cartItemsContainer.addEventListener("input", (event) => {
    const noteInput = event.target.closest('textarea[data-action="note"]');
    if (!noteInput || areOrdersBlocked()) {
      return;
    }
    const itemId = noteInput.closest(".cart-item")?.dataset.itemId;
    const current = itemId ? cart.find((item) => item.id === itemId) : null;
    if (current) {
      current.note = noteInput.value;
    }
  });
}

if (customerNameInput) {
  customerNameInput.addEventListener("input", updateOrderControlsState);
}

if (closeOrderModalButton) {
  closeOrderModalButton.addEventListener("click", closeOrderModal);
}

if (orderModal) {
  orderModal.addEventListener("click", (event) => {
    if (event.target === orderModal) {
      closeOrderModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && orderModal?.classList.contains("is-open")) {
    closeOrderModal();
  }
});

if (orderForm && pickupTimeInput && orderNotesInput) {
  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (areOrdersBlocked()) {
      notifyOrdersBlocked();
      closeOrderModal();
      return;
    }
    if (cart.length === 0) {
      return;
    }
    const customerName = String(customerNameInput?.value || "").trim();
    if (!customerName) {
      customerNameInput?.focus();
      updateOrderControlsState();
      return;
    }
    if (!pickupTimeInput.value) {
      pickupTimeInput.focus();
      return;
    }
    const notes = orderNotesInput.value.trim();
    const totalEstimate = getItemsSubtotal();
    const createdAt = new Date().toISOString();
    const orderEntry = {
      id: `order-${Date.now()}`,
      customerName,
      pickupTime: pickupTimeInput.value,
      notes,
      total: totalEstimate,
      totalFormatted: formatBRL(totalEstimate),
      createdAt,
      status: "pending",
      readyAt: null,
      source: "online",
      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        ingredients: item.ingredients,
        note: item.note || "",
        totalPrice: item.unitPrice * item.quantity,
        totalFormatted: formatBRL(item.unitPrice * item.quantity),
      })),
    };
    const lines = [
      "Olá quero fazer um pedido",
      "",
      `*Nome*: ${customerName}`,
      "",
      "*Itens do pedido*:",
    ];
    cart.forEach((item) => {
      lines.push(
        `- ${item.title} x${item.quantity} (${formatBRL(item.unitPrice * item.quantity)})`,
      );
      lines.push(`  Ingredientes: ${item.ingredients}`);
      if (String(item.note || "").trim()) {
        lines.push(`  *Observação (${item.title})*: ${item.note.trim()}`);
      }
    });
    lines.push("");
    lines.push(
      `*Horário de retirada*: ${formatPickupTime(pickupTimeInput.value)}`,
    );
    if (notes) {
      lines.push(`*Observação geral*: ${notes}`);
    }
    lines.push(`*Valor total*: ${formatBRL(totalEstimate)}`);
    if (!whatsappNumber) {
      window.alert(
        "O numero do WhatsApp nao esta configurado no servidor. Configure PUBLIC_WHATSAPP_NUMBER antes de publicar.",
      );
      return;
    }
    if (isIosSafari()) {
      const queued = saveOrderHistoryEntryInBackground(orderEntry);
      if (!queued) {
        console.error(
          "Nao foi possivel iniciar o registro do pedido em segundo plano no iPhone.",
        );
      }
      openWhatsappConversation(lines.join("\n"));
      closeOrderModal();
      return;
    }
    let persistedOrder = null;
    try {
      const response = await saveOrderHistoryEntry(orderEntry);
      persistedOrder = response?.order || null;
    } catch (error) {
      console.error(error);
      window.alert(
        error?.message
          ? `Nao foi possivel registrar o pedido no painel interno agora: ${error.message}`
          : "Nao foi possivel registrar o pedido no painel interno agora. O WhatsApp sera aberto mesmo assim.",
      );
    }
    if (
      typeof persistedOrder?.orderCode === "string" &&
      persistedOrder.orderCode.trim()
    ) {
      lines.splice(3, 0, `*Pedido*: ${persistedOrder.orderCode.trim()}`, "");
    }
    openWhatsappConversation(lines.join("\n"));
    closeOrderModal();
  });
}

window.addEventListener("storage", (event) => {
  if (
    event.key &&
    ![
      MENU_CATEGORIES_STORAGE_KEY,
      MENU_CATALOG_STORAGE_KEY,
      ORDERS_PAUSED_STORAGE_KEY,
      ORDERS_OPEN_TIME_STORAGE_KEY,
      ORDERS_CLOSE_TIME_STORAGE_KEY,
    ].includes(event.key)
  ) {
    return;
  }
  loadStateFromLocalStorage();
  applyMenuCatalogState();
  applyOrdersAvailabilityState();
});

async function initializeApplication() {
  resetMenuCatalogToSeed();
  loadStateFromLocalStorage();
  try {
    await syncStateFromServer();
    loadStateFromLocalStorage();
  } catch (_) {}
  applyMenuCatalogState();
  persistSharedState();
  setDefaultPickupTime();
  scheduleAvailabilityUpdates();
  applyOrdersAvailabilityState();
  startRemoteStateRefresh();
}

void initializeApplication();
