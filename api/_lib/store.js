const { neon } = require("@neondatabase/serverless");
const { getDatabaseConfig } = require("./env");
const { buildDefaultState, normalizeStateSnapshot } = require("./state-model");

let sqlClient = null;
let schemaReadyPromise = null;

function getSqlClient() {
  if (!sqlClient) {
    const { connectionString } = getDatabaseConfig();
    sqlClient = neon(connectionString);
  }
  return sqlClient;
}

async function ensureSchema() {
  if (!schemaReadyPromise) {
    const sql = getSqlClient();
    schemaReadyPromise = sql`
      CREATE TABLE IF NOT EXISTS tendel_app_state (
        state_key TEXT PRIMARY KEY,
        state JSONB NOT NULL CHECK (jsonb_typeof(state) = 'object'),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }
  await schemaReadyPromise;
}

function parsePersistedStateValue(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }
  return typeof value === "object" ? value : null;
}

async function loadState() {
  await ensureSchema();
  const sql = getSqlClient();
  const { stateKey } = getDatabaseConfig();
  const rows = await sql`
    SELECT state
    FROM tendel_app_state
    WHERE state_key = ${stateKey}
    LIMIT 1
  `;
  const persistedState = parsePersistedStateValue(rows[0]?.state);
  try {
    if (persistedState) {
      return normalizeStateSnapshot(persistedState);
    }
  } catch (_) {
    // Se o JSON salvo estiver inconsistente, regeneramos o snapshot padrao.
  }
  const defaultState = normalizeStateSnapshot(buildDefaultState());
  await saveState(defaultState);
  return defaultState;
}

async function saveState(state) {
  await ensureSchema();
  const sql = getSqlClient();
  const { stateKey } = getDatabaseConfig();
  const normalizedState = normalizeStateSnapshot(state);
  await sql`
    INSERT INTO tendel_app_state (state_key, state)
    VALUES (${stateKey}, ${JSON.stringify(normalizedState)}::jsonb)
    ON CONFLICT (state_key)
    DO UPDATE SET
      state = EXCLUDED.state,
      updated_at = NOW()
  `;
  return normalizedState;
}

module.exports = {
  loadState,
  saveState
};
