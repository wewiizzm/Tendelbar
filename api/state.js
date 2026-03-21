const { getPublicConfig } = require("./_lib/env");
const { handleApiError, sendJson, sendMethodNotAllowed } = require("./_lib/http");
const { buildPublicStateResponse } = require("./_lib/state-model");
const { loadState } = require("./_lib/store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    sendMethodNotAllowed(res, ["GET"]);
    return;
  }
  try {
    const [state, publicConfig] = await Promise.all([loadState(), Promise.resolve(getPublicConfig())]);
    sendJson(res, 200, buildPublicStateResponse(state, publicConfig));
  } catch (error) {
    handleApiError(res, error);
  }
};
