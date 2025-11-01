'''
Business: Управление клиниками администратором (список, модерация, редактирование)
Args: event - dict with httpMethod, body, queryStringParameters, headers
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with clinics data or update status
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any, List
import jwt

def get_db_connection():
    """Создание подключения к БД"""
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def verify_admin_token(token: str) -> Dict[str, Any]:
    """Проверка JWT токена администратора"""
    secret_key = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
    
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        if payload.get('user_type') != 'admin':
            return {'valid': False, 'error': 'Недостаточно прав'}
        return {'valid': True, 'payload': payload}
    except jwt.ExpiredSignatureError:
        return {'valid': False, 'error': 'Токен истек'}
    except jwt.InvalidTokenError:
        return {'valid': False, 'error': 'Недействительный токен'}

def get_clinics_list(filters: Dict[str, Any]) -> Dict[str, Any]:
    """Получение списка клиник с фильтрами"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT 
                    id, clinic_name, email, phone, region, city,
                    account_status, registration_date, last_login,
                    total_orders_count, completed_visits_count, active_orders_count,
                    total_orders_amount, average_service_rating,
                    contact_person_name, inn
                FROM clinics
                WHERE 1=1
            """
            params = []
            
            if filters.get('status'):
                query += " AND account_status = %s"
                params.append(filters['status'])
            
            if filters.get('search'):
                query += " AND (clinic_name ILIKE %s OR email ILIKE %s OR city ILIKE %s)"
                search_term = f"%{filters['search']}%"
                params.extend([search_term, search_term, search_term])
            
            query += " ORDER BY registration_date DESC"
            
            cur.execute(query, params)
            clinics = cur.fetchall()
            
            clinics_list = []
            for clinic in clinics:
                clinic_dict = dict(clinic)
                if clinic_dict['registration_date']:
                    clinic_dict['registration_date'] = clinic_dict['registration_date'].isoformat()
                if clinic_dict['last_login']:
                    clinic_dict['last_login'] = clinic_dict['last_login'].isoformat()
                clinics_list.append(clinic_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'clinics': clinics_list,
                    'total': len(clinics_list)
                })
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка получения списка: {str(e)}'})
        }
    finally:
        conn.close()

def update_clinic_status(clinic_id: int, new_status: str, admin_id: int) -> Dict[str, Any]:
    """Изменение статуса клиники"""
    if new_status not in ['active', 'blocked', 'on_moderation']:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Недопустимый статус'})
        }
    
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                UPDATE clinics 
                SET account_status = %s, updated_at = %s
                WHERE id = %s
                RETURNING id, clinic_name, account_status
            """, (new_status, datetime.now(), clinic_id))
            
            updated_clinic = cur.fetchone()
            
            if not updated_clinic:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Клиника не найдена'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Статус клиники обновлен',
                    'clinic': dict(updated_clinic)
                })
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка обновления статуса: {str(e)}'})
        }
    finally:
        conn.close()

def update_clinic_notes(clinic_id: int, notes: str) -> Dict[str, Any]:
    """Обновление заметок администратора"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                UPDATE clinics 
                SET admin_notes = %s, updated_at = %s
                WHERE id = %s
                RETURNING id, clinic_name
            """, (notes, datetime.now(), clinic_id))
            
            updated_clinic = cur.fetchone()
            
            if not updated_clinic:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Клиника не найдена'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Заметки обновлены'
                })
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка обновления заметок: {str(e)}'})
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    token_check = verify_admin_token(auth_token)
    if not token_check['valid']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': token_check['error']})
        }
    
    admin_payload = token_check['payload']
    
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        return get_clinics_list(query_params)
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'update_status':
            clinic_id = body_data.get('clinic_id')
            new_status = body_data.get('status')
            
            if not clinic_id or not new_status:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходимы clinic_id и status'})
                }
            
            return update_clinic_status(clinic_id, new_status, admin_payload['admin_id'])
        
        elif action == 'update_notes':
            clinic_id = body_data.get('clinic_id')
            notes = body_data.get('notes', '')
            
            if not clinic_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Необходим clinic_id'})
                }
            
            return update_clinic_notes(clinic_id, notes)
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неизвестное действие'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
