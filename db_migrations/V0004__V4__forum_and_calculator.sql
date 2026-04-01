CREATE TABLE forum_topics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  goal_id INTEGER REFERENCES national_goals(id),
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE forum_replies (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER REFERENCES forum_topics(id),
  author_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE calculator_submissions (
  id SERIAL PRIMARY KEY,
  profession VARCHAR(150),
  region VARCHAR(150),
  tax_paid NUMERIC,
  volunteer_hours INTEGER,
  children INTEGER,
  education_level VARCHAR(100),
  total_score NUMERIC,
  goals_impact JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);