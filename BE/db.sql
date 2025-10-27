CREATE EXTENSION IF NOT EXISTS vector;


-- Roles
CREATE TABLE IF NOT EXISTS role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- seed roles
INSERT INTO role (role_id, role_name)
VALUES (1, 'USER'), (2, 'ADMIN')
ON CONFLICT (role_id) DO NOTHING;

-- Users
CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE,
    password_hash VARCHAR(200),
    birthday DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    role_id INT DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

-- User update history
CREATE TABLE IF NOT EXISTS user_update (
    user_update_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100),
    email VARCHAR(200),
    password_hash VARCHAR(200),
    birthday DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    role_id INT,
    updated_by INT, -- người thực hiện update
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES "user"(user_id) ON DELETE SET NULL
);

-- Subjects & topics
CREATE TABLE IF NOT EXISTS subject (
    subject_id SERIAL PRIMARY KEY,
    subject_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS topic (
    topic_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE SET NULL
);

-- Roadmap steps + user mapping
CREATE TABLE IF NOT EXISTS roadmap_step (
    roadmap_step_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL
);

-- Note: consider renaming 'in process' -> 'in_process' if using programmatic enums.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roadmap_status') THEN
    CREATE TYPE roadmap_status AS ENUM ('pending', 'done', 'skip', 'in process');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS user_roadmap_step (
    user_roadmap_step_id SERIAL PRIMARY KEY,
    status roadmap_status DEFAULT 'pending',
    roadmap_step_id INT,
    user_id INT,
    FOREIGN KEY (roadmap_step_id) REFERENCES roadmap_step(roadmap_step_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Documents
CREATE TABLE IF NOT EXISTS document (
    document_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link VARCHAR(250),
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now(),
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS roadmap_step_document (
    roadmap_step_id INT NOT NULL,
    document_id INT NOT NULL,
    PRIMARY KEY (roadmap_step_id, document_id),
    FOREIGN KEY (roadmap_step_id) REFERENCES roadmap_step(roadmap_step_id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES document(document_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_history (
    document_history_id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    user_id INT,
    document_id INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES document(document_id) ON DELETE CASCADE
);

-- Study schedule
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'study_status') THEN
    CREATE TYPE study_status AS ENUM ('pending', 'done', 'miss');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS study_schedule (
    study_schedule_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    status study_status DEFAULT 'pending',
    target_question INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    update_at TIMESTAMPTZ DEFAULT now(),
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE SET NULL
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'flashcard_status') THEN
    CREATE TYPE flashcard_status AS ENUM ('pending', 'done', 'miss');
  END IF;
END$$;

-- Flashcards
CREATE TABLE IF NOT EXISTS flashcard_deck (
    flashcard_deck_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flashcard (
    flashcard_id SERIAL PRIMARY KEY,
    front TEXT NOT NULL,
    back TEXT,
    example TEXT DEFAULT"",
    created_at TIMESTAMPTZ DEFAULT now(),
    status flashcard_status DEFAULT 'pending',
    flashcard_deck_id INT,
    FOREIGN KEY (flashcard_deck_id) REFERENCES flashcard_deck(flashcard_deck_id) ON DELETE CASCADE
);



-- Chat history
CREATE TABLE IF NOT EXISTS chat_history (
    chat_history_id SERIAL PRIMARY KEY,
    is_user BOOLEAN,
    message TEXT,
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

-- Progress & goals
CREATE TABLE IF NOT EXISTS current_progress (
    current_progress_id SERIAL PRIMARY KEY,
    current_progress DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_goal (
    user_goal_id SERIAL PRIMARY KEY,
    target_score DECIMAL(4,2),
    deadline TIMESTAMPTZ,
    user_id INT,
    subject_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE SET NULL
);

-- Exams
CREATE TABLE IF NOT EXISTS exam_schedule (
    exam_schedule_id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam (
    exam_id SERIAL PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    time_limit INT,
    topic_id INT,
    exam_schedule_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL,
    FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedule(exam_schedule_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_exam_answer (
    user_exam_answer_id SERIAL PRIMARY KEY,
    score DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id INT,
    exam_id INT,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exam(exam_id) ON DELETE CASCADE
);

-- Questions & answers
CREATE TABLE IF NOT EXISTS question (
    question_id SERIAL PRIMARY KEY,
    question_name VARCHAR(100) NOT NULL,
    question_content TEXT
);

CREATE TABLE IF NOT EXISTS answer (
    answer_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    answer_content TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_exam (
    question_id INT,
    exam_id INT,
    PRIMARY KEY (question_id, exam_id),
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exam(exam_id) ON DELETE CASCADE
);

-- Bank & mappings
CREATE TABLE IF NOT EXISTS bank (
    bank_id SERIAL PRIMARY KEY,
    description VARCHAR(200),
    topic_id INT,
    FOREIGN KEY (topic_id) REFERENCES topic(topic_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS question_bank (
    question_id INT,
    bank_id INT,
    PRIMARY KEY (question_id, bank_id),
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_bank_answer (
    user_bank_answer_id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    bank_id INT,
    user_id INT,
    answer_id INT,
    FOREIGN KEY (bank_id) REFERENCES bank(bank_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE SET NULL
);

-- Add available columns if not exists (safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='user' AND column_name='available'
  ) THEN
    ALTER TABLE "user" ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='document' AND column_name='available'
  ) THEN
    ALTER TABLE document ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='subject' AND column_name='available'
  ) THEN
    ALTER TABLE subject ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='exam' AND column_name='available'
  ) THEN
    ALTER TABLE exam ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='question' AND column_name='available'
  ) THEN
    ALTER TABLE question ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='bank' AND column_name='available'
  ) THEN
    ALTER TABLE bank ADD COLUMN available BOOLEAN DEFAULT true;
  END IF;
END$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_topic_subject ON topic(subject_id);
CREATE INDEX IF NOT EXISTS idx_document_topic ON document(topic_id);
CREATE INDEX IF NOT EXISTS idx_document_history_user ON document_history(user_id);
CREATE INDEX IF NOT EXISTS idx_document_history_document ON document_history(document_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_answer_question ON answer(question_id);
CREATE INDEX IF NOT EXISTS idx_question_exam_exam ON question_exam(exam_id);
CREATE INDEX IF NOT EXISTS idx_bank_topic ON bank(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_goal_user ON user_goal(user_id);

-- Optional: pgvector ANN index examples (run after you inserted vectors and tuned lists)
-- CREATE INDEX IF NOT EXISTS idx_document_embedding ON document USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX IF NOT EXISTS idx_chat_history_embedding ON chat_history USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- CREATE INDEX IF NOT EXISTS idx_question_embedding ON question USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
