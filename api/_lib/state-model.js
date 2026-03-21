const crypto = require("node:crypto");
const {
  DEFAULT_ORDERS_OPEN_TIME,
  DEFAULT_ORDERS_CLOSE_TIME,
  buildDefaultCategories,
  buildDefaultMenu,
  buildDefaultState
} = require("./default-state");
const { createHttpError } = require("./http");

const ORDER_STATUS_PENDING = "pending";
const ORDER_STATUS_READY = "ready";

function sanitizeText(value, fallback = "") {
  const normalized = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
  return normalized || fallback;
}

function truncateText(value, maxLength, fallback = "") {
  return sanitizeText(value, fallback).slice(0, maxLength);
}

function normalizeBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function normalizeCategoryId(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCategoryLabel(value, fallback = "Categoria") {
  return sanitizeText(value, fallback);
}

function categoryLabelFromId(categoryId) {
  const words = String(categoryId || "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);
  return words.join(" ") || "Categoria";
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

function isWithinScheduleNow(openTime, closeTime, now = new Date()) {
  const openMinutes = timeToMinutes(openTime);
  const closeMinutes = timeToMinutes(closeTime);
  if (openMinutes === null || closeMinutes === null || openMinutes === closeMinutes) {
    return true;
  }
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  if (openMinutes < closeMinutes) {
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }
  return nowMinutes >= openMinutes || nowMinutes <= closeMinutes;
}

function parseBRL(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Number(value.toFixed(2)));
  }
  const sanitized = String(value || "").trim().replace(/[^\d,.-]/g, "");
  if (!sanitized) {
    return 0;
  }
  let numeric = sanitized;
  if (numeric.includes(",") && numeric.includes(".")) {
    numeric = numeric.replace(/\./g, "").replace(",", ".");
  } else if (numeric.includes(",")) {
    numeric = numeric.replace(",", ".");
  }
  const parsed = Number.parseFloat(numeric);
  return Number.isFinite(parsed) ? Math.max(0, Number(parsed.toFixed(2))) : 0;
}

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizeCategoryPool(rawCategories) {
  const source = Array.isArray(rawCategories) && rawCategories.length > 0 ? rawCategories : buildDefaultCategories();
  const categories = [];
  const seenIds = new Set();
  source.forEach((entry) => {
    const id = normalizeCategoryId(entry?.id || entry?.label);
    if (!id || seenIds.has(id)) {
      return;
    }
    categories.push({
      id,
      label: formatCategoryLabel(entry?.label, categoryLabelFromId(id)),
      hidden: normalizeBoolean(entry?.hidden)
    });
    seenIds.add(id);
  });
  return categories.length > 0 ? categories : buildDefaultCategories();
}

function getDefaultCategoryId(categories) {
  return categories.find((category) => !category.hidden)?.id || categories[0]?.id || "lanches";
}

function normalizeMenuCategory(value, categories) {
  const normalized = normalizeCategoryId(value);
  if (normalized && categories.some((category) => category.id === normalized)) {
    return normalized;
  }
  return getDefaultCategoryId(categories);
}

function normalizeMenu(rawMenu, categories) {
  const source = Array.isArray(rawMenu) && rawMenu.length > 0 ? rawMenu : buildDefaultMenu();
  const normalizedMenu = [];
  const seenIds = new Set();
  source.forEach((entry, index) => {
    const id = sanitizeText(entry?.id, `item-${index + 1}`);
    if (!id || seenIds.has(id)) {
      return;
    }
    const unitPrice = parseBRL(entry?.unitPrice ?? entry?.priceText);
    normalizedMenu.push({
      id,
      category: normalizeMenuCategory(entry?.category, categories),
      title: truncateText(entry?.title, 80, `Item ${index + 1}`),
      ingredients: truncateText(entry?.ingredients, 500, "Ingredientes nao informados."),
      unitPrice,
      priceText: formatBRL(unitPrice),
      hidden: normalizeBoolean(entry?.hidden),
      outOfStock: normalizeBoolean(entry?.outOfStock)
    });
    seenIds.add(id);
  });
  return normalizedMenu.length > 0 ? normalizedMenu : buildDefaultMenu();
}

function normalizeOrderSource(value) {
  return String(value || "").trim().toLowerCase() === "counter" ? "counter" : "online";
}

function parseOrderNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getOrderCodePrefix(source) {
  return normalizeOrderSource(source) === "counter" ? "B" : "O";
}

function formatOrderCode(source, orderNumber) {
  return `#${getOrderCodePrefix(source)}${Math.max(1, parseOrderNumber(orderNumber) || 1)}`;
}

function normalizeDateTimeValue(value, fallback = null) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return fallback;
  }
  return date.toISOString();
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
    return String(left?.id || "").localeCompare(String(right?.id || ""));
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

