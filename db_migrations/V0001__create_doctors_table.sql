-- Создание таблицы врачей-специалистов
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    
    -- Основная информация
    full_name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    workplace VARCHAR(500) NOT NULL,
    workplace_type VARCHAR(50) CHECK (workplace_type IN ('federal', 'private')),
    experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
    photo_url TEXT,
    description TEXT,
    
    -- Финансы
    prepayment_amount INTEGER NOT NULL CHECK (prepayment_amount >= 0),
    price_includes TEXT,
    
    -- Образование (JSON массивы)
    main_education JSONB DEFAULT '[]'::jsonb,
    residency JSONB DEFAULT '[]'::jsonb,
    additional_education JSONB DEFAULT '[]'::jsonb,
    
    -- Специализация и навыки
    skills JSONB DEFAULT '[]'::jsonb,
    work_directions JSONB DEFAULT '[]'::jsonb,
    
    -- Профессиональные достижения
    achievements JSONB DEFAULT '[]'::jsonb,
    academic_degrees JSONB DEFAULT '[]'::jsonb,
    publications JSONB DEFAULT '[]'::jsonb,
    professional_societies JSONB DEFAULT '[]'::jsonb,
    
    -- Услуги
    services_provided JSONB DEFAULT '[]'::jsonb,
    consultation_types JSONB DEFAULT '[]'::jsonb,
    
    -- Доступность
    available_dates JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    
    -- Дополнительная информация
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    successful_visits_count INTEGER DEFAULT 0 CHECK (successful_visits_count >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации поиска
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_workplace_type ON doctors(workplace_type);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_doctors_experience ON doctors(experience_years);
CREATE INDEX idx_doctors_rating ON doctors(rating);
CREATE INDEX idx_doctors_full_name ON doctors(full_name);

-- Комментарии к таблице
COMMENT ON TABLE doctors IS 'Таблица врачей-специалистов для выездных консультаций';
COMMENT ON COLUMN doctors.main_education IS 'Основное образование в формате: [{"institution": "...", "year": 2010, "specialty": "..."}]';
COMMENT ON COLUMN doctors.residency IS 'Ординатура в формате: [{"place": "...", "year": 2012, "specialty": "..."}]';
COMMENT ON COLUMN doctors.skills IS 'Массив специализаций и профессиональных навыков';
COMMENT ON COLUMN doctors.achievements IS 'Массив профессиональных достижений';
COMMENT ON COLUMN doctors.available_dates IS 'Массив доступных дат для выезда в формате ISO или строк';