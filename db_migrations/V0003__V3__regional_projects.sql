CREATE TABLE regional_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  region VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  result TEXT,
  budget_mln NUMERIC,
  start_year INTEGER,
  end_year INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  participants INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  goal_id INTEGER REFERENCES national_goals(id),
  created_at TIMESTAMP DEFAULT NOW()
);