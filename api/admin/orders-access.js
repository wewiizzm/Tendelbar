const { requireAdminSession, setOrdersAccessSession } = require("../_lib/auth");
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
    const { ordersAccessUsername, ordersAccessPassword } = getAuthConfig();
    const username = String(payload?.username || "").trim();
    const password = String(payload?.password || "");
    if (username !== ordersAccessUsername || password !== ordersAccessPassword) {
      throw createHttpError(401, "Usuario ou senha invalidos.");
    }
    setOrdersAccessSession(res, username);
    sendJson(res, 200, { success: true, ordersAccessGranted: true });
  } catch (error) {
    handleApiError(res, error);
  }
};
