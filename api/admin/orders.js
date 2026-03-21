const { getOrdersAccessSession, requireAdminSession, requireOrdersAccessSession } = require("../_lib/auth");
const { handleApiError, readJsonBody, sendJson, sendMethodNotAllowed } = require("../_lib/http");
const { buildAdminStateResponse, clearOrderHistory, updateOrderReadyStatus } = require("../_lib/state-model");
const { loadState, saveState } = require("../_lib/store");

module.exports = async function handler(req, res) {
  if (!["GET", "PATCH", "DELETE"].includes(req.method)) {
    sendMethodNotAllowed(res, ["GET", "PATCH", "DELETE"]);
    return;
  }
  try {
    requireAdminSession(req);
    const ordersAccessGranted = Boolean(getOrdersAccessSession(req));
    if (req.method === "GET") {
      const state = await loadState();
      sendJson(res, 200, buildAdminStateResponse(state, { ordersAccessGranted }));
      return;
    }
    requireOrdersAccessSession(req);
    const payload = await readJsonBody(req);
    const currentState = await loadState();
    const nextState = req.method === "PATCH"
      ? updateOrderReadyStatus(currentState, payload?.orderId, Boolean(payload?.isReady))
      : clearOrderHistory(currentState, payload?.scope);
    const savedState = await saveState(nextState);
    sendJson(res, 200, buildAdminStateResponse(savedState, { ordersAccessGranted: true }));
  } catch (error) {
    handleApiError(res, error);
  }
};
