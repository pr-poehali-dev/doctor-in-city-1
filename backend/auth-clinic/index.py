'''
Business: Регистрация и авторизация клиник в системе
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with auth token or error
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import secrets

def get_db_connection():
    """Создание подключения к БД"""
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def hash_password(password: str) -> str:
    """Хеширование пароля с помощью bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Проверка пароля"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token() -> str:
    """Генерация случайного токена"""
    return secrets.token_urlsafe(32)

def register_clinic(data: Dict[str, Any]) -> Dict[str, Any]:
    """Регистрация новой клиники"""
    required_fields = ['clinic_name', 'email', 'phone', 'region', 'city', 'password', 'contact_person_name']
    
    for field in required_fields:
        if not data.get(field):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Поле {field} обязательно для заполнения'})
            }
    
    if not data.get('terms_accepted') or not data.get('data_processing_accepted'):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Необходимо принять условия договора и согласие на обработку данных'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id FROM clinics WHERE email = %s",
                (data['email'],)
            )
            
            if cur.fetchone():
                return {
                    'statusCode': 409,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Клиника с таким email уже зарегистрирована'})
                }
            
            password_hash = hash_password(data['password'])
            
            cur.execute("""
                INSERT INTO clinics (
                    clinic_name, email, phone, region, city, password_hash,
                    contact_person_name, contact_person_position, inn, legal_address,
                    terms_accepted, data_processing_accepted, consent_date, account_status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, clinic_name, email, account_status
            """, (
                data['clinic_name'],
                data['email'],
                data['phone'],
                data['region'],
                data['city'],
                password_hash,
                data['contact_person_name'],
                data.get('contact_person_position'),
                data.get('inn'),
                data.get('legal_address'),
                data['terms_accepted'],
                data['data_processing_accepted'],
                datetime.now(),
                'on_moderation'
            ))
            
            clinic = cur.fetchone()
            conn.commit()
            
            token = generate_token()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Клиника успешно зарегистрирована',
                    'clinic': dict(clinic),
                    'token': token
                })
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка регистрации: {str(e)}'})
        }
    finally:
        conn.close()

def login_clinic(data: Dict[str, Any]) -> Dict[str, Any]:
    """Авторизация клиники"""
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email и пароль обязательны для заполнения'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, clinic_name, email, password_hash, account_status, region, city
                FROM clinics 
                WHERE email = %s
            """, (email,))
            
            clinic = cur.fetchone()
            
            if not clinic:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'})
                }
            
            if not verify_password(password, clinic['password_hash']):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'})
                }
            
            if clinic['account_status'] == 'blocked':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Аккаунт заблокирован. Обратитесь в поддержку'})
                }
            
            cur.execute(
                "UPDATE clinics SET last_login = %s WHERE id = %s",
                (datetime.now(), clinic['id'])
            )
            conn.commit()
            
            token = generate_token()
            
            clinic_data = dict(clinic)
            del clinic_data['password_hash']
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Успешная авторизация',
                    'clinic': clinic_data,
                    'token': token
                })
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка авторизации: {str(e)}'})
        }
    finally:
        conn.close()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'register':
            return register_clinic(body_data)
        elif action == 'login':
            return login_clinic(body_data)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие. Используйте action: register или login'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