function normalizeOrderItemQuantity(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePersistedOrderItems(rawItems, menu) {
  const menuById = new Map((Array.isArray(menu) ? menu : []).map((item) => [String(item.id || ""), item]));
  const items = [];
  (Array.isArray(rawItems) ? rawItems : []).forEach((item, index) => {
    const menuItem = menuById.get(String(item?.id || ""));
    const quantity = normalizeOrderItemQuantity(item?.quantity);
    const totalPrice = parseBRL(item?.totalPrice ?? item?.totalFormatted ?? item?.total);
    items.push({
      id: sanitizeText(item?.id, menuItem?.id || `item-${index + 1}`),
      title: truncateText(item?.title, 80, menuItem?.title || "Item"),
      quantity,
      ingredients: truncateText(item?.ingredients, 500, menuItem?.ingredients || "Ingredientes nao informados."),
      note: truncateText(item?.note, 300, ""),
      totalPrice,
      totalFormatted: formatBRL(totalPrice)
    });
  });
  return items;
}

function buildIncomingOrderItems(rawItems, menu) {
  const menuById = new Map((Array.isArray(menu) ? menu : []).map((item) => [String(item.id || ""), item]));
  const items = [];
  (Array.isArray(rawItems) ? rawItems : []).forEach((item, index) => {
    const quantity = normalizeOrderItemQuantity(item?.quantity);
    const menuItem = menuById.get(String(item?.id || ""));
    const fallbackUnitPrice = parseBRL(item?.totalPrice) / quantity;
    const unitPrice = menuItem ? menuItem.unitPrice : fallbackUnitPrice;
    const totalPrice = Number((unitPrice * quantity).toFixed(2));
    items.push({
      id: sanitizeText(item?.id, menuItem?.id || `item-${index + 1}`),
      title: truncateText(item?.title, 80, menuItem?.title || "Item"),
      quantity,
      ingredients: truncateText(item?.ingredients, 500, menuItem?.ingredients || "Ingredientes nao informados."),
      note: truncateText(item?.note, 300, ""),
      totalPrice,
      totalFormatted: formatBRL(totalPrice)
    });
  });
  return items.filter((item) => item.quantity > 0);
}

function normalizeOrderEntry(entry, existingOrders, menu) {
  const source = normalizeOrderSource(entry?.source);
  const orderItems = normalizePersistedOrderItems(entry?.items, menu);
  if (orderItems.length === 0) {
    return null;
  }
  const orderNumber = parseOrderNumber(entry?.orderNumber) || getNextOrderNumber(existingOrders, source);
  const total = Number(orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2));
  const status = entry?.status === ORDER_STATUS_READY ? ORDER_STATUS_READY : ORDER_STATUS_PENDING;
  return {
    id: sanitizeText(entry?.id, crypto.randomUUID()),
    customerName: truncateText(
      entry?.customerName,
      80,
      source === "counter" ? "Pedido de balcao" : "Cliente nao informado"
    ),
    pickupTime: normalizeTimeValue(entry?.pickupTime, DEFAULT_ORDERS_OPEN_TIME),
    notes: truncateText(entry?.notes, 400, ""),
    total,
    totalFormatted: formatBRL(total),
    createdAt: normalizeDateTimeValue(entry?.createdAt, new Date().toISOString()),
    status,
    readyAt: status === ORDER_STATUS_READY ? normalizeDateTimeValue(entry?.readyAt, new Date().toISOString()) : null,
    source,
    orderNumber,
    orderCode: formatOrderCode(source, orderNumber),
    items: orderItems
  };
}

function normalizeOrderEntries(entries, menu) {
  const originalEntries = Array.isArray(entries) ? entries : [];
  const normalizedByEntry = new Map();
  const normalizedHistory = [];
  sortOrdersOldestFirst(originalEntries).forEach((entry) => {
    const normalizedEntry = normalizeOrderEntry(entry, normalizedHistory, menu);
    if (!normalizedEntry) {
      return;
    }
    normalizedHistory.push(normalizedEntry);
    normalizedByEntry.set(entry, normalizedEntry);
  });
  return originalEntries
    .map((entry) => normalizedByEntry.get(entry))
    .filter(Boolean);
}

function normalizeStateSnapshot(rawState) {
  const baseState = buildDefaultState();
  const categories = normalizeCategoryPool(rawState?.categories || baseState.categories);
  const menu = normalizeMenu(rawState?.menu || baseState.menu, categories);
  return {
    categories,
    menu,
    orders: normalizeOrderEntries(rawState?.orders || baseState.orders, menu).slice(0, 200),
    ordersPaused: normalizeBoolean(rawState?.ordersPaused),
    ordersOpenTime: normalizeTimeValue(rawState?.ordersOpenTime, DEFAULT_ORDERS_OPEN_TIME),
    ordersCloseTime: normalizeTimeValue(rawState?.ordersCloseTime, DEFAULT_ORDERS_CLOSE_TIME)
  };
}

