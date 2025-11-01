import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  workplace: string;
  prepayment: number;
}

interface OrderForm {
  date: string;
  contactPerson: string;
  phone: string;
  patientCount: string;
  comment: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  orderForm: OrderForm;
  setOrderForm: (form: OrderForm) => void;
  clinicName: string;
  onSubmit: () => void;
}

const OrderModal = ({
  isOpen,
  onClose,
  doctor,
  orderForm,
  setOrderForm,
  clinicName,
  onSubmit,
}: OrderModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Заказ выезда врача-специалиста</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {doctor && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-lg mb-2 text-blue-900">{doctor.name}</h4>
                <p className="text-sm text-gray-700 mb-1">
                  {doctor.specialty} • {doctor.workplace}
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  Предоплата: {doctor.prepayment.toLocaleString()} ₽
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Выбор даты *</Label>
              <Input
                id="date"
                type="date"
                value={orderForm.date}
                onChange={(e) => setOrderForm({ ...orderForm, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Icon name="Building2" size={20} />
              <AlertDescription>
                <strong>Ваша клиника:</strong> {clinicName || 'Не указана'}
              </AlertDescription>
            </Alert>

            <div>
              <Label htmlFor="contactPerson">Контактное лицо *</Label>
              <Input
                id="contactPerson"
                type="text"
                placeholder="ФИО ответственного"
                value={orderForm.contactPerson}
                onChange={(e) => setOrderForm({ ...orderForm, contactPerson: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон для связи *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={orderForm.phone}
                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="patientCount">Ожидаемое количество пациентов</Label>
              <Input
                id="patientCount"
                type="number"
                placeholder="Укажите примерное количество"
                value={orderForm.patientCount}
                onChange={(e) => setOrderForm({ ...orderForm, patientCount: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="comment">Дополнительные пожелания</Label>
              <Textarea
                id="comment"
                placeholder="Укажите особые требования или дополнительную информацию"
                rows={4}
                value={orderForm.comment}
                onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" size="lg" onClick={onSubmit}>
              <Icon name="Send" className="mr-2" size={20} />
              Отправить заявку
            </Button>
            <Button variant="outline" size="lg" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
