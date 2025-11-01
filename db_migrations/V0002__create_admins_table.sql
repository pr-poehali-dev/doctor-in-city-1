-- Создание таблицы администраторов
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    
    -- Основная информация
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    
    -- Роль администратора
    role VARCHAR(20) DEFAULT 'moderator' CHECK (role IN ('super_admin', 'moderator')),
    
    -- Статус
    is_active BOOLEAN DEFAULT true NOT NULL,
    
    -- Технические поля
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Создание индексов
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
CREATE INDEX idx_admins_is_active ON admins(is_active);

-- Комментарии
COMMENT ON TABLE admins IS 'Таблица администраторов системы';
COMMENT ON COLUMN admins.role IS 'Роль: super_admin - полный доступ, moderator - ограниченный доступ';
COMMENT ON COLUMN admins.password_hash IS 'Хешированный пароль (bcrypt)';

-- Создание первого супер-администратора (пароль: Admin123!)
-- Хеш для пароля Admin123!: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW.2E3NvUiCW
INSERT INTO admins (email, password_hash, full_name, role) 
VALUES ('admin@doctor-in-city.ru', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW.2E3NvUiCW', 'Главный администратор', 'super_admin');