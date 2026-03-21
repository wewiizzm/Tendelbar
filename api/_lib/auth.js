const crypto = require("node:crypto");
const { getAuthConfig } = require("./env");
const { createHttpError } = require("./http");

const ADMIN_COOKIE_NAME = "tendel_admin_session";
const ORDERS_ACCESS_COOKIE_NAME = "tendel_orders_access_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;
const ORDERS_ACCESS_SESSION_TTL_SECONDS = 60 * 60 * 12;

function parseCookies(req) {
  const raw = String(req.headers.cookie || "");
  return raw.split(";").reduce((cookies, entry) => {
    const [name, ...rest] = entry.trim().split("=");
    if (!name) {
      return cookies;
    }
    cookies[name] = decodeURIComponent(rest.join("=") || "");
    return cookies;
  }, {});
}

function signValue(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function createSignedToken(payload, secret) {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = signValue(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

function verifySignedToken(token, secret) {
  if (!token || !token.includes(".")) {
    return null;
  }
  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = signValue(encodedPayload, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(String(signature || ""));
  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload?.exp || Number(payload.exp) <= Date.now()) {
      return null;
    }
    return payload;
  } catch (_) {
    return null;
  }
}

function appendSetCookie(res, value) {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", [value]);
    return;
  }
  const nextValues = Array.isArray(current) ? current.concat(value) : [current, value];
  res.setHeader("Set-Cookie", nextValues);
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || "/"}`);
  parts.push(`SameSite=${options.sameSite || "Lax"}`);
  if (options.httpOnly !== false) {
    parts.push("HttpOnly");
  }
  if (options.secure !== false) {
    parts.push("Secure");
  }
  if (Number.isInteger(options.maxAge)) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  if (options.expires instanceof Date) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }
  return parts.join("; ");
}

function setAdminSession(res, username) {
  const { sessionSecret } = getAuthConfig();
  const token = createSignedToken(
    { role: "admin", username, exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000 },
    sessionSecret
  );
  appendSetCookie(res, serializeCookie(ADMIN_COOKIE_NAME, token, { maxAge: ADMIN_SESSION_TTL_SECONDS }));
}

function setOrdersAccessSession(res, username) {
  const { sessionSecret } = getAuthConfig();
  const token = createSignedToken(
    { role: "orders", username, exp: Date.now() + ORDERS_ACCESS_SESSION_TTL_SECONDS * 1000 },
    sessionSecret
  );
  appendSetCookie(
    res,
    serializeCookie(ORDERS_ACCESS_COOKIE_NAME, token, { maxAge: ORDERS_ACCESS_SESSION_TTL_SECONDS })
  );
}

function clearAllSessions(res) {
  appendSetCookie(res, serializeCookie(ADMIN_COOKIE_NAME, "", { maxAge: 0, expires: new Date(0) }));
  appendSetCookie(res, serializeCookie(ORDERS_ACCESS_COOKIE_NAME, "", { maxAge: 0, expires: new Date(0) }));
}

function getAdminSession(req) {
  const { sessionSecret } = getAuthConfig();
  const cookies = parseCookies(req);
  return verifySignedToken(cookies[ADMIN_COOKIE_NAME], sessionSecret);
}

function getOrdersAccessSession(req) {
  const { sessionSecret } = getAuthConfig();
  const cookies = parseCookies(req);
  return verifySignedToken(cookies[ORDERS_ACCESS_COOKIE_NAME], sessionSecret);
}

function requireAdminSession(req) {
  const session = getAdminSession(req);
  if (!session) {
    throw createHttpError(401, "Sessao administrativa invalida ou expirada.");
  }
  return session;
}

function requireOrdersAccessSession(req) {
  const session = getOrdersAccessSession(req);
  if (!session) {
    throw createHttpError(403, "Acesso da cozinha invalido ou expirado.");
  }
  return session;
}

module.exports = {
  clearAllSessions,
  getAdminSession,
  getOrdersAccessSession,
  requireAdminSession,
  requireOrdersAccessSession,
  setAdminSession,
  setOrdersAccessSession
};
