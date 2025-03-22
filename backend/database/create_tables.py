create_tables_query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        brain_coins INT NOT NULL,
        role INTEGER DEFAULT 1,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS study_qs (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        tokens_for_completion INT NOT NULL,
        question TEXT,
        question_complete BOOLEAN,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
  """

