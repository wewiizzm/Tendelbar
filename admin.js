const adminCategoryRemoveModal = document.getElementById('adminCategoryRemoveModal');
const closeAdminCategoryRemoveModalButton = document.getElementById('closeAdminCategoryRemoveModal');
const cancelAdminCategoryRemoveButton = document.getElementById('cancelAdminCategoryRemove');
const adminCategoryRemoveForm = document.getElementById('adminCategoryRemoveForm');
const adminCategoryRemovePasswordInput = document.getElementById('adminCategoryRemovePassword');
const adminCategoryRemoveError = document.getElementById('adminCategoryRemoveError');
const adminCategoryRemoveMessage = document.getElementById('adminCategoryRemoveMessage');
const adminOrdersAccessModal = document.getElementById('adminOrdersAccessModal');
const closeAdminOrdersAccessModalButton = document.getElementById('closeAdminOrdersAccessModal');
const cancelAdminOrdersAccessButton = document.getElementById('cancelAdminOrdersAccess');
const adminOrdersAccessForm = document.getElementById('adminOrdersAccessForm');
const adminOrdersAccessUsernameInput = document.getElementById('adminOrdersAccessUsername');
const adminOrdersAccessPasswordInput = document.getElementById('adminOrdersAccessPassword');
const adminOrdersAccessError = document.getElementById('adminOrdersAccessError');
const adminLoginView = document.getElementById('adminLoginView');
const adminControlView = document.getElementById('adminControlView');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminUsernameInput = document.getElementById('adminUsername');
const adminPasswordInput = document.getElementById('adminPassword');
const adminLoginError = document.getElementById('adminLoginError');
const adminTabButtons = Array.from(document.querySelectorAll('.admin-tab'));
const adminSchedulePanel = document.getElementById('adminSchedulePanel');
const adminOrdersPanel = document.getElementById('adminOrdersPanel');
const adminCounterPanel = document.getElementById('adminCounterPanel');
const adminCategoriesPanel = document.getElementById('adminCategoriesPanel');
const adminMenuPanel = document.getElementById('adminMenuPanel');
const adminCounterItemSelect = document.getElementById('adminCounterItemSelect');
const adminCounterQuantityInput = document.getElementById('adminCounterQuantity');
const adminCounterAddItemButton = document.getElementById('adminCounterAddItemButton');
const adminCounterOrderForm = document.getElementById('adminCounterOrderForm');
const adminCounterCustomerNameInput = document.getElementById('adminCounterCustomerName');
const adminCounterPickupTimeInput = document.getElementById('adminCounterPickupTime');
const adminCounterNotesInput = document.getElementById('adminCounterNotes');
const adminCounterCartItems = document.getElementById('adminCounterCartItems');
const adminCounterCartEmpty = document.getElementById('adminCounterCartEmpty');
const adminCounterOrderTotal = document.getElementById('adminCounterOrderTotal');
const adminCounterStatus = document.getElementById('adminCounterStatus');
const adminCounterOrdersList = document.getElementById('adminCounterOrdersList');
const adminCounterHistorySection = document.getElementById('adminCounterHistorySection');
const adminCounterHistoryStatus = document.getElementById('adminCounterHistoryStatus');
const adminCounterHistoryToggle = document.getElementById('adminCounterHistoryToggle');
const adminCounterHistoryClearButton = document.getElementById('adminCounterHistoryClearButton');
const adminCounterHistoryList = document.getElementById('adminCounterHistoryList');
const adminOrdersStatus = document.getElementById('adminOrdersStatus');
const adminOrdersOverview = document.getElementById('adminOrdersOverview');
const adminOrdersFilterButtons = document.getElementById('adminOrdersFilterButtons');
const adminOrdersList = document.getElementById('adminOrdersList');
const adminOrdersHistorySection = document.getElementById('adminOrdersHistorySection');
const adminOrdersHistoryStatus = document.getElementById('adminOrdersHistoryStatus');
const adminOrdersHistoryToggle = document.getElementById('adminOrdersHistoryToggle');
const adminOrdersHistoryClearButton = document.getElementById('adminOrdersHistoryClearButton');
const adminOrdersHistoryList = document.getElementById('adminOrdersHistoryList');
const ordersControlStatus = document.getElementById('ordersControlStatus');
const pauseOnlineOrdersButton = document.getElementById('pauseOnlineOrders');
const resumeOnlineOrdersButton = document.getElementById('resumeOnlineOrders');
const ordersOpenTimeInput = document.getElementById('ordersOpenTime');
const ordersCloseTimeInput = document.getElementById('ordersCloseTime');
const saveOrdersScheduleButton = document.getElementById('saveOrdersSchedule');
const ordersScheduleStatus = document.getElementById('ordersScheduleStatus');
const adminAddMenuForm = document.getElementById('adminAddMenuForm');
const adminAddCategoryForm = document.getElementById('adminAddCategoryForm');
const adminCreateCategoryButton = document.getElementById('adminCreateCategoryButton');
const adminNewCategoryInput = document.getElementById('adminNewCategory');
const adminNewCategoryNameInput = document.getElementById('adminNewCategoryName');
const adminNewTitleInput = document.getElementById('adminNewTitle');
const adminNewPriceInput = document.getElementById('adminNewPrice');
const adminNewIngredientsInput = document.getElementById('adminNewIngredients');
const adminCategoryEditor = document.getElementById('adminCategoryEditor');
const adminMenuEditor = document.getElementById('adminMenuEditor');
const adminMenuStatus = document.getElementById('adminMenuStatus');
const adminCategoryStatus = document.getElementById('adminCategoryStatus');
const adminLogoutButton = document.getElementById('adminLogout');
const adminSaveAllContainer = document.getElementById('adminSaveAllContainer');
const adminSaveAllButton = document.getElementById('adminSaveAllButton');
const menuSeedSection = document.getElementById('menu');
const menuSeedCards = menuSeedSection ? Array.from(menuSeedSection.querySelectorAll('.item')) : [];

const ORDERS_PAUSED_STORAGE_KEY = 'tendel_orders_paused';
const ORDERS_OPEN_TIME_STORAGE_KEY = 'tendel_orders_open_time';
const ORDERS_CLOSE_TIME_STORAGE_KEY = 'tendel_orders_close_time';
const LEGACY_ORDERS_CUTOFF_TIME_STORAGE_KEY = 'tendel_orders_cutoff_time';
const MENU_CATALOG_STORAGE_KEY = 'tendel_menu_catalog';
const MENU_CATEGORIES_STORAGE_KEY = 'tendel_menu_categories';
const ORDER_HISTORY_STORAGE_KEY = 'tendel_order_history';
const CREATE_ORDER_ENDPOINT = '/api/orders';
const ADMIN_LOGIN_ENDPOINT = '/api/admin/login';
const ADMIN_LOGOUT_ENDPOINT = '/api/admin/logout';
const ADMIN_STATE_ENDPOINT = '/api/admin/state';
const ADMIN_ORDERS_ENDPOINT = '/api/admin/orders';
const ADMIN_VERIFY_PASSWORD_ENDPOINT = '/api/admin/verify-password';
const ADMIN_ORDERS_ACCESS_ENDPOINT = '/api/admin/orders-access';
const ORDER_STATUS_PENDING = 'pending';
const ORDER_STATUS_READY = 'ready';
const ADMIN_STATE_REFRESH_INTERVAL_MS = 5000;
const DEFAULT_ORDERS_OPEN_TIME = '19:00';
const DEFAULT_ORDERS_CLOSE_TIME = '23:00';
const DEFAULT_MENU_CATEGORIES = [
  { id: 'lanches', label: 'Lanches', hidden: false },
  { id: 'pratos', label: 'Pratos', hidden: false },
  { id: 'bebidas', label: 'Bebidas', hidden: false },
  { id: 'sobremesas', label: 'Sobremesas', hidden: false }
];
const ADMIN_ORDER_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Em preparo' },
  { id: 'ready', label: 'Prontos' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'counter', label: 'Balcao' }
];

let menuCategories = DEFAULT_MENU_CATEGORIES.map((category) => ({ ...category }));
let ordersPaused = false;
let ordersOpenTime = DEFAULT_ORDERS_OPEN_TIME;
let ordersCloseTime = DEFAULT_ORDERS_CLOSE_TIME;
let adminCounterCart = [];
let adminAuthenticated = false;
let adminOrdersAccessAuthenticated = false;
let activeAdminOrdersFilter = 'all';
let activeAdminPanel = 'schedule';
let pendingRemovalContext = null;
let lastAdminRemovalTrigger = null;
let lastAdminOrdersAccessTrigger = null;
let adminStateRefreshTimerId = null;
let lastAdminOrdersSeenKey = '';
let adminOrdersWakeLockSentinel = null;
let adminOrdersHistoryExpanded = false;
let adminCounterHistoryExpanded = false;
let pendingAdminNewOrderPopupOrder = null;
let adminNewOrderPopup = null;
let adminNewOrderPopupTitle = null;
let adminNewOrderPopupMessage = null;
let adminNewOrderPopupReceiveButton = null;

function normalizeCategoryId(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatCategoryLabel(value, fallback = 'Categoria') {
  const normalized = String(value || '').trim().replace(/\s+/g, ' ');
  return normalized || fallback;
}

function categoryLabelFromId(categoryId) {
  const words = String(categoryId || '')
    .split('-')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);
  return words.join(' ') || 'Categoria';
}

function ensureCategoryExists(categoryId, categoryLabel) {
  const normalizedId = normalizeCategoryId(categoryId);
  if (!normalizedId) {
    return null;
  }
  const existing = menuCategories.find((category) => category.id === normalizedId);
  if (existing) {
    return existing.id;
  }
  menuCategories.push({
    id: normalizedId,
    label: formatCategoryLabel(categoryLabel, categoryLabelFromId(normalizedId)),
    hidden: false
  });
  return normalizedId;
}

function getDefaultCategoryId() {
  return menuCategories.find((category) => !category.hidden)?.id || menuCategories[0]?.id || 'lanches';
}

