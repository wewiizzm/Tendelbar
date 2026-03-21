const { getOrdersAccessSession, requireAdminSession } = require("../_lib/auth");
const { handleApiError, readJsonBody, sendJson, sendMethodNotAllowed } = require("../_lib/http");
const { buildAdminStatePatch, buildAdminStateResponse } = require("../_lib/state-model");
const { loadState, saveState } = require("../_lib/store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "PUT") {
    sendMethodNotAllowed(res, ["GET", "PUT"]);
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
    const payload = await readJsonBody(req);
    const currentState = await loadState();
    const nextState = await saveState(buildAdminStatePatch(payload, currentState));
    sendJson(res, 200, buildAdminStateResponse(nextState, { ordersAccessGranted }));
  } catch (error) {
    handleApiError(res, error);
  }
};