function buildAdminStatePatch(payload, currentState) {
  const categories = normalizeCategoryPool(payload?.categories || currentState.categories);
  const menu = normalizeMenu(payload?.menu || currentState.menu, categories);
  return normalizeStateSnapshot({
    ...currentState,
    categories,
    menu,
    ordersPaused: normalizeBoolean(payload?.ordersPaused),
    ordersOpenTime: normalizeTimeValue(payload?.ordersOpenTime, currentState.ordersOpenTime),
    ordersCloseTime: normalizeTimeValue(payload?.ordersCloseTime, currentState.ordersCloseTime),
    orders: currentState.orders
  });
}

function buildIncomingOrder(payload, currentState) {
  const source = normalizeOrderSource(payload?.source);
  if (source !== "counter") {
    if (currentState.ordersPaused) {
      throw createHttpError(409, "Os pedidos online estao temporariamente em espera.");
    }
    if (!isWithinScheduleNow(currentState.ordersOpenTime, currentState.ordersCloseTime)) {
      throw createHttpError(409, "Os pedidos online estao fora do horario de atendimento.");
    }
  }
  const items = buildIncomingOrderItems(payload?.items, currentState.menu);
  if (items.length === 0) {
    throw createHttpError(400, "Adicione pelo menos um item valido ao pedido.");
  }
  const customerFallback = source === "counter" ? "Pedido de balcao" : "";
  const customerName = truncateText(payload?.customerName, 80, customerFallback);
  if (!customerName) {
    throw createHttpError(400, "Informe o nome do cliente.");
  }
  const pickupTime = normalizeTimeValue(payload?.pickupTime, "");
  if (!pickupTime) {
    throw createHttpError(400, "Informe um horario de retirada valido.");
  }
  const total = Number(items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2));
  if (total <= 0) {
    throw createHttpError(400, "Nao foi possivel calcular o total do pedido.");
  }
  const orderNumber = getNextOrderNumber(currentState.orders, source);
  return {
    id: crypto.randomUUID(),
    customerName,
    pickupTime,
    notes: truncateText(payload?.notes, 400, ""),
    total,
    totalFormatted: formatBRL(total),
    createdAt: new Date().toISOString(),
    status: ORDER_STATUS_PENDING,
    readyAt: null,
    source,
    orderNumber,
    orderCode: formatOrderCode(source, orderNumber),
    items
  };
}

function updateOrderReadyStatus(state, orderId, isReady) {
  const targetOrderExists = state.orders.some((entry) => String(entry?.id || "") === String(orderId || ""));
  if (!targetOrderExists) {
    throw createHttpError(404, "Pedido nao encontrado.");
  }
  const nextOrders = state.orders.map((entry) => {
    if (String(entry?.id || "") !== String(orderId || "")) {
      return entry;
    }
    return {
      ...entry,
      status: isReady ? ORDER_STATUS_READY : ORDER_STATUS_PENDING,
      readyAt: isReady ? new Date().toISOString() : null
    };
  });
  return normalizeStateSnapshot({ ...state, orders: nextOrders });
}

function clearOrderHistory(state, scope) {
  const normalizedScope = String(scope || "").trim().toLowerCase();
  if (!["ready", "counter-ready"].includes(normalizedScope)) {
    throw createHttpError(400, "Escopo de limpeza invalido.");
  }
  const nextOrders = state.orders.filter((entry) => {
    const isReady = entry?.status === ORDER_STATUS_READY;
    const isCounter = normalizeOrderSource(entry?.source) === "counter";
    if (normalizedScope === "counter-ready") {
      return !(isReady && isCounter);
    }
    if (normalizedScope === "ready") {
      return !isReady;
    }
    return true;
  });
  return normalizeStateSnapshot({ ...state, orders: nextOrders });
}

function buildPublicStateResponse(state, publicConfig) {
  return {
    categories: state.categories,
    menu: state.menu,
    ordersPaused: state.ordersPaused,
    ordersOpenTime: state.ordersOpenTime,
    ordersCloseTime: state.ordersCloseTime,
    whatsappNumber: publicConfig.whatsappNumber
  };
}

function buildAdminStateResponse(state, options = {}) {
  return {
    ...state,
    ordersAccessGranted: Boolean(options.ordersAccessGranted)
  };
}

module.exports = {
  ORDER_STATUS_PENDING,
  ORDER_STATUS_READY,
  buildAdminStatePatch,
  buildAdminStateResponse,
  buildDefaultState,
  buildIncomingOrder,
  buildPublicStateResponse,
  clearOrderHistory,
  formatOrderCode,
  normalizeOrderEntries,
  normalizeOrderSource,
  normalizeStateSnapshot,
  updateOrderReadyStatus
};