function normalizeMenuCategory(value, fallback = getDefaultCategoryId()) {
  const normalized = normalizeCategoryId(value);
  if (normalized && menuCategories.some((category) => category.id === normalized)) {
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
  return Boolean(menuCategories.find((category) => category.id === normalized)?.hidden);
}

function parseBRL(priceText) {
  const sanitized = String(priceText || '').trim().replace(/[^\d,.-]/g, '');
  if (!sanitized) {
    return 0;
  }
  let numeric = sanitized;
  if (numeric.includes(',') && numeric.includes('.')) {
    numeric = numeric.replace(/\./g, '').replace(',', '.');
  } else if (numeric.includes(',')) {
    numeric = numeric.replace(',', '.');
  }
  const value = Number.parseFloat(numeric);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPriceInputValue(value) {
  return value.toFixed(2).replace('.', ',');
}

function sanitizeMenuText(value, fallback) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || fallback;
}

function normalizeTimeValue(value, fallback = '00:00') {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  if (!/^\d{2}:\d{2}$/.test(trimmed)) {
    return fallback;
  }
  const [hoursText, minutesText] = trimmed.split(':');
  const hours = Number.parseInt(hoursText, 10);
  const minutes = Number.parseInt(minutesText, 10);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return fallback;
  }
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return fallback;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function timeToMinutes(value) {
  if (!value || !value.includes(':')) {
    return null;
  }
  const [hoursText, minutesText] = value.split(':');
  const hours = Number.parseInt(hoursText, 10);
  const minutes = Number.parseInt(minutesText, 10);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

function formatHourLabel(value) {
  const normalized = normalizeTimeValue(value, '00:00');
  return normalized.endsWith(':00') ? `${normalized.slice(0, 2)}h` : normalized;
}

function formatPickupTime(value) {
  if (!value || !value.includes(':')) {
    return value || '-';
  }
  const [hours, minutes] = value.split(':');
  return `${hours}:${minutes}`;
}

function normalizeDateTimeValue(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return '-';
  }
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error || 'Nao foi possivel concluir a requisicao.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

function describeRequestFailure(error, fallbackMessage) {
  const detail = typeof error?.message === 'string' ? error.message.trim() : '';
  if (!detail || detail === fallbackMessage) {
    return fallbackMessage;
  }
  return `${fallbackMessage} ${detail}`;
}

function normalizeOrderStatus(value) {
  return value === ORDER_STATUS_READY ? ORDER_STATUS_READY : ORDER_STATUS_PENDING;
}

function normalizeOrderSource(value) {
  return String(value || '').trim().toLowerCase() === 'counter' ? 'counter' : 'online';
}

function parseOrderNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getOrderCodePrefix(source) {
  return normalizeOrderSource(source) === 'counter' ? 'B' : 'O';
}

function formatOrderCode(source, orderNumber) {
  return `#${getOrderCodePrefix(source)}${Math.max(1, parseOrderNumber(orderNumber) || 1)}`;
}

function getOrderCreatedAtValue(entry) {
  const value = new Date(entry?.createdAt || 0).getTime();
  return Number.isFinite(value) ? value : 0;
}

function sortOrdersOldestFirst(orders) {
  return (Array.isArray(orders) ? orders : []).slice().sort((left, right) => {
    const leftTime = getOrderCreatedAtValue(left);
    const rightTime = getOrderCreatedAtValue(right);
    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    return String(left?.id || '').localeCompare(String(right?.id || ''));
  });
}

function getNextOrderNumber(existingOrders, source) {
  return (
    (Array.isArray(existingOrders) ? existingOrders : []).reduce((max, entry) => {
      if (normalizeOrderSource(entry?.source) !== source) {
        return max;
      }
      return Math.max(max, parseOrderNumber(entry?.orderNumber) || 0);
    }, 0) + 1
  );
}

function normalizeOrderHistoryEntry(entry, existingOrders = []) {
  const normalizedStatus = normalizeOrderStatus(entry?.status);
  const source = normalizeOrderSource(entry?.source);
  const orderNumber = parseOrderNumber(entry?.orderNumber) || getNextOrderNumber(existingOrders, source);
  return {
    ...entry,
    source,
    orderNumber,
    orderCode: formatOrderCode(source, orderNumber),
    status: normalizedStatus,
    readyAt: normalizedStatus === ORDER_STATUS_READY ? normalizeDateTimeValue(entry?.readyAt) : null
  };
}

function normalizeOrderHistoryEntries(entries) {
  const originalEntries = Array.isArray(entries) ? entries : [];
  const normalizedByEntry = new Map();
  const normalizedHistory = [];
  sortOrdersOldestFirst(originalEntries).forEach((entry) => {
    const normalizedEntry = normalizeOrderHistoryEntry(entry, normalizedHistory);
    normalizedHistory.push(normalizedEntry);
    normalizedByEntry.set(entry, normalizedEntry);
  });
  return originalEntries.map((entry) => normalizedByEntry.get(entry) || normalizeOrderHistoryEntry(entry, normalizedHistory));
}

function getOrderSourceLabel(order) {
  return normalizeOrderSource(order?.source) === 'counter' ? 'Balcao' : 'WhatsApp';
}

function getOrderDisplayCode(order) {
  const source = normalizeOrderSource(order?.source);
  const orderNumber = parseOrderNumber(order?.orderNumber) || 1;
  const orderCode = sanitizeMenuText(order?.orderCode, formatOrderCode(source, orderNumber));
  return orderCode.startsWith('#') ? orderCode : `#${orderCode}`;
}

function getLatestAdminOrderKey(orders) {
  const latestOrder = Array.isArray(orders) && orders.length > 0 ? orders[0] : null;
  if (!latestOrder) {
    return '';
  }
  return `${String(latestOrder.id || '')}:${String(latestOrder.createdAt || '')}`;
}

function sortAdminOrdersNewestFirst(orders) {
  return (Array.isArray(orders) ? orders : [])
    .slice()
    .sort((left, right) => new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime());
}

function ensureAdminNewOrderPopup() {
  if (adminNewOrderPopup) {
    return adminNewOrderPopup;
  }
  const popup = document.createElement('aside');
  popup.setAttribute('aria-live', 'polite');
  popup.setAttribute('aria-atomic', 'true');
  Object.assign(popup.style, {
    position: 'fixed',
    right: '18px',
    bottom: '18px',
    zIndex: '1200',
    width: 'min(360px, calc(100vw - 28px))',
    borderRadius: '20px',
    border: '1px solid rgba(230, 122, 0, 0.22)',
    background: 'linear-gradient(180deg, #fffaf4 0%, #fff3e3 100%)',
    boxShadow: '0 18px 40px rgba(55, 32, 11, 0.20)',
    padding: '16px',
    display: 'none',
    gap: '10px'
  });

  const kicker = document.createElement('p');
  kicker.textContent = 'Novo pedido';
  Object.assign(kicker.style, {
    margin: '0',
    fontSize: '0.78rem',
    fontWeight: '800',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#b55b00'
  });

  const title = document.createElement('h4');
  Object.assign(title.style, {
    margin: '0',
    fontSize: '1rem',
    color: '#2f2115'
  });

  const message = document.createElement('p');
  Object.assign(message.style, {
    margin: '0',
    color: '#5d4230',
    lineHeight: '1.45'
  });

  const actions = document.createElement('div');
  Object.assign(actions.style, {
    display: 'flex',
    justifyContent: 'flex-end'
  });

  const receiveButton = document.createElement('button');
  receiveButton.type = 'button';
  receiveButton.textContent = 'Receber pedido';
  receiveButton.className = 'owner-toggle';
  receiveButton.addEventListener('click', () => {
    const orderId = String(receiveButton.dataset.orderId || '').trim();
    hideAdminNewOrderPopup(true);
    if (!orderId) {
      return;
    }
    activeAdminOrdersFilter = 'all';
    setAdminPanel('orders');
    renderOrdersList();
    window.setTimeout(() => {
      focusAdminOrderCard(orderId);
    }, 60);
  });

  actions.appendChild(receiveButton);
  popup.append(kicker, title, message, actions);
  document.body.appendChild(popup);

  adminNewOrderPopup = popup;
  adminNewOrderPopupTitle = title;
  adminNewOrderPopupMessage = message;
  adminNewOrderPopupReceiveButton = receiveButton;
  return popup;
}

function showAdminNewOrderPopup(order) {
  if (!order) {
    return;
  }
  pendingAdminNewOrderPopupOrder = order;
  if (activeAdminPanel !== 'orders') {
    return;
  }
  const popup = ensureAdminNewOrderPopup();
  const orderCode = getOrderDisplayCode(order);
  const customerName = sanitizeMenuText(order?.customerName, 'Cliente nao informado');
  const sourceLabel = getOrderSourceLabel(order);
  const pickupTime = formatPickupTime(order?.pickupTime);
  adminNewOrderPopupTitle.textContent = `${orderCode} - ${customerName}`;
  adminNewOrderPopupMessage.textContent = `${sourceLabel} - retirada ${pickupTime}. Clique para receber e ir direto ao pedido.`;
  adminNewOrderPopupReceiveButton.dataset.orderId = String(order?.id || '');
  popup.style.display = 'grid';
}

function hideAdminNewOrderPopup(clearPending = false) {
  if (clearPending) {
    pendingAdminNewOrderPopupOrder = null;
  }
  if (!adminNewOrderPopup) {
    return;
  }
  adminNewOrderPopup.style.display = 'none';
}

function focusAdminOrderCard(orderId) {
  if (!orderId) {
    return;
  }
  const selector = `[data-order-id="${orderId}"]`;
  const targetCard =
    adminOrdersList?.querySelector(selector) ||
    adminOrdersHistoryList?.querySelector(selector) ||
    adminCounterOrdersList?.querySelector(selector) ||
    adminCounterHistoryList?.querySelector(selector);
  if (!targetCard) {
    return;
  }
  targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const previousTransition = targetCard.style.transition;
  const previousBoxShadow = targetCard.style.boxShadow;
  const previousTransform = targetCard.style.transform;
  targetCard.style.transition = 'box-shadow 180ms ease, transform 180ms ease';
  targetCard.style.boxShadow = '0 0 0 3px rgba(230, 122, 0, 0.24), 0 16px 30px rgba(230, 122, 0, 0.16)';
  targetCard.style.transform = 'translateY(-2px)';
  window.setTimeout(() => {
    targetCard.style.boxShadow = previousBoxShadow;
    targetCard.style.transform = previousTransform;
    targetCard.style.transition = previousTransition;
  }, 1800);
}

async function requestAdminOrdersNotificationPermission() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'default') {
    return;
  }
  try {
    await Notification.requestPermission();
  } catch (_) {}
}

function notifyAdminNewOrder(order) {
  if (!adminAuthenticated || !adminOrdersAccessAuthenticated || !order) {
    return;
  }
  showAdminNewOrderPopup(order);
  const orderCode = getOrderDisplayCode(order);
  const orderSource = getOrderSourceLabel(order);
  const customerName = sanitizeMenuText(order?.customerName, 'Pedido sem identificacao');
  const pickupTime = formatPickupTime(order?.pickupTime);
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return;
  }
  try {
    new Notification('Novo pedido recebido', {
      body: `${orderCode} | ${orderSource} | ${customerName} | Retirada ${pickupTime}`,
      tag: 'tendel-new-order',
      renotify: true
    });
  } catch (_) {}
}

function trackAdminIncomingOrders(orders) {
  const sortedOrders = sortAdminOrdersNewestFirst(orders);
  const latestOrderKey = getLatestAdminOrderKey(sortedOrders);
  const latestOrder = sortedOrders[0] || null;
  if (latestOrderKey && lastAdminOrdersSeenKey && latestOrderKey !== lastAdminOrdersSeenKey) {
    notifyAdminNewOrder(latestOrder);
  }
  lastAdminOrdersSeenKey = latestOrderKey;
}

async function requestAdminOrdersWakeLock() {
  if (
    !('wakeLock' in navigator) ||
    adminOrdersWakeLockSentinel ||
    !adminAuthenticated ||
    !adminOrdersAccessAuthenticated ||
    activeAdminPanel !== 'orders' ||
    document.visibilityState !== 'visible'
  ) {
    return;
  }
  try {
    adminOrdersWakeLockSentinel = await navigator.wakeLock.request('screen');
    adminOrdersWakeLockSentinel.addEventListener('release', () => {
      adminOrdersWakeLockSentinel = null;
    });
  } catch (_) {}
}

async function releaseAdminOrdersWakeLock() {
  if (!adminOrdersWakeLockSentinel) {
    return;
  }
  const currentWakeLock = adminOrdersWakeLockSentinel;
  adminOrdersWakeLockSentinel = null;
  try {
    await currentWakeLock.release();
  } catch (_) {}
}

function syncAdminOrdersWakeLock() {
  if (
    adminAuthenticated &&
    adminOrdersAccessAuthenticated &&
    activeAdminPanel === 'orders' &&
    document.visibilityState === 'visible'
  ) {
    void requestAdminOrdersWakeLock();
    return;
  }
  void releaseAdminOrdersWakeLock();
}

function getAdminOrderFilterCount(filterId, orders) {
  return filterAdminOrders(orders, filterId).length;
}

function filterAdminOrders(orders, filterId = 'all') {
  if (!Array.isArray(orders)) {
    return [];
  }
  if (filterId === 'pending') {
    return orders.filter((order) => order.status !== ORDER_STATUS_READY);
  }
  if (filterId === 'ready') {
    return orders.filter((order) => order.status === ORDER_STATUS_READY);
  }
  if (filterId === 'whatsapp') {
    return orders.filter((order) => normalizeOrderSource(order?.source) !== 'counter');
  }
  if (filterId === 'counter') {
    return orders.filter((order) => normalizeOrderSource(order?.source) === 'counter');
  }
  return orders;
}

function getScheduleWindowLabel() {
  return `${formatHourLabel(ordersOpenTime)} as ${formatHourLabel(ordersCloseTime)}`;
}

function isOutsideScheduleNow() {
  const openMinutes = timeToMinutes(ordersOpenTime);
  const closeMinutes = timeToMinutes(ordersCloseTime);
  if (openMinutes === null || closeMinutes === null || openMinutes === closeMinutes) {
    return false;
  }
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (openMinutes < closeMinutes) {
    return nowMinutes < openMinutes || nowMinutes > closeMinutes;
  }
  return nowMinutes < openMinutes && nowMinutes > closeMinutes;
}

function setAdminLoginError(message) {
  if (!adminLoginError) {
    return;
  }
  adminLoginError.textContent = message;
  adminLoginError.hidden = false;
}

function resetAdminLoginError() {
  if (!adminLoginError) {
    return;
  }
  adminLoginError.textContent = 'Usuario ou senha invalidos.';
  adminLoginError.hidden = true;
}

function setAdminOrdersAccessError(message) {
  if (!adminOrdersAccessError) {
    return;
  }
  adminOrdersAccessError.textContent = message;
  adminOrdersAccessError.hidden = false;
}

function resetAdminOrdersAccessError() {
  if (!adminOrdersAccessError) {
    return;
  }
  adminOrdersAccessError.textContent = 'Usuario ou senha invalidos.';
  adminOrdersAccessError.hidden = true;
}

async function verifyAdminPassword(password) {
  await requestJson(ADMIN_VERIFY_PASSWORD_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ password })
  });
}

const seedMenuCatalog = menuSeedCards.map((card, index) => {
  const itemId = `item-${index + 1}`;
  const title = card.querySelector('h2')?.textContent?.trim() || `Item ${index + 1}`;
  const priceText = card.querySelector('.price')?.textContent?.trim() || 'R$ 0,00';
  const ingredients = card.dataset.ingredients || 'Ingredientes nao informados.';
  const category = ensureCategoryExists(card.dataset.category, '') || getDefaultCategoryId();
  return {
    id: itemId,
    title,
    priceText,
    unitPrice: parseBRL(priceText),
    ingredients,
    category,
    hidden: card.dataset.hidden === '1',
    outOfStock: card.dataset.outOfStock === '1'
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
      hidden: Boolean(category?.hidden)
    });
    usedIds.add(id);
  });
  return payload.length > 0 ? payload : DEFAULT_MENU_CATEGORIES.map((category) => ({ ...category }));
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
    outOfStock: Boolean(item.outOfStock)
  }));
}

function persistMenuCategoriesToLocalStorage() {
  try {
    localStorage.setItem(MENU_CATEGORIES_STORAGE_KEY, JSON.stringify(getMenuCategoriesPayload()));
  } catch (_) {}
}

function persistMenuCatalogToLocalStorage() {
  try {
    localStorage.setItem(MENU_CATALOG_STORAGE_KEY, JSON.stringify(getMenuCatalogPayload()));
  } catch (_) {}
}

function persistOrdersPausedToLocalStorage() {
  try {
    localStorage.setItem(ORDERS_PAUSED_STORAGE_KEY, ordersPaused ? '1' : '0');
  } catch (_) {}
}

function persistOrdersScheduleToLocalStorage() {
  try {
    localStorage.setItem(ORDERS_OPEN_TIME_STORAGE_KEY, normalizeTimeValue(ordersOpenTime, DEFAULT_ORDERS_OPEN_TIME));
    localStorage.setItem(ORDERS_CLOSE_TIME_STORAGE_KEY, normalizeTimeValue(ordersCloseTime, DEFAULT_ORDERS_CLOSE_TIME));
  } catch (_) {}
}

function persistOrderHistoryToLocalStorage(history) {
  try {
    localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(normalizeOrderHistoryEntries(history)));
  } catch (_) {}
}

function persistAdminServerSnapshot(snapshot) {
  try {
    if (Array.isArray(snapshot?.categories)) {
      localStorage.setItem(MENU_CATEGORIES_STORAGE_KEY, JSON.stringify(snapshot.categories));
    }
    if (Array.isArray(snapshot?.menu)) {
      localStorage.setItem(MENU_CATALOG_STORAGE_KEY, JSON.stringify(snapshot.menu));
    }
    if (Array.isArray(snapshot?.orders)) {
      persistOrderHistoryToLocalStorage(snapshot.orders);
    }
    localStorage.setItem(ORDERS_PAUSED_STORAGE_KEY, snapshot?.ordersPaused ? '1' : '0');
    localStorage.setItem(
      ORDERS_OPEN_TIME_STORAGE_KEY,
      normalizeTimeValue(snapshot?.ordersOpenTime || DEFAULT_ORDERS_OPEN_TIME, DEFAULT_ORDERS_OPEN_TIME)
    );
    localStorage.setItem(
      ORDERS_CLOSE_TIME_STORAGE_KEY,
      normalizeTimeValue(snapshot?.ordersCloseTime || DEFAULT_ORDERS_CLOSE_TIME, DEFAULT_ORDERS_CLOSE_TIME)
    );
  } catch (_) {}
  if (typeof snapshot?.ordersAccessGranted === 'boolean') {
    adminOrdersAccessAuthenticated = snapshot.ordersAccessGranted;
  }
  trackAdminIncomingOrders(normalizeOrderHistoryEntries(snapshot?.orders));
}

