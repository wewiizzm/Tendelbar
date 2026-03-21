const { requireAdminSession } = require("../_lib/auth");
const { getAuthConfig } = require("../_lib/env");
const { createHttpError, handleApiError, readJsonBody, sendJson, sendMethodNotAllowed } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, ["POST"]);
    return;
  }
  try {
    requireAdminSession(req);
    const payload = await readJsonBody(req);
    const { adminPassword } = getAuthConfig();
    if (String(payload?.password || "") !== adminPassword) {
      throw createHttpError(401, "Senha incorreta.");
    }
    sendJson(res, 200, { success: true });
  } catch (error) {
    handleApiError(res, error);
  }
};
