-- Обновление хеша пароля для администратора
-- Пароль: Admin123!
UPDATE admins 
SET password_hash = '$2b$12$vZ9mXGQ8YhR7kN3pL5wZuOYK5Z6M8qX9bN2fH3jL7wQ1mT4sR6vWi'
WHERE email = 'admin@doctor-in-city.ru';