async function syncAdminStateFromServer() {
  const snapshot = await requestJson(ADMIN_STATE_ENDPOINT, { method: 'GET' });
  persistAdminServerSnapshot(snapshot);
  return snapshot;
}

async function saveApplicationState() {
  persistMenuCategoriesToLocalStorage();
  persistMenuCatalogToLocalStorage();
  persistOrdersPausedToLocalStorage();
  persistOrdersScheduleToLocalStorage();
  const snapshot = await requestJson(ADMIN_STATE_ENDPOINT, {
    method: 'PUT',
    body: JSON.stringify({
      categories: getMenuCategoriesPayload(),
      menu: getMenuCatalogPayload(),
      ordersPaused,
      ordersOpenTime,
      ordersCloseTime
    })
  });
  persistAdminServerSnapshot(snapshot);
  loadStateFromLocalStorage();
  return snapshot;
}

function startAdminStateRefresh() {
  if (adminStateRefreshTimerId !== null) {
    window.clearInterval(adminStateRefreshTimerId);
  }
  adminStateRefreshTimerId = window.setInterval(() => {
    if (!adminAuthenticated) {
      return;
    }
    void syncAdminStateFromServer()
      .then(() => {
        loadStateFromLocalStorage();
        refreshAdminPanel();
      })
      .catch((error) => {
        if (error?.status === 401) {
          showAdminLoginView();
        }
      });
  }, ADMIN_STATE_REFRESH_INTERVAL_MS);
}

async function restoreAdminStateFromServer() {
  await syncAdminStateFromServer();
  loadStateFromLocalStorage();
  refreshAdminPanel();
}

function applyMenuCategoriesSnapshot(savedCategories) {
  menuCategories = DEFAULT_MENU_CATEGORIES.map((category) => ({ ...category }));
  if (!Array.isArray(savedCategories)) {
    return;
  }
  const normalizedCategories = [];
  const usedIds = new Set();
  savedCategories.forEach((savedCategory) => {
    const id = normalizeCategoryId(savedCategory?.id || savedCategory?.value || savedCategory);
    if (!id || usedIds.has(id)) {
      return;
    }
    normalizedCategories.push({
      id,
      label: formatCategoryLabel(savedCategory?.label || savedCategory?.name || categoryLabelFromId(id)),
      hidden: Boolean(savedCategory?.hidden)
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
    const candidateId = String(savedItem?.id || fallbackId).trim() || fallbackId;
    const itemId = usedIds.has(candidateId) ? `${candidateId}-${index + 1}` : candidateId;
    usedIds.add(itemId);
    const unitPrice = parseBRL(savedItem?.unitPrice);
    const categoryId = ensureCategoryExists(
      savedItem?.category,
      savedItem?.categoryLabel || categoryLabelFromId(savedItem?.category)
    );
    normalizedItems.push({
      id: itemId,
      category: normalizeMenuCategory(categoryId, getDefaultCategoryId()),
      title: sanitizeMenuText(savedItem?.title, `Item ${index + 1}`),
      ingredients: sanitizeMenuText(savedItem?.ingredients, 'Ingredientes nao informados.'),
      unitPrice,
      priceText: formatBRL(unitPrice),
      hidden: Boolean(savedItem?.hidden),
      outOfStock: Boolean(savedItem?.outOfStock)
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
    ordersPaused = localStorage.getItem(ORDERS_PAUSED_STORAGE_KEY) === '1';
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
        localStorage.getItem(ORDERS_OPEN_TIME_STORAGE_KEY) || DEFAULT_ORDERS_OPEN_TIME,
        DEFAULT_ORDERS_OPEN_TIME
      );
      ordersCloseTime = normalizeTimeValue(
        localStorage.getItem(ORDERS_CLOSE_TIME_STORAGE_KEY) || DEFAULT_ORDERS_CLOSE_TIME,
        DEFAULT_ORDERS_CLOSE_TIME
      );
      return;
    }
    ordersOpenTime = DEFAULT_ORDERS_OPEN_TIME;
    ordersCloseTime = normalizeTimeValue(
      localStorage.getItem(LEGACY_ORDERS_CUTOFF_TIME_STORAGE_KEY) || DEFAULT_ORDERS_CLOSE_TIME,
      DEFAULT_ORDERS_CLOSE_TIME
    );
  } catch (_) {
    ordersOpenTime = DEFAULT_ORDERS_OPEN_TIME;
    ordersCloseTime = DEFAULT_ORDERS_CLOSE_TIME;
  }
}

function loadStateFromLocalStorage() {
  loadMenuCategoriesState();
  loadMenuCatalogState();
  loadOrdersPausedState();
  loadOrdersScheduleState();
  menuCatalog.forEach((item) => {
    ensureCategoryExists(item.category, categoryLabelFromId(item.category));
  });
}

function createNextMenuItemId() {
  const nextIndex =
    menuCatalog.reduce((max, item) => {
      const match = /^item-(\d+)$/.exec(item.id);
      const value = match ? Number.parseInt(match[1], 10) : 0;
      return Number.isInteger(value) ? Math.max(max, value) : max;
    }, 0) + 1;
  return `item-${nextIndex}`;
}

function renderCategoryOptions(selectElement, selectedId) {
  if (!selectElement) {
    return;
  }
  const fallbackCategory = getDefaultCategoryId();
  const nextSelected = normalizeMenuCategory(selectedId || selectElement.value, fallbackCategory);
  selectElement.innerHTML = '';
  menuCategories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.hidden ? `${category.label} (oculto)` : category.label;
    option.selected = category.id === nextSelected;
    selectElement.appendChild(option);
  });
  selectElement.value = nextSelected;
}

function getCurrentTimeValue() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function ensureAdminCounterPickupTimeValue() {
  if (!adminCounterPickupTimeInput) {
    return;
  }
  adminCounterPickupTimeInput.value = normalizeTimeValue(
    adminCounterPickupTimeInput.value,
    normalizeTimeValue(getCurrentTimeValue(), DEFAULT_ORDERS_OPEN_TIME)
  );
}

function getAdminCounterAvailableItems() {
  return menuCatalog
    .filter((item) => !item.outOfStock)
    .slice()
    .sort((left, right) => {
      const categoryCompare = getCategoryLabel(left.category).localeCompare(getCategoryLabel(right.category), 'pt-BR');
      if (categoryCompare !== 0) {
        return categoryCompare;
      }
      return left.title.localeCompare(right.title, 'pt-BR');
    });
}

function renderAdminCounterItemOptions(selectedId) {
  if (!adminCounterItemSelect) {
    return;
  }
  const availableItems = getAdminCounterAvailableItems();
  const preferredId =
    availableItems.find((item) => item.id === selectedId)?.id ||
    availableItems.find((item) => item.id === adminCounterItemSelect.value)?.id ||
    availableItems[0]?.id ||
    '';
  adminCounterItemSelect.innerHTML = '';
  if (availableItems.length === 0) {
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Nenhum item disponivel no momento';
    adminCounterItemSelect.appendChild(emptyOption);
    adminCounterItemSelect.disabled = true;
    if (adminCounterAddItemButton) {
      adminCounterAddItemButton.disabled = true;
    }
    return;
  }
  availableItems.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.selected = item.id === preferredId;
    const hiddenLabel = item.hidden || isCategoryHidden(item.category) ? ' | oculto no online' : '';
    option.textContent = `${item.title} | ${getCategoryLabel(item.category)} | ${formatBRL(item.unitPrice)}${hiddenLabel}`;
    adminCounterItemSelect.appendChild(option);
  });
  adminCounterItemSelect.disabled = false;
  adminCounterItemSelect.value = preferredId;
  if (adminCounterAddItemButton) {
    adminCounterAddItemButton.disabled = false;
  }
}

function getAdminCounterCartTotal() {
  return adminCounterCart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

function createAdminCounterOrderCard(order) {
  const card = document.createElement('article');
  card.className = 'admin-order-card is-source-counter';

  const topLine = document.createElement('div');
  topLine.className = 'admin-order-topline';
  const codeChip = document.createElement('span');
  codeChip.className = 'admin-order-chip is-code';
  codeChip.textContent = getOrderDisplayCode(order);
  const statusChip = document.createElement('span');
  statusChip.className = `admin-order-badge ${order?.status === ORDER_STATUS_READY ? 'is-ready' : 'is-pending'}`;
  statusChip.textContent =
    order?.status === ORDER_STATUS_READY && order?.readyAt
      ? `Pronto desde ${formatDateTime(order.readyAt)}`
      : order?.status === ORDER_STATUS_READY
        ? 'Pronto'
        : 'Em preparo';
  const pickupChip = document.createElement('span');
  pickupChip.className = 'admin-order-chip';
  pickupChip.textContent = `Retirada ${formatPickupTime(order?.pickupTime)}`;
  topLine.append(codeChip, statusChip, pickupChip);

  const head = document.createElement('div');
  head.className = 'admin-order-head';
  const titleWrap = document.createElement('div');
  titleWrap.className = 'admin-order-main';
  const title = document.createElement('h3');
  title.className = 'admin-item-title';
  title.textContent = sanitizeMenuText(order?.customerName, 'Pedido de balcao');
  const meta = document.createElement('p');
  meta.className = 'admin-item-meta';
  meta.textContent = `Canal: ${getOrderSourceLabel(order)} | Recebido: ${formatDateTime(order?.createdAt)}`;
  titleWrap.append(title, meta);
  const total = document.createElement('p');
  total.className = 'admin-order-meta';
  total.textContent = `Total: ${sanitizeMenuText(order?.totalFormatted, formatBRL(parseBRL(order?.total)))}`;
  head.append(titleWrap, total);

  const items = document.createElement('div');
  items.className = 'admin-order-items';
  (Array.isArray(order?.items) ? order.items : []).forEach((item) => {
    const entry = document.createElement('article');
    entry.className = 'admin-order-item';
    const text = document.createElement('p');
    text.className = 'admin-order-item-title';
    text.textContent = `${sanitizeMenuText(item?.title, 'Item')} x${Math.max(1, Number.parseInt(item?.quantity, 10) || 1)}`;
    entry.appendChild(text);
    items.appendChild(entry);
  });

  card.append(topLine, head, items);
  const generalNotes = String(order?.notes || '').trim();
  if (generalNotes) {
    const note = document.createElement('div');
    note.className = 'admin-order-notes';
    const noteLabel = document.createElement('p');
    noteLabel.className = 'admin-order-section-label';
    noteLabel.textContent = 'Observacao';
    const noteCopy = document.createElement('p');
    noteCopy.className = 'admin-order-item-copy';
    noteCopy.textContent = generalNotes;
    note.append(noteLabel, noteCopy);
    card.appendChild(note);
  }
  return card;
}

function renderAdminCounterHistory(historyOrders, totalReadyCount) {
  if (
    !adminCounterHistorySection ||
    !adminCounterHistoryStatus ||
    !adminCounterHistoryList ||
    !adminCounterHistoryToggle
  ) {
    return;
  }
  adminCounterHistoryList.innerHTML = '';
  const hasReadyOrders = totalReadyCount > 0;
  if (!hasReadyOrders) {
    adminCounterHistorySection.hidden = true;
    adminCounterHistoryList.hidden = true;
    adminCounterHistoryToggle.hidden = true;
    adminCounterHistoryToggle.setAttribute('aria-expanded', 'false');
    if (adminCounterHistoryClearButton) {
      adminCounterHistoryClearButton.disabled = true;
    }
    return;
  }
  adminCounterHistorySection.hidden = false;
  adminCounterHistoryToggle.hidden = historyOrders.length === 0;
  if (adminCounterHistoryClearButton) {
    adminCounterHistoryClearButton.disabled = historyOrders.length === 0;
  }
  adminCounterHistoryToggle.setAttribute('aria-expanded', String(adminCounterHistoryExpanded));
  if (!adminCounterHistoryToggle.hidden) {
    adminCounterHistoryToggle.textContent = adminCounterHistoryExpanded
      ? 'Ocultar historico'
      : `Ver historico (${historyOrders.length})`;
  }
  if (historyOrders.length === 0) {
    adminCounterHistoryList.hidden = true;
    adminCounterHistoryStatus.textContent =
      `${totalReadyCount} pedido(s) de balcao pronto(s) existem no historico, mas nao estao disponiveis nesta visao.`;
    return;
  }
  adminCounterHistoryStatus.textContent = adminCounterHistoryExpanded
    ? `${historyOrders.length} pedido(s) prontos do balcao no historico.`
    : `${historyOrders.length} pedido(s) prontos do balcao escondidos para manter a fila principal limpa.`;
  adminCounterHistoryList.hidden = !adminCounterHistoryExpanded;
  if (!adminCounterHistoryExpanded) {
    return;
  }
  historyOrders.forEach((order) => {
    adminCounterHistoryList.appendChild(createAdminCounterOrderCard(order));
  });
}

function renderAdminCounterRecentOrders() {
  if (!adminCounterOrdersList) {
    return;
  }
  const counterOrders = loadOrderHistory()
    .filter((order) => normalizeOrderSource(order?.source) === 'counter')
    .sort((left, right) => new Date(right?.createdAt || 0).getTime() - new Date(left?.createdAt || 0).getTime());
  const activeOrders = counterOrders.filter((order) => order.status !== ORDER_STATUS_READY);
  const historyOrders = counterOrders.filter((order) => order.status === ORDER_STATUS_READY);
  adminCounterOrdersList.innerHTML = '';
  renderAdminCounterHistory(historyOrders, historyOrders.length);
  if (counterOrders.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'owner-status owner-status-soft';
    empty.textContent = 'Nenhum pedido de balcao registrado ainda.';
    adminCounterOrdersList.appendChild(empty);
    return;
  }
  if (activeOrders.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'owner-status owner-status-soft';
    empty.textContent =
      historyOrders.length > 0
        ? 'A fila do balcao esta limpa. Os pedidos prontos foram movidos para o historico abaixo.'
        : 'Nenhum pedido de balcao ativo no momento.';
    adminCounterOrdersList.appendChild(empty);
    return;
  }
  activeOrders.forEach((order) => {
    adminCounterOrdersList.appendChild(createAdminCounterOrderCard(order));
  });
}

function renderAdminCounterCart() {
  if (!adminCounterCartItems || !adminCounterCartEmpty || !adminCounterOrderTotal) {
    return;
  }
  adminCounterCartItems.innerHTML = '';
  if (adminCounterCart.length === 0) {
    adminCounterCartEmpty.hidden = false;
    adminCounterOrderTotal.textContent = `Valor total: ${formatBRL(0)}`;
    return;
  }
  adminCounterCartEmpty.hidden = true;
  adminCounterCart.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'cart-item';
    card.dataset.itemId = item.id;

    const head = document.createElement('div');
    head.className = 'cart-head';
    const name = document.createElement('p');
    name.className = 'cart-name';
    name.textContent = item.title;
    const price = document.createElement('p');
    price.className = 'cart-price';
    price.textContent = formatBRL(item.unitPrice * item.quantity);
    head.append(name, price);

    const ingredients = document.createElement('p');
    ingredients.className = 'cart-ingredients';
    ingredients.textContent = item.ingredients;

    const actions = document.createElement('div');
    actions.className = 'cart-actions';
    const qtyControl = document.createElement('div');
    qtyControl.className = 'qty-control';
    const decreaseButton = document.createElement('button');
    decreaseButton.type = 'button';
    decreaseButton.className = 'qty-btn';
    decreaseButton.dataset.action = 'decrease-counter-item';
    decreaseButton.textContent = '-';
    const qtyValue = document.createElement('span');
    qtyValue.className = 'qty-value';
    qtyValue.textContent = String(item.quantity);
    const increaseButton = document.createElement('button');
    increaseButton.type = 'button';
    increaseButton.className = 'qty-btn';
    increaseButton.dataset.action = 'increase-counter-item';
    increaseButton.textContent = '+';
    qtyControl.append(decreaseButton, qtyValue, increaseButton);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-item';
    removeButton.dataset.action = 'remove-counter-item';
    removeButton.textContent = 'Remover';
    actions.append(qtyControl, removeButton);

    card.append(head, ingredients, actions);
    adminCounterCartItems.appendChild(card);
  });
  adminCounterOrderTotal.textContent = `Valor total: ${formatBRL(getAdminCounterCartTotal())}`;
}

