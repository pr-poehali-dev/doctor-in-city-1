-- Создание таблицы заявок на выезд врачей
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    clinic_id INTEGER NOT NULL REFERENCES clinics(id),
    doctor_id INTEGER REFERENCES doctors(id),
    
    -- Данные заявки
    visit_date DATE NOT NULL,
    visit_time VARCHAR(50),
    patient_count INTEGER NOT NULL DEFAULT 1,
    service_type VARCHAR(255),
    urgency_level VARCHAR(50) DEFAULT 'normal',
    
    -- Статус заявки
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    
    -- Контактная информация
    contact_person VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    contact_email VARCHAR(255),
    
    -- Адрес визита
    visit_address TEXT NOT NULL,
    visit_city VARCHAR(255),
    visit_region VARCHAR(255),
    
    -- Дополнительная информация
    special_requirements TEXT,
    medical_equipment_needed TEXT,
    patient_conditions TEXT,
    
    -- Финансовая информация
    estimated_cost DECIMAL(10, 2) DEFAULT 0,
    actual_cost DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'pending',
    prepayment_paid BOOLEAN DEFAULT FALSE,
    
    -- Комментарии и заметки
    clinic_comments TEXT,
    admin_notes TEXT,
    doctor_notes TEXT,
    
    -- Рейтинг после завершения
    clinic_rating INTEGER CHECK (clinic_rating >= 1 AND clinic_rating <= 5),
    doctor_rating INTEGER CHECK (doctor_rating >= 1 AND doctor_rating <= 5),
    clinic_review TEXT,
    
    -- Временные метки
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- Кто создал/обновил
    created_by_admin_id INTEGER REFERENCES admins(id),
    assigned_by_admin_id INTEGER REFERENCES admins(id)
);

-- Индексы для быстрого поиска
CREATE INDEX idx_orders_clinic_id ON orders(clinic_id);
CREATE INDEX idx_orders_doctor_id ON orders(doctor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_visit_date ON orders(visit_date);
CREATE INDEX idx_orders_created_at ON orders(created_at);
