CREATE TABLE goal_indicators (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER REFERENCES national_goals(id),
  name VARCHAR(255) NOT NULL,
  value_2020 NUMERIC,
  value_2021 NUMERIC,
  value_2022 NUMERIC,
  value_2023 NUMERIC,
  value_2024 NUMERIC,
  target_2030 NUMERIC,
  unit VARCHAR(50),
  trend VARCHAR(20) DEFAULT 'up'
);