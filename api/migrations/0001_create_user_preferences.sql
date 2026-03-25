CREATE TABLE IF NOT EXISTS user_preferences (
  user_id    TEXT PRIMARY KEY,
  zones      TEXT NOT NULL,
  use_24h    INTEGER DEFAULT 0,
  sort_etw   INTEGER DEFAULT 0,
  theme      TEXT DEFAULT 'system',
  updated_at TEXT NOT NULL
);
