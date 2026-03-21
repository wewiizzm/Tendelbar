const { getPublicConfig } = require("./_lib/env");
const { handleApiError, readJsonBody, sendJson, sendMethodNotAllowed } = require("./_lib/http");
const { buildIncomingOrder, buildPublicStateResponse } = require("./_lib/state-model");
const { loadState, saveState } = require("./_lib/store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }
  try {
    const payload = await readJsonBody(req);
    const currentState = await loadState();
    const order = buildIncomingOrder(payload, currentState);
    const nextState = await saveState({
      ...currentState,
      orders: [order, ...currentState.orders].slice(0, 200)
    });
    sendJson(res, 201, {
      success: true,
      order,
      publicState: buildPublicStateResponse(nextState, getPublicConfig())
    });
  } catch (error) {
    handleApiError(res, error);
  }
};