function renderAdminCounterPanel() {
  renderAdminCounterItemOptions(adminCounterItemSelect?.value);
  ensureAdminCounterPickupTimeValue();
  renderAdminCounterCart();
  renderAdminCounterRecentOrders();
}

function addItemToAdminCounterCart(itemId, quantityValue) {
  const selectedItem = itemId ? menuById.get(itemId) : null;
  if (!selectedItem || selectedItem.outOfStock) {
    if (adminCounterStatus) {
      adminCounterStatus.textContent = 'Selecione um item disponivel para adicionar ao pedido do balcao.';
    }
    return;
  }
  const quantity = Math.max(1, Number.parseInt(quantityValue, 10) || 1);
  const existingItem = adminCounterCart.find((item) => item.id === selectedItem.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    adminCounterCart.push({
      id: selectedItem.id,
      title: selectedItem.title,
      ingredients: selectedItem.ingredients,
      unitPrice: selectedItem.unitPrice,
      quantity
    });
  }
  if (adminCounterQuantityInput) {
    adminCounterQuantityInput.value = '1';
  }
  renderAdminCounterCart();
  if (adminCounterStatus) {
    adminCounterStatus.textContent = `${selectedItem.title} adicionado ao pedido do balcao.`;
  }
}

function updateAdminCounterItemQuantity(itemId, nextQuantity) {
  const targetItem = adminCounterCart.find((item) => item.id === itemId);
  if (!targetItem) {
    return;
  }
  if (nextQuantity <= 0) {
    adminCounterCart = adminCounterCart.filter((item) => item.id !== itemId);
  } else {
    targetItem.quantity = nextQuantity;
  }
  renderAdminCounterCart();
}

function clearAdminCounterDraft() {
  adminCounterCart = [];
  adminCounterOrderForm?.reset();
  if (adminCounterQuantityInput) {
    adminCounterQuantityInput.value = '1';
  }
  renderAdminCounterItemOptions();
  ensureAdminCounterPickupTimeValue();
  renderAdminCounterCart();
  renderAdminCounterRecentOrders();
}

function buildAdminCounterOrderEntry() {
  if (adminCounterCart.length === 0) {
    throw createAdminValidationError('Adicione pelo menos um item ao pedido de balcao.', adminCounterItemSelect, 'counter');
  }
  ensureAdminCounterPickupTimeValue();
  const pickupTime = normalizeTimeValue(
    adminCounterPickupTimeInput?.value,
    normalizeTimeValue(getCurrentTimeValue(), DEFAULT_ORDERS_OPEN_TIME)
  );
  const customerName = sanitizeMenuText(adminCounterCustomerNameInput?.value, 'Pedido de balcao');
  const notes = sanitizeMenuText(adminCounterNotesInput?.value, '');
  const total = getAdminCounterCartTotal();
  return {
    id: `order-${Date.now()}`,
    customerName,
    pickupTime,
    notes,
    total,
    totalFormatted: formatBRL(total),
    createdAt: new Date().toISOString(),
    status: ORDER_STATUS_PENDING,
    readyAt: null,
    source: 'counter',
    items: adminCounterCart.map((item) => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      ingredients: item.ingredients,
      note: '',
      totalPrice: item.unitPrice * item.quantity,
      totalFormatted: formatBRL(item.unitPrice * item.quantity)
    }))
  };
}

async function submitAdminCounterOrder() {
  const orderEntry = buildAdminCounterOrderEntry();
  const response = await requestJson(CREATE_ORDER_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(orderEntry)
  });
  clearAdminCounterDraft();
  return normalizeOrderHistoryEntries([response?.order || orderEntry])[0];
}

function setAdminSaveAllVisibility() {
  if (!adminSaveAllContainer || !adminSaveAllButton) {
    return;
  }
  const shouldShow = adminAuthenticated;
  const canSave = true;
  adminSaveAllContainer.hidden = !shouldShow;
  adminSaveAllButton.disabled = !canSave;
}

function createAdminValidationError(message, focusTarget, panelName = 'menu') {
  const error = new Error(message);
  error.isValidationError = true;
  error.focusTarget = focusTarget || null;
  error.panelName = panelName;
  return error;
}

function readAdminMenuEditorDraft(editor, currentItem) {
  const categoryInput = editor?.querySelector('[data-field="category"]');
  const titleInput = editor?.querySelector('[data-field="title"]');
  const priceInput = editor?.querySelector('[data-field="price"]');
  const ingredientsInput = editor?.querySelector('[data-field="ingredients"]');
  const nextTitle = sanitizeMenuText(titleInput?.value, currentItem.title);
  const rawPrice = typeof priceInput?.value === 'string' ? priceInput.value.trim() : '';
  if (!/\d/.test(rawPrice)) {
    throw createAdminValidationError(`Informe um preco valido para o item "${nextTitle}".`, priceInput, 'menu');
  }
  const unitPrice = parseBRL(rawPrice);
  return {
    category: normalizeMenuCategory(categoryInput?.value, currentItem.category),
    title: nextTitle,
    ingredients: sanitizeMenuText(ingredientsInput?.value, currentItem.ingredients),
    unitPrice,
    priceText: formatBRL(unitPrice)
  };
}

function applyAdminMenuItemDraft(currentItem, draft) {
  currentItem.category = draft.category;
  currentItem.title = draft.title;
  currentItem.ingredients = draft.ingredients;
  currentItem.unitPrice = draft.unitPrice;
  currentItem.priceText = draft.priceText;
}

function collectAdminMenuEditorDrafts(editors) {
  const pendingUpdates = [];
  (Array.isArray(editors) ? editors : []).forEach((editor) => {
    const itemId = editor?.dataset.itemId;
    const currentItem = itemId ? menuById.get(itemId) : null;
    if (!currentItem) {
      return;
    }
    pendingUpdates.push({
      currentItem,
      draft: readAdminMenuEditorDraft(editor, currentItem)
    });
  });
  return pendingUpdates;
}

async function persistAdminStateWithRollback() {
  try {
    await saveApplicationState();
  } catch (error) {
    await restoreAdminStateFromServer().catch(() => {});
    throw error;
  }
}

async function saveAdminMenuEditors(editors) {
  const pendingUpdates = collectAdminMenuEditorDrafts(editors);
  if (pendingUpdates.length === 0) {
    return [];
  }
  pendingUpdates.forEach(({ currentItem, draft }) => {
    applyAdminMenuItemDraft(currentItem, draft);
  });
  await persistAdminStateWithRollback();
  return pendingUpdates.map(({ currentItem }) => currentItem.title);
}

function readAdminScheduleDraft() {
  return {
    ordersPaused,
    ordersOpenTime: normalizeTimeValue(ordersOpenTimeInput?.value, DEFAULT_ORDERS_OPEN_TIME),
    ordersCloseTime: normalizeTimeValue(ordersCloseTimeInput?.value, DEFAULT_ORDERS_CLOSE_TIME)
  };
}

function applyAdminScheduleDraft(draft) {
  ordersPaused = Boolean(draft?.ordersPaused);
  ordersOpenTime = normalizeTimeValue(draft?.ordersOpenTime, DEFAULT_ORDERS_OPEN_TIME);
  ordersCloseTime = normalizeTimeValue(draft?.ordersCloseTime, DEFAULT_ORDERS_CLOSE_TIME);
  if (ordersOpenTimeInput) {
    ordersOpenTimeInput.value = ordersOpenTime;
  }
  if (ordersCloseTimeInput) {
    ordersCloseTimeInput.value = ordersCloseTime;
  }
}

function readPendingAdminCategoryDraft() {
  const categoryLabel = formatCategoryLabel(adminNewCategoryNameInput?.value, '');
  if (!categoryLabel) {
    return null;
  }
  const categoryId = normalizeCategoryId(categoryLabel);
  if (!categoryId) {
    throw createAdminValidationError('Informe um nome valido para o novo menu.', adminNewCategoryNameInput, 'categories');
  }
  if (menuCategories.some((category) => category.id === categoryId)) {
    throw createAdminValidationError(`O menu "${getCategoryLabel(categoryId)}" ja existe.`, adminNewCategoryNameInput, 'categories');
  }
  return { id: categoryId, label: categoryLabel, hidden: false };
}

function applyPendingAdminCategoryDraft(draft) {
  if (!draft) {
    return;
  }
  menuCategories.push({ ...draft });
}

function getAdminNewMenuDraftFocusTarget(title, ingredients, rawPrice) {
  if (!title) {
    return adminNewTitleInput;
  }
  if (!ingredients) {
    return adminNewIngredientsInput;
  }
  if (!/\d/.test(rawPrice)) {
    return adminNewPriceInput;
  }
  return adminNewTitleInput;
}

function readPendingAdminNewMenuItemDraft() {
  const title = sanitizeMenuText(adminNewTitleInput?.value, '');
  const ingredients = sanitizeMenuText(adminNewIngredientsInput?.value, '');
  const rawPrice = String(adminNewPriceInput?.value || '').trim();
  const hasDraft = Boolean(title || ingredients || rawPrice);
  if (!hasDraft) {
    return null;
  }
  if (!title || !ingredients || !/\d/.test(rawPrice)) {
    throw createAdminValidationError(
      'Preencha categoria, nome, ingredientes e preco do novo item antes de salvar tudo.',
      getAdminNewMenuDraftFocusTarget(title, ingredients, rawPrice),
      'menu'
    );
  }
  const unitPrice = parseBRL(rawPrice);
  return {
    id: createNextMenuItemId(),
    title,
    priceText: formatBRL(unitPrice),
    unitPrice,
    ingredients,
    category: normalizeMenuCategory(adminNewCategoryInput?.value, getDefaultCategoryId()),
    hidden: false,
    outOfStock: false
  };
}

function applyPendingAdminNewMenuItemDraft(draft) {
  if (!draft) {
    return;
  }
  menuCatalog.push(draft);
  menuById.set(draft.id, draft);
}

function renderAdminMenuEditor() {
  if (!adminMenuEditor) {
    return;
  }
  adminMenuEditor.innerHTML = '';
  if (menuCatalog.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'owner-status owner-status-soft';
    empty.textContent = 'Nenhum item no cardapio. Use o formulario acima para adicionar o primeiro item.';
    adminMenuEditor.appendChild(empty);
    return;
  }
  menuCatalog.forEach((item) => {
    const editor = document.createElement('article');
    editor.className = 'admin-item-editor';
    editor.dataset.itemId = item.id;

    const head = document.createElement('div');
    head.className = 'admin-item-head';
    const title = document.createElement('h3');
    title.className = 'admin-item-title';
    title.textContent = item.title;
    const meta = document.createElement('p');
    meta.className = 'admin-item-meta';
    meta.textContent =
      `${getCategoryLabel(item.category)}` +
      `${item.hidden ? ' • Item oculto' : ''}` +
      `${item.outOfStock ? ' • Em falta' : ''}`;
    head.append(title, meta);

    const grid = document.createElement('div');
    grid.className = 'admin-editor-grid';
    const categoryField = document.createElement('label');
    categoryField.className = 'field';
    const categoryLabel = document.createElement('span');
    categoryLabel.textContent = 'Categoria';
    const categorySelect = document.createElement('select');
    categorySelect.dataset.field = 'category';
    menuCategories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.hidden ? `${category.label} (oculto)` : category.label;
      option.selected = category.id === item.category;
      categorySelect.appendChild(option);
    });
    categoryField.append(categoryLabel, categorySelect);

    const priceField = document.createElement('label');
    priceField.className = 'field';
    const priceLabel = document.createElement('span');
    priceLabel.textContent = 'Preco';
    const priceInput = document.createElement('input');
    priceInput.type = 'text';
    priceInput.dataset.field = 'price';
    priceInput.setAttribute('inputmode', 'decimal');
    priceInput.value = formatPriceInputValue(item.unitPrice);
    priceField.append(priceLabel, priceInput);
    grid.append(categoryField, priceField);

    const titleField = document.createElement('label');
    titleField.className = 'field';
    const titleText = document.createElement('span');
    titleText.textContent = 'Nome do item';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.dataset.field = 'title';
    titleInput.value = item.title;
    titleField.append(titleText, titleInput);

    const ingredientsField = document.createElement('label');
    ingredientsField.className = 'field';
    const ingredientsLabel = document.createElement('span');
    ingredientsLabel.textContent = 'Ingredientes';
    const ingredientsInput = document.createElement('textarea');
    ingredientsInput.rows = 3;
    ingredientsInput.dataset.field = 'ingredients';
    ingredientsInput.value = item.ingredients;
    ingredientsField.append(ingredientsLabel, ingredientsInput);

    const actions = document.createElement('div');
    actions.className = 'admin-editor-actions';
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'owner-toggle';
    saveButton.dataset.action = 'save-menu-item';
    saveButton.textContent = 'Salvar item';
    const toggleOutOfStockButton = document.createElement('button');
    toggleOutOfStockButton.type = 'button';
    toggleOutOfStockButton.className = 'owner-toggle';
    toggleOutOfStockButton.dataset.action = 'toggle-out-of-stock';
    toggleOutOfStockButton.textContent = item.outOfStock ? 'Marcar disponivel' : 'Marcar em falta';
    const toggleHiddenButton = document.createElement('button');
    toggleHiddenButton.type = 'button';
    toggleHiddenButton.className = 'owner-toggle';
    toggleHiddenButton.dataset.action = 'toggle-menu-visibility';
    toggleHiddenButton.textContent = item.hidden ? 'Mostrar item' : 'Ocultar item';
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'owner-toggle';
    removeButton.dataset.action = 'remove-menu-item';
    removeButton.textContent = 'Remover item';
    actions.append(saveButton, toggleOutOfStockButton, toggleHiddenButton, removeButton);

    editor.append(head, grid, titleField, ingredientsField, actions);
    adminMenuEditor.appendChild(editor);
  });
}

