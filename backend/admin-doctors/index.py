'''
Business: CRUD управление врачами в админ-панели (список, создание, редактирование, удаление)
Args: event - dict with httpMethod, body, queryStringParameters, headers
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with doctors data or operation status
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any, List, Optional
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

def get_doctors_list(filters: Dict[str, Any]) -> Dict[str, Any]:
    """Получение списка врачей с фильтрами"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = """
                SELECT 
                    id, full_name, specialty, workplace, workplace_type,
                    experience_years, photo_url, prepayment_amount,
                    status, rating, successful_visits_count, created_at
                FROM doctors
                WHERE 1=1
            """
            params = []
            
            if filters.get('status'):
                query += " AND status = %s"
                params.append(filters['status'])
            
            if filters.get('search'):
                query += " AND (full_name ILIKE %s OR specialty ILIKE %s OR workplace ILIKE %s)"
                search_term = f"%{filters['search']}%"
                params.extend([search_term, search_term, search_term])
            
            query += " ORDER BY created_at DESC"
            
            cur.execute(query, params)
            doctors = cur.fetchall()
            
            doctors_list = []
            for doctor in doctors:
                doctor_dict = dict(doctor)
                if doctor_dict.get('created_at'):
                    doctor_dict['created_at'] = doctor_dict['created_at'].isoformat()
                if doctor_dict.get('rating'):
                    doctor_dict['rating'] = float(doctor_dict['rating'])
                doctors_list.append(doctor_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'doctors': doctors_list,
                    'total': len(doctors_list)
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

def get_doctor_details(doctor_id: int) -> Dict[str, Any]:
    """Получение полной информации о враче"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM doctors WHERE id = %s", (doctor_id,))
            doctor = cur.fetchone()
            
            if not doctor:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Врач не найден'})
                }
            
            doctor_dict = dict(doctor)
            if doctor_dict.get('created_at'):
                doctor_dict['created_at'] = doctor_dict['created_at'].isoformat()
            if doctor_dict.get('updated_at'):
                doctor_dict['updated_at'] = doctor_dict['updated_at'].isoformat()
            if doctor_dict.get('rating'):
                doctor_dict['rating'] = float(doctor_dict['rating'])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'doctor': doctor_dict
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

def create_doctor(data: Dict[str, Any]) -> Dict[str, Any]:
    """Создание нового врача"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO doctors (
                    full_name, specialty, workplace, workplace_type,
                    experience_years, photo_url, description, prepayment_amount,
                    price_includes, main_education, residency, additional_education,
                    skills, work_directions, achievements, academic_degrees,
                    publications, professional_societies, services_provided,
                    consultation_types, status, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s
                )
                RETURNING id, full_name, specialty
            """, (
                data.get('full_name'),
                data.get('specialty'),
                data.get('workplace'),
                data.get('workplace_type'),
                data.get('experience_years', 0),
                data.get('photo_url'),
                data.get('description'),
                data.get('prepayment_amount', 0),
                data.get('price_includes'),
                json.dumps(data.get('main_education')) if data.get('main_education') else None,
                json.dumps(data.get('residency')) if data.get('residency') else None,
                json.dumps(data.get('additional_education')) if data.get('additional_education') else None,
                json.dumps(data.get('skills')) if data.get('skills') else None,
                json.dumps(data.get('work_directions')) if data.get('work_directions') else None,
                json.dumps(data.get('achievements')) if data.get('achievements') else None,
                json.dumps(data.get('academic_degrees')) if data.get('academic_degrees') else None,
                json.dumps(data.get('publications')) if data.get('publications') else None,
                json.dumps(data.get('professional_societies')) if data.get('professional_societies') else None,
                json.dumps(data.get('services_provided')) if data.get('services_provided') else None,
                json.dumps(data.get('consultation_types')) if data.get('consultation_types') else None,
                data.get('status', 'active'),
                datetime.now(),
                datetime.now()
            ))
            
            new_doctor = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Врач успешно создан',
                    'doctor': dict(new_doctor)
                })
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка создания врача: {str(e)}'})
        }
    finally:
        conn.close()

def update_doctor(doctor_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    """Обновление данных врача"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            update_fields = []
            params = []
            
            field_mapping = {
                'full_name': 'full_name',
                'specialty': 'specialty',
                'workplace': 'workplace',
                'workplace_type': 'workplace_type',
                'experience_years': 'experience_years',
                'photo_url': 'photo_url',
                'description': 'description',
                'prepayment_amount': 'prepayment_amount',
                'price_includes': 'price_includes',
                'status': 'status'
            }
            
            jsonb_fields = [
                'main_education', 'residency', 'additional_education', 'skills',
                'work_directions', 'achievements', 'academic_degrees', 'publications',
                'professional_societies', 'services_provided', 'consultation_types'
            ]
            
            for key, db_field in field_mapping.items():
                if key in data:
                    update_fields.append(f"{db_field} = %s")
                    params.append(data[key])
            
            for field in jsonb_fields:
                if field in data:
                    update_fields.append(f"{field} = %s")
                    params.append(json.dumps(data[field]) if data[field] else None)
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Нет полей для обновления'})
                }
            
            update_fields.append("updated_at = %s")
            params.append(datetime.now())
            params.append(doctor_id)
            
            query = f"UPDATE doctors SET {', '.join(update_fields)} WHERE id = %s RETURNING id, full_name, specialty"
            
            cur.execute(query, params)
            updated_doctor = cur.fetchone()
            
            if not updated_doctor:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Врач не найден'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': 'Данные врача обновлены',
                    'doctor': dict(updated_doctor)
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

def delete_doctor(doctor_id: int) -> Dict[str, Any]:
    """Удаление врача"""
    conn = get_db_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("DELETE FROM doctors WHERE id = %s RETURNING id, full_name", (doctor_id,))
            deleted_doctor = cur.fetchone()
            
            if not deleted_doctor:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Врач не найден'})
                }
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'message': f'Врач {deleted_doctor["full_name"]} удален'
                })
            }
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка удаления: {str(e)}'})
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        doctor_id = query_params.get('id')
        
        if doctor_id:
            return get_doctor_details(int(doctor_id))
        else:
            return get_doctors_list(query_params)
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        return create_doctor(body_data)
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        doctor_id = body_data.get('id')
        
        if not doctor_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'ID врача обязателен'})
            }
        
        return update_doctor(doctor_id, body_data)
    
    elif method == 'DELETE':
        query_params = event.get('queryStringParameters') or {}
        doctor_id = query_params.get('id')
        
        if not doctor_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'ID врача обязателен'})
            }
        
        return delete_doctor(int(doctor_id))
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Метод не поддерживается'})
    }
