-- -----------------------------
-- Constants: chỉnh nếu cần
-- -----------------------------
-- Nếu bạn dùng dimension khác đổi ở chỗ VECTOR_DIM
-- Ví dụ OpenAI ada-002 = 1536, một số embed models = 768, v.v.
-- -----------------------------
-- Tạo extension pgvector (nếu dùng)
CREATE EXTENSION IF NOT EXISTS pgvector;

-- Tham số dimension (chỉnh thủ công ở 2 chỗ sau khi chạy)
-- embedding columns sử dụng vector(1536) trong file này
-- -----------------------------

-- -----------------------------
-- ENUMS
-- -----------------------------
CREATE TYPE flashcard_status AS ENUM ('pending','done','miss');
CREATE TYPE roadmap_step_status AS ENUM ('pending','done','skip','in_process');
CREATE TYPE study_schedule_status AS ENUM ('pending','done','miss');

-- -----------------------------
-- CORE TABLES
-- -----------------------------
CREATE TABLE roles (
  role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "user_account" (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(200) UNIQUE,
  password_hash VARCHAR(200),
  birthday DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ,
  role_id INT REFERENCES roles(role_id)
);

CREATE TABLE user_update (
  user_update_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL REFERENCES user_account(user_id) ON DELETE CASCADE,
  user_name VARCHAR(100),
  email VARCHAR(200),
  password_hash VARCHAR(200),
  birthday DATE,
  date_update TIMESTAMPTZ DEFAULT now(),
  updated_by INT -- optional FK to user_account(user_id)
);

-- Subjects / Topics / Documents
CREATE TABLE subject (
  subject_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_name VARCHAR(100) NOT NULL
);

CREATE TABLE topic (
  topic_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT,
  description TEXT,
  subject_id INT REFERENCES subject(subject_id)
);

CREATE TABLE document (
  document_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description TEXT,
  link VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT now(),
  embedding VECTOR(1536),  -- chỉnh dimension nếu cần
  topic_id INT REFERENCES topic(topic_id)
);

-- Document history (lưu khi user đọc/finish)
CREATE TABLE document_history (
  document_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  document_id INT NOT NULL REFERENCES document(document_id) ON DELETE CASCADE,
  user_id INT REFERENCES user_account(user_id),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Roadmap + steps + mapping to documents
CREATE TABLE roadmap_step (
  roadmap_step_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  topic_id INT REFERENCES topic(topic_id)
);

CREATE TABLE roadmap_step_document (
  roadmap_step_document_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  roadmap_step_id INT NOT NULL REFERENCES roadmap_step(roadmap_step_id) ON DELETE CASCADE,
  document_id INT NOT NULL REFERENCES document(document_id) ON DELETE CASCADE
);

CREATE TABLE user_roadmap_step (
  user_roadmap_step_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  status roadmap_step_status DEFAULT 'pending',
  roadmap_step_id INT NOT NULL REFERENCES roadmap_step(roadmap_step_id),
  user_id INT NOT NULL REFERENCES user_account(user_id)
);

-- Flashcards
CREATE TABLE flashcard_deck (
  flashcard_deck_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(500),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_reviewed TIMESTAMPTZ,
  user_id INT REFERENCES user_account(user_id)
);

CREATE TABLE flashcard (
  flashcard_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  front TEXT,
  back TEXT,
  example TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  status flashcard_status DEFAULT 'pending',
  flashcard_deck_id INT REFERENCES flashcard_deck(flashcard_deck_id)
);

-- Study schedule & goals / progress
CREATE TABLE study_schedule (
  study_schedule_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(500),
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status study_schedule_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id INT REFERENCES user_account(user_id),
  subject_id INT REFERENCES subject(subject_id)
);

CREATE TABLE user_goal (
  user_goal_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  target_score NUMERIC(5,2), -- ví dụ 9.50, chỉnh precision nếu cần
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id INT REFERENCES user_account(user_id),
  subject_id INT REFERENCES subject(subject_id)
);

CREATE TABLE current_progress (
  current_progress_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  current_progress NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_goal_id INT REFERENCES user_goal(user_goal_id)
);

-- -----------------------------
-- Q&A / Exam / Bank
-- -----------------------------
CREATE TABLE bank (
  bank_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description VARCHAR(500),
  topic_id INT REFERENCES topic(topic_id)
);

CREATE TABLE question (
  question_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_name VARCHAR(200),
  question_content TEXT,
  embedding VECTOR(1536)  -- optional: embedding cho từng câu hỏi
);

CREATE TABLE answer (
  answer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_id INT NOT NULL REFERENCES question(question_id) ON DELETE CASCADE,
  answer_content TEXT,
  is_correct BOOLEAN DEFAULT FALSE
);

-- many-to-many: question <-> bank
CREATE TABLE question_bank (
  question_id INT NOT NULL REFERENCES question(question_id) ON DELETE CASCADE,
  bank_id INT NOT NULL REFERENCES bank(bank_id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, bank_id)
);

-- exams
CREATE TABLE exam_schedule (
  exam_schedule_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE exam (
  exam_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  exam_name VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT now(),
  time_limit INT, -- minutes
  topic_id INT REFERENCES topic(topic_id),
  exam_schedule_id INT REFERENCES exam_schedule(exam_schedule_id)
);

-- many-to-many: question <-> exam
CREATE TABLE question_exam (
  question_id INT NOT NULL REFERENCES question(question_id) ON DELETE CASCADE,
  exam_id INT NOT NULL REFERENCES exam(exam_id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, exam_id)
);

CREATE TABLE user_exam_answer (
  user_exam_answer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id INT REFERENCES user_account(user_id),
  exam_id INT REFERENCES exam(exam_id)
);

CREATE TABLE user_bank_answer (
  user_bank_answer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  bank_id INT REFERENCES bank(bank_id),
  user_id INT REFERENCES user_account(user_id),
  answer_id INT REFERENCES answer(answer_id)
);

-- -----------------------------
-- CHAT HISTORY (partition-ready)
-- -----------------------------
-- partitioned by range on created_at to manage large volume
CREATE TABLE chat_history (
  chat_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT REFERENCES user_account(user_id),
  role VARCHAR(20) NOT NULL, -- 'user','assistant','system'
  message TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Example: tạo partition cho tháng 2025-09 (đổi theo nhu cầu)
CREATE TABLE chat_history_2025_09 PARTITION OF chat_history
  FOR VALUES FROM ('2025-09-01 00:00:00+00') TO ('2025-10-01 00:00:00+00');

-- -----------------------------
-- INDEXES & PERFORMANCE
-- -----------------------------
-- Indexes cho FK / tìm kiếm
CREATE INDEX idx_user_email ON user_account(email);
CREATE INDEX idx_document_topic ON document(topic_id);
CREATE INDEX idx_question_embedding_present ON question(question_id) WHERE embedding IS NOT NULL;
CREATE INDEX idx_document_embedding_present ON document(document_id) WHERE embedding IS NOT NULL;

-- pgvector index (ivfflat) ví dụ cho document
-- Chạy sau khi có đủ dữ liệu và tuning parameter lists
-- CREATE INDEX ON document USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX ON question USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX ON chat_history_2025_09 USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Example query (semantic search) - thay vector literal bằng vector của bạn:
-- SELECT document_id, description
-- FROM document
-- ORDER BY embedding <-> '[0.12, -0.55, 0.33, ...]'::vector
-- LIMIT 5;