function renderAdminCategoryEditor() {
  if (!adminCategoryEditor) {
    return;
  }
  adminCategoryEditor.innerHTML = '';
  if (menuCategories.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'owner-status owner-status-soft';
    empty.textContent = 'Nenhum menu cadastrado.';
    adminCategoryEditor.appendChild(empty);
    return;
  }
  menuCategories.forEach((category) => {
    const editor = document.createElement('article');
    editor.className = 'admin-item-editor';
    editor.dataset.categoryId = category.id;
    const head = document.createElement('div');
    head.className = 'admin-item-head';
    const title = document.createElement('h3');
    title.className = 'admin-item-title';
    title.textContent = category.label;
    const meta = document.createElement('p');
    meta.className = 'admin-item-meta';
    meta.textContent = `${menuCatalog.filter((item) => item.category === category.id).length} item(ns)${
      category.hidden ? ' • Oculto na pagina' : ''
    }`;
    head.append(title, meta);
    const actions = document.createElement('div');
    actions.className = 'admin-editor-actions';
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'owner-toggle';
    toggleButton.dataset.action = 'toggle-category-visibility';
    toggleButton.textContent = category.hidden ? 'Mostrar menu' : 'Ocultar menu';
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'owner-toggle';
    removeButton.dataset.action = 'remove-category';
    removeButton.textContent = 'Remover menu';
    actions.append(toggleButton, removeButton);
    editor.append(head, actions);
    adminCategoryEditor.appendChild(editor);
  });
}

function loadOrderHistory() {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return normalizeOrderHistoryEntries(parsed);
  } catch (_) {
    return [];
  }
}

function persistOrderHistory(history) {
  try {
    localStorage.setItem(
      ORDER_HISTORY_STORAGE_KEY,
      JSON.stringify(normalizeOrderHistoryEntries(history).slice(0, 200))
    );
  } catch (_) {}
}

async function setOrderReadyStatus(orderId, isReady) {
  const snapshot = await requestJson(ADMIN_ORDERS_ENDPOINT, {
    method: 'PATCH',
    body: JSON.stringify({ orderId, isReady })
  });
  persistAdminServerSnapshot(snapshot);
  loadStateFromLocalStorage();
  return true;
}

async function clearAdminOrderHistory(scope) {
  const snapshot = await requestJson(ADMIN_ORDERS_ENDPOINT, {
    method: 'DELETE',
    body: JSON.stringify({ scope })
  });
  persistAdminServerSnapshot(snapshot);
  loadStateFromLocalStorage();
  return snapshot;
}

function createAdminOrderCard(order) {
  const card = document.createElement('article');
  card.className = 'admin-order-card';
  card.dataset.orderId = String(order?.id || '');
  const sourceIsCounter = normalizeOrderSource(order?.source) === 'counter';
  card.classList.add(sourceIsCounter ? 'is-source-counter' : 'is-source-whatsapp');

  const topLine = document.createElement('div');
  topLine.className = 'admin-order-topline';
  const codeChip = document.createElement('span');
  codeChip.className = 'admin-order-chip is-code';
  codeChip.textContent = getOrderDisplayCode(order);
  const sourceChip = document.createElement('span');
  sourceChip.className = `admin-order-chip ${sourceIsCounter ? 'is-source-counter' : 'is-source-whatsapp'}`;
  sourceChip.textContent = `Origem: ${getOrderSourceLabel(order)}`;
  const pickupChip = document.createElement('span');
  pickupChip.className = 'admin-order-chip';
  pickupChip.textContent = `Retirada ${formatPickupTime(order?.pickupTime)}`;
  const itemsChip = document.createElement('span');
  itemsChip.className = 'admin-order-chip';
  itemsChip.textContent = `${Array.isArray(order?.items) ? order.items.length : 0} item(ns)`;
  topLine.append(codeChip, sourceChip, pickupChip, itemsChip);

  const head = document.createElement('div');
  head.className = 'admin-order-head';
  const title = document.createElement('div');
  title.className = 'admin-order-main';
  const customer = document.createElement('h3');
  customer.className = 'admin-item-title';
  customer.textContent = sanitizeMenuText(order?.customerName, 'Cliente nao informado');
  const sourceNote = document.createElement('p');
  sourceNote.className = `admin-order-source-note ${sourceIsCounter ? 'is-source-counter' : 'is-source-whatsapp'}`;
  sourceNote.textContent = sourceIsCounter ? 'Pedido registrado no balcao' : 'Pedido recebido pelo WhatsApp';
  const pickup = document.createElement('p');
  pickup.className = 'admin-item-meta';
  pickup.textContent = `Recebido em ${formatDateTime(order?.createdAt)}`;
  title.append(customer, sourceNote, pickup);
  const totalBlock = document.createElement('div');
  totalBlock.className = 'admin-order-total';
  const totalLabel = document.createElement('span');
  totalLabel.className = 'admin-order-total-label';
  totalLabel.textContent = 'Total';
  const totalValue = document.createElement('strong');
  totalValue.className = 'admin-order-total-value';
  totalValue.textContent = sanitizeMenuText(order?.totalFormatted, formatBRL(parseBRL(order?.total)));
  totalBlock.append(totalLabel, totalValue);
  head.append(title, totalBlock);

  const statusRow = document.createElement('div');
  statusRow.className = 'admin-order-status-row';
  const isReady = order.status === ORDER_STATUS_READY;
  const statusBadge = document.createElement('span');
  statusBadge.className = `admin-order-badge ${isReady ? 'is-ready' : 'is-pending'}`;
  statusBadge.textContent =
    isReady && order.readyAt ? `Pronto desde ${formatDateTime(order.readyAt)}` : isReady ? 'Pronto' : 'Em preparo';
  const toggleStatusButton = document.createElement('button');
  toggleStatusButton.type = 'button';
  toggleStatusButton.className = 'owner-toggle admin-order-toggle';
  toggleStatusButton.dataset.action = 'toggle-order-ready';
  toggleStatusButton.dataset.orderId = String(order?.id || '');
  toggleStatusButton.dataset.nextReady = isReady ? '0' : '1';
  toggleStatusButton.textContent = isReady ? 'Voltar para preparo' : 'Marcar como pronto';
  statusRow.append(statusBadge, toggleStatusButton);

  const sectionLabel = document.createElement('p');
  sectionLabel.className = 'admin-order-section-label';
  sectionLabel.textContent = 'Itens do pedido';

  const items = document.createElement('div');
  items.className = 'admin-order-items';
  const orderItems = Array.isArray(order?.items) ? order.items : [];
  orderItems.forEach((item) => {
    const itemCard = document.createElement('article');
    itemCard.className = 'admin-order-item';
    const itemHead = document.createElement('div');
    itemHead.className = 'admin-order-item-headline';
    const itemTitle = document.createElement('p');
    itemTitle.className = 'admin-order-item-title';
    itemTitle.textContent = `${sanitizeMenuText(item?.title, 'Item')} x${Math.max(
      1,
      Number.parseInt(item?.quantity, 10) || 1
    )}`;
    const itemSubtotal = document.createElement('p');
    itemSubtotal.className = 'admin-order-item-total';
    itemSubtotal.textContent = sanitizeMenuText(item?.totalFormatted, formatBRL(parseBRL(item?.totalPrice)));
    itemHead.append(itemTitle, itemSubtotal);
    const itemIngredients = document.createElement('p');
    itemIngredients.className = 'admin-order-item-copy';
    itemIngredients.textContent = sanitizeMenuText(item?.ingredients, 'Ingredientes nao informados.');
    itemCard.append(itemHead, itemIngredients);
    const note = String(item?.note || '').trim();
    if (note) {
      const itemNote = document.createElement('p');
      itemNote.className = 'admin-order-item-note';
      itemNote.textContent = `Obs.: ${note}`;
      itemCard.appendChild(itemNote);
    }
    items.appendChild(itemCard);
  });
  card.append(topLine, head, statusRow, sectionLabel, items);
  const generalNotes = String(order?.notes || '').trim();
  if (generalNotes) {
    const note = document.createElement('div');
    note.className = 'admin-order-notes';
    const noteLabel = document.createElement('p');
    noteLabel.className = 'admin-order-section-label';
    noteLabel.textContent = 'Observacao geral';
    const noteCopy = document.createElement('p');
    noteCopy.className = 'admin-order-item-copy';
    noteCopy.textContent = generalNotes;
    note.append(noteLabel, noteCopy);
    card.appendChild(note);
  }
  return card;
}

function renderAdminOrdersHistory(historyOrders, totalReadyCount) {
  if (!adminOrdersHistorySection || !adminOrdersHistoryStatus || !adminOrdersHistoryList || !adminOrdersHistoryToggle) {
    return;
  }
  adminOrdersHistoryList.innerHTML = '';
  const hasReadyOrders = totalReadyCount > 0;
  if (!hasReadyOrders) {
    adminOrdersHistorySection.hidden = true;
    adminOrdersHistoryList.hidden = true;
    adminOrdersHistoryToggle.hidden = true;
    adminOrdersHistoryToggle.setAttribute('aria-expanded', 'false');
    if (adminOrdersHistoryClearButton) {
      adminOrdersHistoryClearButton.disabled = true;
    }
    return;
  }

  const isReadyFilter = activeAdminOrdersFilter === 'ready';
  const isExpanded = isReadyFilter || adminOrdersHistoryExpanded;
  adminOrdersHistorySection.hidden = false;
  adminOrdersHistoryToggle.hidden = historyOrders.length === 0 || isReadyFilter;
  if (adminOrdersHistoryClearButton) {
    adminOrdersHistoryClearButton.disabled = historyOrders.length === 0;
  }
  adminOrdersHistoryToggle.setAttribute('aria-expanded', String(isExpanded));
  if (!adminOrdersHistoryToggle.hidden) {
    adminOrdersHistoryToggle.textContent = isExpanded
      ? 'Ocultar historico'
      : `Ver historico (${historyOrders.length})`;
  }

  if (historyOrders.length === 0) {
    adminOrdersHistoryList.hidden = true;
    if (activeAdminOrdersFilter === 'pending') {
      adminOrdersHistoryStatus.textContent =
        `${totalReadyCount} pedido(s) pronto(s) seguem guardados no historico, mas o filtro atual mostra apenas a fila em preparo.`;
      return;
    }
    adminOrdersHistoryStatus.textContent =
      `Nenhum pedido pronto aparece neste filtro. ${totalReadyCount} pedido(s) pronto(s) seguem guardados no historico total.`;
    return;
  }

  adminOrdersHistoryStatus.textContent = isExpanded
    ? `${historyOrders.length} pedido(s) pronto(s) guardados no historico do filtro atual.`
    : `${historyOrders.length} pedido(s) pronto(s) escondidos no historico para manter a fila principal limpa.`;
  adminOrdersHistoryList.hidden = !isExpanded;
  if (!isExpanded) {
    return;
  }
  historyOrders.forEach((order) => {
    adminOrdersHistoryList.appendChild(createAdminOrderCard(order));
  });
}

function renderOrdersList() {
  if (!adminOrdersList || !adminOrdersStatus) {
    return;
  }
  const orders = sortAdminOrdersNewestFirst(loadOrderHistory());
  renderAdminOrdersOverview(orders);
  renderAdminOrdersFilters(orders);
  adminOrdersList.innerHTML = '';
  const readyCount = orders.filter((order) => order.status === ORDER_STATUS_READY).length;
  if (orders.length === 0) {
    adminOrdersStatus.textContent = 'Nenhum pedido recebido ainda.';
    renderAdminOrdersHistory([], readyCount);
    const empty = document.createElement('p');
    empty.className = 'owner-status owner-status-soft';
    empty.textContent = 'Quando um cliente enviar o pedido para o WhatsApp, ele sera listado aqui.';
    adminOrdersList.appendChild(empty);
    return;
  }
  const filteredOrders = filterAdminOrders(orders, activeAdminOrdersFilter);
  const pendingCount = orders.length - readyCount;
  const activeOrders = filteredOrders.filter((order) => order.status !== ORDER_STATUS_READY);
  const historyOrders = filteredOrders.filter((order) => order.status === ORDER_STATUS_READY);
  renderAdminOrdersHistory(historyOrders, readyCount);
  if (activeOrders.length === 0 && historyOrders.length > 0) {
    adminOrdersStatus.textContent =
      `Fila principal limpa neste filtro. ${historyOrders.length} pedido(s) pronto(s) foram movidos para o historico. ` +
      `${pendingCount} em preparo e ${readyCount} pronto(s) no total. Ultimo recebido em ${formatDateTime(orders[0]?.createdAt)}.`;
  } else {
    adminOrdersStatus.textContent =
      `${activeOrders.length} pedido(s) ativo(s) na fila. ${historyOrders.length} pronto(s) no historico do filtro atual. ` +
      `${pendingCount} em preparo e ${readyCount} pronto(s) no total. Ultimo recebido em ${formatDateTime(orders[0]?.createdAt)}.`;
  }
  if (activeOrders.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'owner-status owner-status-soft';
    empty.textContent =
      filteredOrders.length === 0
        ? 'Nenhum pedido encontrado para o filtro selecionado.'
        : historyOrders.length > 0
          ? 'Os pedidos prontos foram movidos para o historico abaixo.'
          : 'Nenhum pedido ativo aguardando preparo neste filtro.';
    adminOrdersList.appendChild(empty);
    return;
  }
  activeOrders.forEach((order) => {
    adminOrdersList.appendChild(createAdminOrderCard(order));
  });
}

