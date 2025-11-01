import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Order {
  id: number;
  clinic_id: number;
  doctor_id: number | null;
  visit_date: string;
  visit_time: string | null;
  patient_count: number;
  service_type: string | null;
  urgency_level: string;
  status: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string | null;
  visit_address: string;
  visit_city: string | null;
  visit_region: string | null;
  special_requirements: string | null;
  estimated_cost: number;
  actual_cost: number | null;
  payment_status: string;
  prepayment_paid: boolean;
  clinic_comments: string | null;
  admin_notes: string | null;
  clinic_rating: number | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
  clinic_name: string;
  clinic_email: string;
  clinic_phone: string;
  doctor_name: string | null;
  doctor_specialty: string | null;
}

interface OrderCardProps {
  order: Order;
  onManage: (order: Order) => void;
  getStatusBadge: (status: string) => JSX.Element;
  getUrgencyBadge: (urgency: string) => JSX.Element;
  formatDate: (dateString: string | null) => string;
  formatDateTime: (dateString: string | null) => string;
}

const OrderCard = ({
  order,
  onManage,
  getStatusBadge,
  getUrgencyBadge,
  formatDate,
  formatDateTime,
}: OrderCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                Заявка #{order.id}
              </h3>
              {getStatusBadge(order.status)}
              {getUrgencyBadge(order.urgency_level)}
              {order.prepayment_paid && (
                <Badge className="bg-green-600">Предоплата внесена</Badge>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Клиника</p>
                <p className="text-sm font-semibold text-gray-900">{order.clinic_name}</p>
                <p className="text-sm text-gray-600">{order.clinic_phone}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Врач</p>
                {order.doctor_name ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900">{order.doctor_name}</p>
                    <p className="text-sm text-gray-600">{order.doctor_specialty}</p>
                  </>
                ) : (
                  <p className="text-sm text-red-600">Не назначен</p>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Визит</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(order.visit_date)} {order.visit_time || ''}
                </p>
                <p className="text-sm text-gray-600">
                  {order.visit_city}, пациентов: {order.patient_count}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-4 text-sm">
                <p className="text-gray-600">
                  <strong>Контакт:</strong> {order.contact_person}, {order.contact_phone}
                </p>
                <p className="text-gray-600">
                  <strong>Адрес:</strong> {order.visit_address}
                </p>
                {order.estimated_cost > 0 && (
                  <p className="text-gray-600">
                    <strong>Стоимость:</strong> {order.estimated_cost.toLocaleString()} ₽
                  </p>
                )}
              </div>
              {order.special_requirements && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Особые требования:</strong> {order.special_requirements}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-4 text-xs text-gray-500">
              <span>Создана: {formatDateTime(order.created_at)}</span>
              {order.confirmed_at && <span>• Подтверждена: {formatDateTime(order.confirmed_at)}</span>}
              {order.completed_at && <span>• Завершена: {formatDateTime(order.completed_at)}</span>}
            </div>
          </div>

          <div className="ml-4">
            <Button onClick={() => onManage(order)}>
              <Icon name="Settings" className="mr-2" size={18} />
              Управление
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
