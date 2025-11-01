'''
Business: Авторизация администраторов системы с JWT токенами
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with JWT token or error
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
from datetime import datetime, timedelta
from typing import Dict, Any
import jwt

def get_db_connection():
    """Создание подключения к БД"""
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def verify_password(password: str, hashed: str) -> bool:
    """Проверка пароля"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_jwt_token(admin_id: int, email: str, role: str, full_name: str) -> str:
    """Генерация JWT токена с данными администратора"""
    secret_key = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
    
    payload = {
        'admin_id': admin_id,
        'email': email,
        'role': role,
        'full_name': full_name,
        'user_type': 'admin',
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    
    return jwt.encode(payload, secret_key, algorithm='HS256')

def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Проверка JWT токена"""
    secret_key = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
    
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return {'valid': True, 'payload': payload}
    except jwt.ExpiredSignatureError:
        return {'valid': False, 'error': 'Токен истек'}
    except jwt.InvalidTokenError:
        return {'valid': False, 'error': 'Недействительный токен'}

def login_admin(data: Dict[str, Any]) -> Dict[str, Any]:
    """Авторизация администратора"""
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email и пароль обязательны'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, email, password_hash, full_name, role, is_active
                FROM admins 
                WHERE email = %s
            """, (email,))
            
            admin = cur.fetchone()
            
            if not admin:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'})
                }
            
            if not admin['is_active']:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Аккаунт администратора заблокирован'})
                }
            
            if not verify_password(password, admin['password_hash']):
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный email или пароль'})
                }
            
            cur.execute(
                "UPDATE admins SET last_login = %s WHERE id = %s",
                (datetime.now(), admin['id'])
            )
            conn.commit()
            
            token = generate_jwt_token(
                admin['id'],
                admin['email'],
                admin['role'],
                admin['full_name']
            )
            
            admin_data = {
                'id': admin['id'],
                'email': admin['email'],
                'full_name': admin['full_name'],
                'role': admin['role']
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Успешная авторизация',
                    'admin': admin_data,
                    'token': token,
                    'user_type': 'admin'
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

def verify_token(data: Dict[str, Any]) -> Dict[str, Any]:
    """Проверка валидности JWT токена"""
    token = data.get('token')
    
    if not token:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен не предоставлен'})
        }
    
    result = verify_jwt_token(token)
    
    if result['valid']:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'valid': True,
                'admin': result['payload']
            })
        }
    else:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'valid': False,
                'error': result['error']
            })
        }

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
        
        if action == 'login':
            return login_admin(body_data)
        elif action == 'verify':
            return verify_token(body_data)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие. Используйте action: login или verify'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