function renderAdminOrdersOverview(orders) {
  if (!adminOrdersOverview) {
    return;
  }
  const pendingCount = orders.filter((order) => order.status !== ORDER_STATUS_READY).length;
  const readyCount = orders.filter((order) => order.status === ORDER_STATUS_READY).length;
  const whatsappCount = orders.filter((order) => normalizeOrderSource(order?.source) !== 'counter').length;
  const counterCount = orders.filter((order) => normalizeOrderSource(order?.source) === 'counter').length;
  const summaryCards = [
    { label: 'Total de pedidos', value: orders.length, copy: 'Historico atual do painel' },
    { label: 'WhatsApp', value: whatsappCount, copy: 'Pedidos recebidos pelo chat' },
    { label: 'Balcao', value: counterCount, copy: 'Atendimentos presenciais registrados' },
    { label: 'Em preparo', value: pendingCount, copy: 'Pedidos aguardando finalizacao' },
    { label: 'Prontos', value: readyCount, copy: 'Pedidos liberados para retirada' }
  ];
  adminOrdersOverview.innerHTML = '';
  summaryCards.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'admin-order-stat';
    const value = document.createElement('strong');
    value.className = 'admin-order-stat-value';
    value.textContent = String(entry.value);
    const label = document.createElement('p');
    label.className = 'admin-order-stat-label';
    label.textContent = entry.label;
    const copy = document.createElement('p');
    copy.className = 'admin-order-stat-copy';
    copy.textContent = entry.copy;
    card.append(value, label, copy);
    adminOrdersOverview.appendChild(card);
  });
}

function renderAdminOrdersFilters(orders) {
  if (!adminOrdersFilterButtons) {
    return;
  }
  adminOrdersFilterButtons.innerHTML = '';
  ADMIN_ORDER_FILTERS.forEach((filter) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `admin-orders-filter${activeAdminOrdersFilter === filter.id ? ' is-active' : ''}`;
    button.dataset.filter = filter.id;
    button.setAttribute('aria-pressed', String(activeAdminOrdersFilter === filter.id));
    button.textContent = `${filter.label} (${getAdminOrderFilterCount(filter.id, orders)})`;
    adminOrdersFilterButtons.appendChild(button);
  });
}

function syncAdminScheduleInputs() {
  if (!ordersOpenTimeInput || !ordersCloseTimeInput) {
    return;
  }
  ordersOpenTimeInput.value = ordersOpenTime;
  ordersCloseTimeInput.value = ordersCloseTime;
}

function updateScheduleStatus() {
  if (!ordersScheduleStatus) {
    return;
  }
  const windowLabel = getScheduleWindowLabel();
  ordersScheduleStatus.textContent = isOutsideScheduleNow()
    ? `Horario automatico ativo. Pedidos bloqueados agora (janela: ${windowLabel}).`
    : `Horario automatico ativo. Pedidos abertos agora (janela: ${windowLabel}).`;
}

function updateAdminControlStatus() {
  if (!ordersControlStatus || !pauseOnlineOrdersButton || !resumeOnlineOrdersButton) {
    updateScheduleStatus();
    return;
  }
  if (ordersPaused) {
    ordersControlStatus.textContent = 'Status atual: pedidos online em espera (pausa manual).';
    pauseOnlineOrdersButton.classList.add('is-active-pause');
    pauseOnlineOrdersButton.classList.remove('is-active-resume');
    resumeOnlineOrdersButton.classList.remove('is-active-resume', 'is-active-pause');
  } else if (isOutsideScheduleNow()) {
    ordersControlStatus.textContent = `Status atual: pedidos bloqueados por horario (${getScheduleWindowLabel()}).`;
    pauseOnlineOrdersButton.classList.remove('is-active-pause', 'is-active-resume');
    resumeOnlineOrdersButton.classList.remove('is-active-resume', 'is-active-pause');
  } else {
    ordersControlStatus.textContent = `Status atual: pedidos liberados na janela ${getScheduleWindowLabel()}.`;
    resumeOnlineOrdersButton.classList.add('is-active-resume');
    resumeOnlineOrdersButton.classList.remove('is-active-pause');
    pauseOnlineOrdersButton.classList.remove('is-active-pause', 'is-active-resume');
  }
  updateScheduleStatus();
}

function refreshAdminPanel() {
  syncAdminScheduleInputs();
  updateAdminControlStatus();
  setAdminSaveAllVisibility();
  renderCategoryOptions(adminNewCategoryInput, adminNewCategoryInput?.value);
  if (activeAdminPanel === 'counter') {
    renderAdminCounterPanel();
  }
  if (activeAdminPanel === 'menu') {
    renderAdminMenuEditor();
  }
  if (activeAdminPanel === 'categories') {
    renderAdminCategoryEditor();
  }
  if (activeAdminPanel === 'orders') {
    renderOrdersList();
  }
}

function setAdminPanel(panelName) {
  if (panelName === 'orders' && adminOrdersPanel) {
    activeAdminPanel = 'orders';
  } else if (panelName === 'counter' && adminCounterPanel) {
    activeAdminPanel = 'counter';
  } else if (panelName === 'menu' && adminMenuPanel) {
    activeAdminPanel = 'menu';
  } else if (panelName === 'categories' && adminCategoriesPanel) {
    activeAdminPanel = 'categories';
  } else {
    activeAdminPanel = 'schedule';
  }
  adminTabButtons.forEach((button) => {
    const isActive = button.dataset.panel === activeAdminPanel;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  if (adminSchedulePanel) {
    adminSchedulePanel.hidden = activeAdminPanel !== 'schedule';
  }
  if (adminOrdersPanel) {
    adminOrdersPanel.hidden = activeAdminPanel !== 'orders';
  }
  if (adminCounterPanel) {
    adminCounterPanel.hidden = activeAdminPanel !== 'counter';
  }
  if (adminCategoriesPanel) {
    adminCategoriesPanel.hidden = activeAdminPanel !== 'categories';
  }
  if (adminMenuPanel) {
    adminMenuPanel.hidden = activeAdminPanel !== 'menu';
  }
  setAdminSaveAllVisibility();
  syncAdminOrdersWakeLock();
  if (activeAdminPanel === 'orders') {
    renderOrdersList();
    if (pendingAdminNewOrderPopupOrder) {
      showAdminNewOrderPopup(pendingAdminNewOrderPopupOrder);
    } else {
      hideAdminNewOrderPopup();
    }
    return;
  }
  hideAdminNewOrderPopup();
  if (activeAdminPanel === 'counter') {
    if (adminCounterStatus) {
      adminCounterStatus.textContent = 'Monte o pedido e registre aqui os atendimentos do balcao.';
    }
    renderAdminCounterPanel();
    adminCounterItemSelect?.focus();
    return;
  }
  if (activeAdminPanel === 'categories') {
    if (adminCategoryStatus) {
      adminCategoryStatus.textContent = 'Crie uma categoria e depois use no cadastro de itens.';
    }
    renderAdminCategoryEditor();
    adminNewCategoryNameInput?.focus();
    return;
  }
  if (activeAdminPanel === 'menu') {
    if (adminMenuStatus) {
      adminMenuStatus.textContent = 'Selecione um item e salve as alteracoes.';
    }
    renderCategoryOptions(adminNewCategoryInput, adminNewCategoryInput?.value);
    renderAdminMenuEditor();
  }
}

function setRemovalStatus(type, message) {
  if (type === 'menu-item') {
    if (adminMenuStatus) {
      adminMenuStatus.textContent = message;
    }
    return;
  }
  if (adminCategoryStatus) {
    adminCategoryStatus.textContent = message;
  }
}

function setActiveAdminPanelStatus(message) {
  if (activeAdminPanel === 'menu') {
    if (adminMenuStatus) {
      adminMenuStatus.textContent = message;
    }
    return;
  }
  if (activeAdminPanel === 'categories') {
    if (adminCategoryStatus) {
      adminCategoryStatus.textContent = message;
    }
    return;
  }
  if (activeAdminPanel === 'orders') {
    if (adminOrdersStatus) {
      adminOrdersStatus.textContent = message;
    }
    return;
  }
  if (activeAdminPanel === 'counter') {
    if (adminCounterStatus) {
      adminCounterStatus.textContent = message;
    }
    return;
  }
  if (ordersControlStatus) {
    ordersControlStatus.textContent = message;
  }
}

function buildAdminSaveAllMessage(summary) {
  const details = [];
  if (summary.savedMenuCount > 0) {
    details.push(`${summary.savedMenuCount} item(ns) do cardapio`);
  }
  if (summary.addedCategoryLabel) {
    details.push(`menu "${summary.addedCategoryLabel}"`);
  }
  if (summary.addedMenuItemTitle) {
    details.push(`novo item "${summary.addedMenuItemTitle}"`);
  }
  if (summary.savedSchedule) {
    details.push('configuracoes de pedidos online');
  }
  if (summary.createdCounterOrderLabel) {
    details.push(`pedido de balcao ${summary.createdCounterOrderLabel}`);
  }
  if (details.length === 0) {
    return 'Nada pendente para salvar. O painel ja esta atualizado.';
  }
  return `Alteracoes salvas: ${details.join(', ')}.`;
}

function hasAdminScheduleChanges(draft) {
  return (
    draft.ordersPaused !== ordersPaused ||
    draft.ordersOpenTime !== ordersOpenTime ||
    draft.ordersCloseTime !== ordersCloseTime
  );
}

async function saveAdminScheduleSection() {
  const scheduleDraft = readAdminScheduleDraft();
  const savedSchedule = hasAdminScheduleChanges(scheduleDraft);
  if (!savedSchedule) {
    return {
      savedMenuCount: 0,
      addedCategoryLabel: '',
      addedMenuItemTitle: '',
      savedSchedule: false,
      createdCounterOrderLabel: ''
    };
  }
  applyAdminScheduleDraft(scheduleDraft);
  await persistAdminStateWithRollback();
  return {
    savedMenuCount: 0,
    addedCategoryLabel: '',
    addedMenuItemTitle: '',
    savedSchedule: true,
    createdCounterOrderLabel: ''
  };
}

async function saveAdminCategoriesSection() {
  const pendingCategory = readPendingAdminCategoryDraft();
  if (!pendingCategory) {
    return {
      savedMenuCount: 0,
      addedCategoryLabel: '',
      addedMenuItemTitle: '',
      savedSchedule: false,
      createdCounterOrderLabel: ''
    };
  }
  applyPendingAdminCategoryDraft(pendingCategory);
  await persistAdminStateWithRollback();
  adminAddCategoryForm?.reset();
  renderCategoryOptions(adminNewCategoryInput, adminNewCategoryInput?.value);
  return {
    savedMenuCount: 0,
    addedCategoryLabel: pendingCategory.label,
    addedMenuItemTitle: '',
    savedSchedule: false,
    createdCounterOrderLabel: ''
  };
}

async function saveAdminMenuSection() {
  const pendingMenuUpdates = collectAdminMenuEditorDrafts(
    Array.from(adminMenuEditor?.querySelectorAll('.admin-item-editor') || [])
  );
  const pendingNewMenuItem = readPendingAdminNewMenuItemDraft();
  if (pendingMenuUpdates.length === 0 && !pendingNewMenuItem) {
    return {
      savedMenuCount: 0,
      addedCategoryLabel: '',
      addedMenuItemTitle: '',
      savedSchedule: false,
      createdCounterOrderLabel: ''
    };
  }
  pendingMenuUpdates.forEach(({ currentItem, draft }) => {
    applyAdminMenuItemDraft(currentItem, draft);
  });
  applyPendingAdminNewMenuItemDraft(pendingNewMenuItem);
  await persistAdminStateWithRollback();
  if (pendingNewMenuItem) {
    adminAddMenuForm?.reset();
  }
  renderCategoryOptions(adminNewCategoryInput, pendingNewMenuItem?.category || adminNewCategoryInput?.value);
  return {
    savedMenuCount: pendingMenuUpdates.length,
    addedCategoryLabel: '',
    addedMenuItemTitle: pendingNewMenuItem?.title || '',
    savedSchedule: false,
    createdCounterOrderLabel: ''
  };
}

async function saveAdminCounterSection() {
  const orderEntry = await submitAdminCounterOrder();
  return {
    savedMenuCount: 0,
    addedCategoryLabel: '',
    addedMenuItemTitle: '',
    savedSchedule: false,
    createdCounterOrderLabel: `${getOrderDisplayCode(orderEntry)} "${orderEntry.customerName}"`
  };
}

async function saveActiveAdminPanel() {
  if (activeAdminPanel === 'schedule') {
    return saveAdminScheduleSection();
  }
  if (activeAdminPanel === 'counter') {
    return saveAdminCounterSection();
  }
  if (activeAdminPanel === 'categories') {
    return saveAdminCategoriesSection();
  }
  if (activeAdminPanel === 'menu') {
    return saveAdminMenuSection();
  }
  return {
    savedMenuCount: 0,
    addedCategoryLabel: '',
    addedMenuItemTitle: '',
    savedSchedule: false,
    createdCounterOrderLabel: ''
  };
}

function openAdminCategoryRemoveModal(category) {
  if (!adminCategoryRemoveModal || !category) {
    return;
  }
  lastAdminRemovalTrigger =
    document.activeElement && typeof document.activeElement.focus === 'function' ? document.activeElement : null;
  pendingRemovalContext = { type: 'category', id: category.id };
  if (adminCategoryRemoveMessage) {
    adminCategoryRemoveMessage.textContent =
      `Voce esta removendo o menu "${category.label}". Todos os itens dessa categoria tambem serao removidos.`;
  }
  adminCategoryRemoveForm?.reset();
  if (adminCategoryRemoveError) {
    adminCategoryRemoveError.hidden = true;
  }
  adminCategoryRemoveModal.classList.add('is-open');
  adminCategoryRemoveModal.setAttribute('aria-hidden', 'false');
  adminCategoryRemovePasswordInput?.focus();
}

function openAdminMenuItemRemoveModal(item) {
  if (!adminCategoryRemoveModal || !item) {
    return;
  }
  lastAdminRemovalTrigger =
    document.activeElement && typeof document.activeElement.focus === 'function' ? document.activeElement : null;
  pendingRemovalContext = { type: 'menu-item', id: item.id };
  if (adminCategoryRemoveMessage) {
    adminCategoryRemoveMessage.textContent = `Voce esta removendo o item "${item.title}" do cardapio.`;
  }
  adminCategoryRemoveForm?.reset();
  if (adminCategoryRemoveError) {
    adminCategoryRemoveError.hidden = true;
  }
  adminCategoryRemoveModal.classList.add('is-open');
  adminCategoryRemoveModal.setAttribute('aria-hidden', 'false');
  adminCategoryRemovePasswordInput?.focus();
}

function closeAdminCategoryRemoveModal() {
  if (!adminCategoryRemoveModal) {
    return;
  }
  const wasOpen = adminCategoryRemoveModal.classList.contains('is-open');
  const focusTarget = lastAdminRemovalTrigger;
  lastAdminRemovalTrigger = null;
  adminCategoryRemoveModal.classList.remove('is-open');
  adminCategoryRemoveModal.setAttribute('aria-hidden', 'true');
  pendingRemovalContext = null;
  adminCategoryRemoveForm?.reset();
  if (adminCategoryRemoveError) {
    adminCategoryRemoveError.hidden = true;
  }
  if (wasOpen && focusTarget && document.contains(focusTarget)) {
    focusTarget.focus();
  }
}

function openAdminOrdersAccessModal() {
  if (!adminOrdersAccessModal) {
    return;
  }
  lastAdminOrdersAccessTrigger =
    document.activeElement && typeof document.activeElement.focus === 'function' ? document.activeElement : null;
  adminOrdersAccessForm?.reset();
  resetAdminOrdersAccessError();
  adminOrdersAccessModal.classList.add('is-open');
  adminOrdersAccessModal.setAttribute('aria-hidden', 'false');
  adminOrdersAccessUsernameInput?.focus();
}

function closeAdminOrdersAccessModal() {
  if (!adminOrdersAccessModal) {
    return;
  }
  const wasOpen = adminOrdersAccessModal.classList.contains('is-open');
  const focusTarget = lastAdminOrdersAccessTrigger;
  lastAdminOrdersAccessTrigger = null;
  adminOrdersAccessModal.classList.remove('is-open');
  adminOrdersAccessModal.setAttribute('aria-hidden', 'true');
  adminOrdersAccessForm?.reset();
  resetAdminOrdersAccessError();
  if (wasOpen && focusTarget && document.contains(focusTarget)) {
    focusTarget.focus();
  }
}

async function removeCategoryAndItems(categoryId) {
  const category = menuCategories.find((item) => item.id === categoryId);
  if (!category) {
    return { success: false, message: 'Menu/categoria nao encontrado.' };
  }
  if (menuCategories.length <= 1) {
    return { success: false, message: 'Nao e possivel remover o ultimo menu/categoria.' };
  }
  let removedItemsCount = 0;
  for (let index = menuCatalog.length - 1; index >= 0; index -= 1) {
    if (menuCatalog[index].category !== category.id) {
      continue;
    }
    menuById.delete(menuCatalog[index].id);
    menuCatalog.splice(index, 1);
    removedItemsCount += 1;
  }
  menuCategories = menuCategories.filter((item) => item.id !== category.id);
  await saveApplicationState();
  refreshAdminPanel();
  return { success: true, categoryLabel: category.label, removedItemsCount };
}

async function removeMenuItemById(itemId) {
  const currentItem = menuById.get(itemId);
  if (!currentItem) {
    return { success: false, message: 'Item nao encontrado.' };
  }
  const itemIndex = menuCatalog.findIndex((item) => item.id === currentItem.id);
  if (itemIndex === -1) {
    return { success: false, message: 'Item nao encontrado.' };
  }
  menuCatalog.splice(itemIndex, 1);
  menuById.delete(currentItem.id);
  await saveApplicationState();
  refreshAdminPanel();
  return { success: true, itemTitle: currentItem.title };
}

function showAdminLoginView() {
  adminAuthenticated = false;
  adminOrdersAccessAuthenticated = false;
  hideAdminNewOrderPopup(true);
  resetAdminLoginError();
  closeAdminOrdersAccessModal();
  closeAdminCategoryRemoveModal();
  clearAdminCounterDraft();
  void releaseAdminOrdersWakeLock();
  if (!adminLoginView || !adminControlView) {
    return;
  }
  adminLoginView.hidden = false;
  adminControlView.hidden = true;
  adminLoginView.style.display = 'block';
  adminControlView.style.display = 'none';
  if (adminUsernameInput) {
    adminUsernameInput.value = '';
  }
  if (adminPasswordInput) {
    adminPasswordInput.value = '';
  }
  if (pauseOnlineOrdersButton) {
    pauseOnlineOrdersButton.disabled = true;
  }
  if (resumeOnlineOrdersButton) {
    resumeOnlineOrdersButton.disabled = true;
  }
  if (ordersOpenTimeInput) {
    ordersOpenTimeInput.disabled = true;
  }
  if (ordersCloseTimeInput) {
    ordersCloseTimeInput.disabled = true;
  }
  if (saveOrdersScheduleButton) {
    saveOrdersScheduleButton.disabled = true;
  }
  setAdminPanel('schedule');
  setAdminSaveAllVisibility();
  adminUsernameInput?.focus();
}

function showAdminControlView() {
  adminAuthenticated = true;
  if (!adminLoginView || !adminControlView) {
    return;
  }
  adminLoginView.hidden = true;
  adminControlView.hidden = false;
  adminLoginView.style.display = 'none';
  adminControlView.style.display = 'grid';
  if (adminLoginError) {
    adminLoginError.hidden = true;
  }
  if (pauseOnlineOrdersButton) {
    pauseOnlineOrdersButton.disabled = false;
  }
  if (resumeOnlineOrdersButton) {
    resumeOnlineOrdersButton.disabled = false;
  }
  if (ordersOpenTimeInput) {
    ordersOpenTimeInput.disabled = false;
  }
  if (ordersCloseTimeInput) {
    ordersCloseTimeInput.disabled = false;
  }
  if (saveOrdersScheduleButton) {
    saveOrdersScheduleButton.disabled = false;
  }
  syncAdminScheduleInputs();
  updateAdminControlStatus();
  setAdminPanel(activeAdminPanel);
  setAdminSaveAllVisibility();
  startAdminStateRefresh();
}

if (closeAdminCategoryRemoveModalButton) {
  closeAdminCategoryRemoveModalButton.addEventListener('click', () => {
    const removalType = pendingRemovalContext?.type || 'category';
    closeAdminCategoryRemoveModal();
    setRemovalStatus(removalType, 'Remocao cancelada.');
  });
}

if (cancelAdminCategoryRemoveButton) {
  cancelAdminCategoryRemoveButton.addEventListener('click', () => {
    const removalType = pendingRemovalContext?.type || 'category';
    closeAdminCategoryRemoveModal();
    setRemovalStatus(removalType, 'Remocao cancelada.');
  });
}

if (closeAdminOrdersAccessModalButton) {
  closeAdminOrdersAccessModalButton.addEventListener('click', () => {
    closeAdminOrdersAccessModal();
  });
}

if (cancelAdminOrdersAccessButton) {
  cancelAdminOrdersAccessButton.addEventListener('click', () => {
    closeAdminOrdersAccessModal();
  });
}

if (adminOrdersAccessModal) {
  adminOrdersAccessModal.addEventListener('click', (event) => {
    if (event.target === adminOrdersAccessModal) {
      closeAdminOrdersAccessModal();
    }
  });
}

if (adminOrdersAccessForm) {
  adminOrdersAccessForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      await requestJson(ADMIN_ORDERS_ACCESS_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          username: String(adminOrdersAccessUsernameInput?.value || '').trim(),
          password: String(adminOrdersAccessPasswordInput?.value || '')
        })
      });
    } catch (error) {
      setAdminOrdersAccessError(error?.message || 'Usuario ou senha invalidos.');
      adminOrdersAccessUsernameInput?.focus();
      return;
    }
    adminOrdersAccessAuthenticated = true;
    void requestAdminOrdersNotificationPermission();
    closeAdminOrdersAccessModal();
    setAdminPanel('orders');
  });
}

