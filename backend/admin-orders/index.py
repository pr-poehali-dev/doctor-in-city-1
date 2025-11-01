'''
Business: Управление заявками от клиник в админ-панели (список, просмотр, назначение врача, изменение статуса)
Args: event - dict with httpMethod, body, queryStringParameters, headers
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with orders data or operation status
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

def get_orders_list(filters: Dict[str, Any]) -> Dict[str, Any]:
    """Получение списка заявок с фильтрами и JOIN с clinics и doctors"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT 
                    o.id, o.clinic_id, o.doctor_id, o.visit_date, o.visit_time,
                    o.patient_count, o.service_type, o.urgency_level, o.status,
                    o.contact_person, o.contact_phone, o.contact_email,
                    o.visit_address, o.visit_city, o.visit_region,
                    o.special_requirements, o.estimated_cost, o.actual_cost,
                    o.payment_status, o.prepayment_paid, o.clinic_comments,
                    o.admin_notes, o.clinic_rating, o.created_at, o.updated_at,
                    o.confirmed_at, o.completed_at,
                    c.clinic_name, c.email as clinic_email, c.phone as clinic_phone,
                    d.full_name as doctor_name, d.specialty as doctor_specialty
                FROM orders o
                LEFT JOIN clinics c ON o.clinic_id = c.id
                LEFT JOIN doctors d ON o.doctor_id = d.id
                WHERE 1=1
            """
            params = []
            
            if filters.get('status'):
                query += " AND o.status = %s"
                params.append(filters['status'])
            
            if filters.get('clinic_id'):
                query += " AND o.clinic_id = %s"
                params.append(int(filters['clinic_id']))
            
            if filters.get('doctor_id'):
                query += " AND o.doctor_id = %s"
                params.append(int(filters['doctor_id']))
            
            if filters.get('urgency'):
                query += " AND o.urgency_level = %s"
                params.append(filters['urgency'])
            
            if filters.get('search'):
                query += " AND (c.clinic_name ILIKE %s OR o.contact_person ILIKE %s OR o.visit_city ILIKE %s)"
                search_term = f"%{filters['search']}%"
                params.extend([search_term, search_term, search_term])
            
            query += " ORDER BY o.created_at DESC"
            
            cur.execute(query, params)
            orders = cur.fetchall()
            
            orders_list = []
            for order in orders:
                order_dict = dict(order)
                if order_dict.get('visit_date'):
                    order_dict['visit_date'] = order_dict['visit_date'].isoformat()
                if order_dict.get('created_at'):
                    order_dict['created_at'] = order_dict['created_at'].isoformat()
                if order_dict.get('updated_at'):
                    order_dict['updated_at'] = order_dict['updated_at'].isoformat()
                if order_dict.get('confirmed_at'):
                    order_dict['confirmed_at'] = order_dict['confirmed_at'].isoformat()
                if order_dict.get('completed_at'):
                    order_dict['completed_at'] = order_dict['completed_at'].isoformat()
                if order_dict.get('estimated_cost'):
                    order_dict['estimated_cost'] = float(order_dict['estimated_cost'])
                if order_dict.get('actual_cost'):
                    order_dict['actual_cost'] = float(order_dict['actual_cost'])
                orders_list.append(order_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'orders': orders_list,
                    'total': len(orders_list)
                })
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка получения списка: {str(e)}'})
        }
    finally:
        conn.close()

def get_order_details(order_id: int) -> Dict[str, Any]:
    """Получение полной информации о заявке"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT 
                    o.*,
                    c.clinic_name, c.email as clinic_email, c.phone as clinic_phone,
                    c.region as clinic_region, c.city as clinic_city,
                    d.full_name as doctor_name, d.specialty as doctor_specialty,
                    d.experience_years, d.photo_url as doctor_photo
                FROM orders o
                LEFT JOIN clinics c ON o.clinic_id = c.id
                LEFT JOIN doctors d ON o.doctor_id = d.id
                WHERE o.id = %s
            """, (order_id,))
            order = cur.fetchone()
            
            if not order:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Заявка не найдена'})
                }
            
            order_dict = dict(order)
            if order_dict.get('visit_date'):
                order_dict['visit_date'] = order_dict['visit_date'].isoformat()
            if order_dict.get('created_at'):
                order_dict['created_at'] = order_dict['created_at'].isoformat()
            if order_dict.get('updated_at'):
                order_dict['updated_at'] = order_dict['updated_at'].isoformat()
            if order_dict.get('confirmed_at'):
                order_dict['confirmed_at'] = order_dict['confirmed_at'].isoformat()
            if order_dict.get('completed_at'):
                order_dict['completed_at'] = order_dict['completed_at'].isoformat()
            if order_dict.get('cancelled_at'):
                order_dict['cancelled_at'] = order_dict['cancelled_at'].isoformat()
            if order_dict.get('estimated_cost'):
                order_dict['estimated_cost'] = float(order_dict['estimated_cost'])
            if order_dict.get('actual_cost'):
                order_dict['actual_cost'] = float(order_dict['actual_cost'])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'order': order_dict
                })
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка получения данных: {str(e)}'})
        }
    finally:
        conn.close()

def update_order(order_id: int, data: Dict[str, Any], admin_id: int) -> Dict[str, Any]:
    """Обновление данных заявки"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            update_fields = []
            params = []
            
            allowed_fields = {
                'doctor_id': 'doctor_id',
                'status': 'status',
                'visit_date': 'visit_date',
                'visit_time': 'visit_time',
                'estimated_cost': 'estimated_cost',
                'actual_cost': 'actual_cost',
                'payment_status': 'payment_status',
                'admin_notes': 'admin_notes',
                'urgency_level': 'urgency_level'
            }
            
            for key, db_field in allowed_fields.items():
                if key in data:
                    update_fields.append(f"{db_field} = %s")
                    params.append(data[key])
            
            if 'status' in data and data['status'] == 'confirmed' and 'confirmed_at' not in data:
                update_fields.append("confirmed_at = %s")
                params.append(datetime.now())
            
            if 'status' in data and data['status'] == 'completed' and 'completed_at' not in data:
                update_fields.append("completed_at = %s")
                params.append(datetime.now())
            
            if 'doctor_id' in data and 'assigned_by_admin_id' not in data:
                update_fields.append("assigned_by_admin_id = %s")
                params.append(admin_id)
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Нет полей для обновления'})
                }
            
            update_fields.append("updated_at = %s")
            params.append(datetime.now())
            params.append(order_id)
            
            query = f"UPDATE orders SET {', '.join(update_fields)} WHERE id = %s RETURNING id, status"
            
            cur.execute(query, params)
            updated_order = cur.fetchone()
            
            if not updated_order:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Заявка не найдена'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Заявка обновлена',
                    'order': dict(updated_order)
                })
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка обновления: {str(e)}'})
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    token_check = verify_admin_token(auth_token)
    if not token_check['valid']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': token_check['error']})
        }
    
    admin_payload = token_check['payload']
    admin_id = admin_payload.get('admin_id')
    
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        order_id = query_params.get('id')
        
        if order_id:
            return get_order_details(int(order_id))
        else:
            return get_orders_list(query_params)
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        order_id = body_data.get('id')
        
        if not order_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'ID заявки обязателен'})
            }
        
        return update_order(order_id, body_data, admin_id)
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
