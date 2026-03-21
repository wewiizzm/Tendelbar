const { clearAllSessions } = require("../_lib/auth");
const { handleApiError, sendJson, sendMethodNotAllowed } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }
  try {
    clearAllSessions(res);
    sendJson(res, 200, { success: true });
  } catch (error) {
    handleApiError(res, error);
  }
};