if (adminOrdersAccessUsernameInput) {
  adminOrdersAccessUsernameInput.addEventListener('input', () => {
    resetAdminOrdersAccessError();
  });
}

if (adminOrdersAccessPasswordInput) {
  adminOrdersAccessPasswordInput.addEventListener('input', () => {
    resetAdminOrdersAccessError();
  });
}

if (adminCategoryRemoveModal) {
  adminCategoryRemoveModal.addEventListener('click', (event) => {
    if (event.target === adminCategoryRemoveModal) {
      const removalType = pendingRemovalContext?.type || 'category';
      closeAdminCategoryRemoveModal();
      setRemovalStatus(removalType, 'Remocao cancelada.');
    }
  });
}

if (adminCategoryRemoveForm) {
  adminCategoryRemoveForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!adminAuthenticated || !pendingRemovalContext?.id) {
      closeAdminCategoryRemoveModal();
      return;
    }
    try {
      await verifyAdminPassword(String(adminCategoryRemovePasswordInput?.value || '').trim());
    } catch (_) {
      if (adminCategoryRemoveError) {
        adminCategoryRemoveError.hidden = false;
      }
      adminCategoryRemovePasswordInput?.focus();
      return;
    }
    const removalContext = pendingRemovalContext;
    let result;
    try {
      result =
        removalContext.type === 'menu-item'
          ? await removeMenuItemById(removalContext.id)
          : await removeCategoryAndItems(removalContext.id);
    } catch (error) {
      await restoreAdminStateFromServer().catch(() => {});
      closeAdminCategoryRemoveModal();
      setRemovalStatus(removalContext.type, describeRequestFailure(error, 'Nao foi possivel salvar essa remocao.'));
      return;
    }
    closeAdminCategoryRemoveModal();
    if (!result.success) {
      setRemovalStatus(removalContext.type, result.message);
      return;
    }
    if (removalContext.type === 'menu-item') {
      setRemovalStatus('menu-item', `${result.itemTitle} removido do cardapio.`);
      return;
    }
    setRemovalStatus(
      'category',
      `Menu "${result.categoryLabel}" removido com sucesso. ${result.removedItemsCount} item(ns) removido(s) junto.`
    );
  });
}

if (adminCategoryRemovePasswordInput) {
  adminCategoryRemovePasswordInput.addEventListener('input', () => {
    if (adminCategoryRemoveError) {
      adminCategoryRemoveError.hidden = true;
    }
  });
}

adminTabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!adminAuthenticated) {
      return;
    }
    if (button.dataset.panel === 'orders' && !adminOrdersAccessAuthenticated) {
      openAdminOrdersAccessModal();
      return;
    }
    setAdminPanel(button.dataset.panel);
  });
});

if (adminOrdersFilterButtons) {
  adminOrdersFilterButtons.addEventListener('click', (event) => {
    const filterButton = event.target.closest('button[data-filter]');
    if (!filterButton || !adminAuthenticated || !adminOrdersAccessAuthenticated) {
      return;
    }
    activeAdminOrdersFilter = String(filterButton.dataset.filter || 'all').trim() || 'all';
    renderOrdersList();
  });
}

if (adminCounterAddItemButton) {
  adminCounterAddItemButton.addEventListener('click', () => {
    if (!adminAuthenticated) {
      return;
    }
    addItemToAdminCounterCart(adminCounterItemSelect?.value, adminCounterQuantityInput?.value);
  });
}

if (adminCounterQuantityInput && adminCounterAddItemButton) {
  adminCounterQuantityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      adminCounterAddItemButton.click();
    }
  });
}

if (adminCounterCartItems) {
  adminCounterCartItems.addEventListener('click', (event) => {
    const actionButton = event.target.closest('button[data-action]');
    if (!actionButton || !adminAuthenticated) {
      return;
    }
    const itemId = actionButton.closest('.cart-item')?.dataset.itemId;
    const currentItem = adminCounterCart.find((item) => item.id === itemId);
    if (!itemId || !currentItem) {
      return;
    }
    if (actionButton.dataset.action === 'increase-counter-item') {
      updateAdminCounterItemQuantity(itemId, currentItem.quantity + 1);
      return;
    }
    if (actionButton.dataset.action === 'decrease-counter-item') {
      updateAdminCounterItemQuantity(itemId, currentItem.quantity - 1);
      return;
    }
    if (actionButton.dataset.action === 'remove-counter-item') {
      updateAdminCounterItemQuantity(itemId, 0);
    }
  });
}

if (adminCounterOrderForm) {
  adminCounterOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!adminAuthenticated) {
      return;
    }
    try {
      const orderEntry = await submitAdminCounterOrder();
      refreshAdminPanel();
      if (adminCounterStatus) {
        adminCounterStatus.textContent =
          `Pedido de balcao ${getOrderDisplayCode(orderEntry)} "${orderEntry.customerName}" registrado com sucesso.`;
      }
    } catch (error) {
      if (error?.isValidationError) {
        if (adminCounterStatus) {
          adminCounterStatus.textContent = error.message;
        }
        error.focusTarget?.focus();
        return;
      }
      if (adminCounterStatus) {
        adminCounterStatus.textContent = describeRequestFailure(error, 'Nao foi possivel registrar o pedido de balcao.');
      }
    }
  });
}

async function handleAdminOrderListClick(event) {
  if (!adminOrdersAccessAuthenticated) {
    openAdminOrdersAccessModal();
    return;
  }
  const actionButton = event.target.closest('button[data-action="toggle-order-ready"]');
  if (!actionButton || !adminAuthenticated) {
    return;
  }
  const orderId = String(actionButton.dataset.orderId || '').trim();
  if (!orderId) {
    return;
  }
  const nextReadyState = actionButton.dataset.nextReady === '1';
  try {
    await setOrderReadyStatus(orderId, nextReadyState);
  } catch (error) {
    if (adminOrdersStatus) {
      adminOrdersStatus.textContent = describeRequestFailure(
        error,
        'Nao foi possivel atualizar o status desse pedido.'
      );
    }
    return;
  }
  renderOrdersList();
}

if (adminOrdersList) {
  adminOrdersList.addEventListener('click', handleAdminOrderListClick);
}

if (adminOrdersHistoryList) {
  adminOrdersHistoryList.addEventListener('click', handleAdminOrderListClick);
}

if (adminOrdersHistoryToggle) {
  adminOrdersHistoryToggle.addEventListener('click', () => {
    adminOrdersHistoryExpanded = !adminOrdersHistoryExpanded;
    renderOrdersList();
  });
}

if (adminCounterHistoryToggle) {
  adminCounterHistoryToggle.addEventListener('click', () => {
    adminCounterHistoryExpanded = !adminCounterHistoryExpanded;
    renderAdminCounterRecentOrders();
  });
}

