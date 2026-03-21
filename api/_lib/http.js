function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (_) {
    throw createHttpError(400, "Corpo JSON invalido.");
  }
}

function sendJson(res, status, payload, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  Object.entries(headers).forEach(([name, value]) => {
    res.setHeader(name, value);
  });
  res.end(JSON.stringify(payload));
}

function sendMethodNotAllowed(res, allowedMethods) {
  sendJson(
    res,
    405,
    { error: "Metodo nao permitido." },
    { Allow: Array.isArray(allowedMethods) ? allowedMethods.join(", ") : String(allowedMethods || "") }
  );
}

function handleApiError(res, error) {
  const status = Number.isInteger(error?.status) ? error.status : 500;
  const message = typeof error?.message === "string" && error.message.trim()
    ? error.message.trim()
    : "Nao foi possivel concluir a requisicao.";
  sendJson(res, status, { error: message });
}

module.exports = {
  createHttpError,
  readJsonBody,
  sendJson,
  sendMethodNotAllowed,
  handleApiError
};
