const { clearAllSessions, setAdminSession } = require("../_lib/auth");
const { getAuthConfig } = require("../_lib/env");
const { createHttpError, handleApiError, readJsonBody, sendJson, sendMethodNotAllowed } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }
  try {
    const payload = await readJsonBody(req);
    const { adminUsername, adminPassword } = getAuthConfig();
    const username = String(payload?.username || "").trim();
    const password = String(payload?.password || "");
    if (username !== adminUsername || password !== adminPassword) {
      throw createHttpError(401, "Usuario ou senha invalidos.");
    }
    clearAllSessions(res);
    setAdminSession(res, username);
    sendJson(res, 200, { success: true });
  } catch (error) {
    handleApiError(res, error);
  }
};