if (adminOrdersHistoryClearButton) {
  adminOrdersHistoryClearButton.addEventListener('click', async () => {
    if (!adminAuthenticated || !adminOrdersAccessAuthenticated || adminOrdersHistoryClearButton.disabled) {
      if (!adminOrdersAccessAuthenticated) {
        openAdminOrdersAccessModal();
      }
      return;
    }
    try {
      await clearAdminOrderHistory('ready');
    } catch (error) {
      if (adminOrdersStatus) {
        adminOrdersStatus.textContent = describeRequestFailure(error, 'Nao foi possivel limpar o historico de pedidos.');
      }
      return;
    }
    renderOrdersList();
    if (adminOrdersStatus) {
      adminOrdersStatus.textContent = 'Historico de pedidos prontos limpo com sucesso.';
    }
  });
}

if (adminCounterHistoryClearButton) {
  adminCounterHistoryClearButton.addEventListener('click', async () => {
    if (!adminAuthenticated || adminCounterHistoryClearButton.disabled) {
      return;
    }
    try {
      await clearAdminOrderHistory('counter-ready');
    } catch (error) {
      if (adminCounterStatus) {
        adminCounterStatus.textContent = describeRequestFailure(
          error,
          'Nao foi possivel limpar o historico do balcao.'
        );
      }
      return;
    }
    renderAdminCounterRecentOrders();
    if (adminCounterStatus) {
      adminCounterStatus.textContent = 'Historico de pedidos prontos do balcao limpo com sucesso.';
    }
  });
}

if (adminCategoryEditor) {
  adminCategoryEditor.addEventListener('click', async (event) => {
    const actionButton = event.target.closest('button[data-action]');
    if (!actionButton || !adminAuthenticated) {
      return;
    }
    const editor = actionButton.closest('[data-category-id]');
    const categoryId = editor?.dataset.categoryId;
    const category = menuCategories.find((item) => item.id === categoryId);
    if (!category) {
      return;
    }
    const action = actionButton.dataset.action;
    if (action === 'toggle-category-visibility') {
      category.hidden = !category.hidden;
      try {
        await saveApplicationState();
      } catch (error) {
        await restoreAdminStateFromServer().catch(() => {});
        if (adminCategoryStatus) {
          adminCategoryStatus.textContent = describeRequestFailure(
            error,
            'Nao foi possivel salvar a visibilidade desse menu.'
          );
        }
        return;
      }
      refreshAdminPanel();
      if (adminCategoryStatus) {
        adminCategoryStatus.textContent = category.hidden
          ? `Menu "${category.label}" ocultado na pagina inicial.`
          : `Menu "${category.label}" visivel novamente na pagina inicial.`;
      }
      return;
    }
    if (action !== 'remove-category') {
      return;
    }
    if (menuCategories.length <= 1) {
      if (adminCategoryStatus) {
        adminCategoryStatus.textContent = 'Nao e possivel remover o ultimo menu/categoria.';
      }
      return;
    }
    openAdminCategoryRemoveModal(category);
  });
}

if (adminMenuEditor) {
  adminMenuEditor.addEventListener('click', async (event) => {
    const actionButton = event.target.closest('button[data-action]');
    if (!actionButton || !adminAuthenticated) {
      return;
    }
    const editor = actionButton.closest('.admin-item-editor');
    const itemId = editor?.dataset.itemId;
    const currentItem = itemId ? menuById.get(itemId) : null;
    if (!editor || !currentItem) {
      return;
    }
    const action = actionButton.dataset.action;
    if (action === 'remove-menu-item') {
      openAdminMenuItemRemoveModal(currentItem);
      return;
    }
    if (action === 'toggle-menu-visibility') {
      currentItem.hidden = !currentItem.hidden;
      try {
        await saveApplicationState();
      } catch (error) {
        await restoreAdminStateFromServer().catch(() => {});
        if (adminMenuStatus) {
          adminMenuStatus.textContent = describeRequestFailure(
            error,
            'Nao foi possivel salvar a visibilidade desse item.'
          );
        }
        return;
      }
      refreshAdminPanel();
      if (adminMenuStatus) {
        adminMenuStatus.textContent = currentItem.hidden
          ? `${currentItem.title} foi ocultado do cardapio do cliente.`
          : `${currentItem.title} voltou a aparecer no cardapio do cliente.`;
      }
      return;
    }
    if (action === 'toggle-out-of-stock') {
      currentItem.outOfStock = !currentItem.outOfStock;
      try {
        await saveApplicationState();
      } catch (error) {
        await restoreAdminStateFromServer().catch(() => {});
        if (adminMenuStatus) {
          adminMenuStatus.textContent = describeRequestFailure(
            error,
            'Nao foi possivel salvar o status de estoque desse item.'
          );
        }
        return;
      }
      refreshAdminPanel();
      if (adminMenuStatus) {
        adminMenuStatus.textContent = currentItem.outOfStock
          ? `${currentItem.title} marcado como em falta no cardapio do cliente.`
          : `${currentItem.title} marcado como disponivel no cardapio do cliente.`;
      }
      return;
    }
    if (action !== 'save-menu-item') {
      return;
    }
    let savedTitles = [];
    try {
      savedTitles = await saveAdminMenuEditors([editor]);
    } catch (error) {
      if (error?.isValidationError) {
        if (adminMenuStatus) {
          adminMenuStatus.textContent = error.message;
        }
        error.focusTarget?.focus();
        return;
      }
      if (adminMenuStatus) {
        adminMenuStatus.textContent = describeRequestFailure(error, 'Nao foi possivel salvar esse item.');
      }
      return;
    }
    refreshAdminPanel();
    if (adminMenuStatus) {
      adminMenuStatus.textContent = `${savedTitles[0] || currentItem.title} atualizado com sucesso.`;
    }
  });
}

if (adminSaveAllButton) {
  adminSaveAllButton.addEventListener('click', async () => {
    if (!adminAuthenticated) {
      return;
    }
    if (activeAdminPanel === 'orders') {
      setActiveAdminPanelStatus('Os pedidos sao salvos automaticamente quando voce altera o status.');
      return;
    }
    adminSaveAllButton.disabled = true;
    try {
      const summary = await saveActiveAdminPanel();
      refreshAdminPanel();
      setActiveAdminPanelStatus(buildAdminSaveAllMessage(summary));
    } catch (error) {
      if (error?.isValidationError) {
        setActiveAdminPanelStatus(error.message);
        if (error.panelName === activeAdminPanel) {
          error.focusTarget?.focus();
        }
        return;
      }
      setActiveAdminPanelStatus(describeRequestFailure(error, 'Nao foi possivel salvar as alteracoes do painel.'));
    } finally {
      adminSaveAllButton.disabled = false;
      setAdminSaveAllVisibility();
    }
  });
}

if (adminAddCategoryForm) {
  adminAddCategoryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!adminAuthenticated) {
      return;
    }
    const categoryLabel = formatCategoryLabel(adminNewCategoryNameInput?.value, '');
    const categoryId = normalizeCategoryId(categoryLabel);
    if (!categoryLabel || !categoryId) {
      if (adminCategoryStatus) {
        adminCategoryStatus.textContent = 'Informe um nome valido para o novo menu.';
      }
      return;
    }
    if (menuCategories.some((category) => category.id === categoryId)) {
      renderCategoryOptions(adminNewCategoryInput, categoryId);
      if (adminCategoryStatus) {
        adminCategoryStatus.textContent = `O menu "${getCategoryLabel(categoryId)}" ja existe.`;
      }
      return;
    }
    menuCategories.push({ id: categoryId, label: categoryLabel, hidden: false });
    try {
      await saveApplicationState();
    } catch (error) {
      await restoreAdminStateFromServer().catch(() => {});
      if (adminCategoryStatus) {
        adminCategoryStatus.textContent = describeRequestFailure(error, 'Nao foi possivel criar esse menu.');
      }
      return;
    }
    renderCategoryOptions(adminNewCategoryInput, categoryId);
    if (activeAdminPanel === 'categories') {
      renderAdminCategoryEditor();
    }
    if (activeAdminPanel === 'menu') {
      renderAdminMenuEditor();
    }
    adminAddCategoryForm.reset();
    if (adminCategoryStatus) {
      adminCategoryStatus.textContent = `Menu "${categoryLabel}" criado com sucesso.`;
    }
  });
}

if (adminAddMenuForm) {
  adminAddMenuForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!adminAuthenticated) {
      return;
    }
    const category = normalizeMenuCategory(adminNewCategoryInput?.value, getDefaultCategoryId());
    const title = sanitizeMenuText(adminNewTitleInput?.value, '');
    const ingredients = sanitizeMenuText(adminNewIngredientsInput?.value, '');
    const rawPrice = String(adminNewPriceInput?.value || '').trim();
    if (!title || !ingredients || !/\d/.test(rawPrice)) {
      if (adminMenuStatus) {
        adminMenuStatus.textContent = 'Preencha todos os campos para adicionar um item.';
      }
      return;
    }
    const unitPrice = parseBRL(rawPrice);
    const newItem = {
      id: createNextMenuItemId(),
      title,
      priceText: formatBRL(unitPrice),
      unitPrice,
      ingredients,
      category,
      hidden: false,
      outOfStock: false
    };
    menuCatalog.push(newItem);
    menuById.set(newItem.id, newItem);
    try {
      await saveApplicationState();
    } catch (error) {
      await restoreAdminStateFromServer().catch(() => {});
      if (adminMenuStatus) {
        adminMenuStatus.textContent = describeRequestFailure(error, 'Nao foi possivel adicionar esse item.');
      }
      return;
    }
    refreshAdminPanel();
    adminAddMenuForm.reset();
    renderCategoryOptions(adminNewCategoryInput, category);
    if (adminMenuStatus) {
      adminMenuStatus.textContent = `${newItem.title} adicionado ao cardapio.`;
    }
  });
}

if (adminLoginForm && adminUsernameInput && adminPasswordInput) {
  adminLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      resetAdminLoginError();
      await requestJson(ADMIN_LOGIN_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          username: adminUsernameInput.value.trim(),
          password: adminPasswordInput.value
        })
      });
      await syncAdminStateFromServer();
      loadStateFromLocalStorage();
      showAdminControlView();
    } catch (error) {
      setAdminLoginError(error?.message || 'Nao foi possivel fazer login.');
    }
  });
}

if (pauseOnlineOrdersButton) {
  pauseOnlineOrdersButton.addEventListener('click', async () => {
    if (!adminAuthenticated) {
      return;
    }
    ordersPaused = true;
    persistOrdersPausedToLocalStorage();
    try {
      await saveApplicationState();
      updateAdminControlStatus();
    } catch (error) {
      await restoreAdminStateFromServer().catch(() => {});
      if (ordersControlStatus) {
        ordersControlStatus.textContent = describeRequestFailure(error, 'Nao foi possivel salvar a pausa manual.');
      }
    }
  });
}

if (resumeOnlineOrdersButton) {
  resumeOnlineOrdersButton.addEventListener('click', async () => {
    if (!adminAuthenticated) {
      return;
    }
    ordersPaused = false;
    persistOrdersPausedToLocalStorage();
    try {
      await saveApplicationState();
      updateAdminControlStatus();
    } catch (error) {
      await restoreAdminStateFromServer().catch(() => {});
      if (ordersControlStatus) {
        ordersControlStatus.textContent = describeRequestFailure(
          error,
          'Nao foi possivel salvar a liberacao dos pedidos.'
        );
      }
    }
  });
}

if (saveOrdersScheduleButton && ordersOpenTimeInput && ordersCloseTimeInput) {
  saveOrdersScheduleButton.addEventListener('click', async () => {
    if (!adminAuthenticated) {
      return;
    }
    ordersOpenTime = normalizeTimeValue(ordersOpenTimeInput.value, DEFAULT_ORDERS_OPEN_TIME);
    ordersCloseTime = normalizeTimeValue(ordersCloseTimeInput.value, DEFAULT_ORDERS_CLOSE_TIME);
    ordersOpenTimeInput.value = ordersOpenTime;
    ordersCloseTimeInput.value = ordersCloseTime;
    persistOrdersScheduleToLocalStorage();
    try {
      await saveApplicationState();
      updateAdminControlStatus();
    } catch (error) {
      await restoreAdminStateFromServer().catch(() => {});
      if (ordersScheduleStatus) {
        ordersScheduleStatus.textContent = describeRequestFailure(
          error,
          'Nao foi possivel salvar o horario programado.'
        );
      }
    }
  });
}

if (adminLogoutButton) {
  adminLogoutButton.addEventListener('click', async () => {
    try {
      await requestJson(ADMIN_LOGOUT_ENDPOINT, { method: 'POST' });
    } catch (_) {}
    showAdminLoginView();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }
  if (adminOrdersAccessModal?.classList.contains('is-open')) {
    closeAdminOrdersAccessModal();
    return;
  }
  if (adminCategoryRemoveModal?.classList.contains('is-open')) {
    const removalType = pendingRemovalContext?.type || 'category';
    closeAdminCategoryRemoveModal();
    setRemovalStatus(removalType, 'Remocao cancelada.');
  }
});

window.addEventListener('storage', (event) => {
  if (
    event.key &&
    ![
      MENU_CATEGORIES_STORAGE_KEY,
      MENU_CATALOG_STORAGE_KEY,
      ORDERS_PAUSED_STORAGE_KEY,
      ORDERS_OPEN_TIME_STORAGE_KEY,
      ORDERS_CLOSE_TIME_STORAGE_KEY,
      ORDER_HISTORY_STORAGE_KEY
    ].includes(event.key)
  ) {
    return;
  }
  loadStateFromLocalStorage();
  trackAdminIncomingOrders(loadOrderHistory());
  refreshAdminPanel();
});

document.addEventListener('visibilitychange', () => {
  syncAdminOrdersWakeLock();
  if (document.visibilityState === 'visible' && adminAuthenticated) {
    void syncAdminStateFromServer()
      .then(() => {
        loadStateFromLocalStorage();
        refreshAdminPanel();
      })
      .catch(() => {});
  }
});

async function initializeAdminApplication() {
  resetMenuCatalogToSeed();
  loadStateFromLocalStorage();
  trackAdminIncomingOrders(loadOrderHistory());
  try {
    await syncAdminStateFromServer();
    loadStateFromLocalStorage();
    refreshAdminPanel();
    showAdminControlView();
    return;
  } catch (_) {
    refreshAdminPanel();
    showAdminLoginView();
  }
}

void initializeAdminApplication();
