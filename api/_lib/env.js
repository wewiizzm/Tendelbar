const { createHttpError } = require("./http");

function readEnv(name, fallback = "") {
  return String(process.env[name] || fallback).trim();
}

function requireEnv(name) {
  const value = readEnv(name);
  if (!value) {
    throw createHttpError(500, `Variavel de ambiente ausente: ${name}.`);
  }
  return value;
}

function getDatabaseConfig() {
  const connectionString =
    readEnv("POSTGRES_URL") || readEnv("DATABASE_URL") || readEnv("POSTGRES_URL_NON_POOLING");
  if (!connectionString) {
    throw createHttpError(
      500,
      "Configure POSTGRES_URL, DATABASE_URL ou POSTGRES_URL_NON_POOLING com uma conexao PostgreSQL valida."
    );
  }
  return {
    connectionString,
    stateKey: readEnv("STATE_STORAGE_KEY", "tendel:state:v1")
  };
}

function getAuthConfig() {
  return {
    adminUsername: requireEnv("ADMIN_USERNAME"),
    adminPassword: requireEnv("ADMIN_PASSWORD"),
    ordersAccessUsername: requireEnv("ORDERS_ACCESS_USERNAME"),
    ordersAccessPassword: requireEnv("ORDERS_ACCESS_PASSWORD"),
    sessionSecret: requireEnv("SESSION_SECRET")
  };
}

function getPublicConfig() {
  return {
    whatsappNumber: requireEnv("PUBLIC_WHATSAPP_NUMBER")
  };
}

module.exports = {
  getDatabaseConfig,
  getAuthConfig,
  getPublicConfig
};
