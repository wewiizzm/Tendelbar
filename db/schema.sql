CREATE TABLE IF NOT EXISTS tendel_app_state (
  state_key TEXT PRIMARY KEY,
  state JSONB NOT NULL CHECK (jsonb_typeof(state) = 'object'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
