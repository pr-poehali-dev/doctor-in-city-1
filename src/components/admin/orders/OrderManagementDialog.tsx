import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface Doctor {
  id: number;
  full_name: string;
  specialty: string;
}

interface OrderManagementDialogProps {
  isOpen: boolean;
  selectedOrder: Order | null;
  doctors: Doctor[];
  assignDoctorId: number | null;
  newStatus: string;
  adminNotes: string;
  isUpdating: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onAssignDoctorChange: (doctorId: number | null) => void;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  formatDate: (dateString: string | null) => string;
}

const OrderManagementDialog = ({
  isOpen,
  selectedOrder,
  doctors,
  assignDoctorId,
  newStatus,
  adminNotes,
  isUpdating,
  onClose,
  onUpdate,
  onAssignDoctorChange,
  onStatusChange,
  onNotesChange,
  formatDate,
}: OrderManagementDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Управление заявкой #{selectedOrder?.id}</DialogTitle>
        </DialogHeader>

        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <Label>Назначить врача</Label>
              <Select
                value={assignDoctorId?.toString() || ''}
                onValueChange={(value) => onAssignDoctorChange(value ? parseInt(value) : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите врача" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Не назначен</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.full_name} — {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Изменить статус</Label>
              <Select value={newStatus} onValueChange={onStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новая</SelectItem>
                  <SelectItem value="confirmed">Подтверждена</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="completed">Завершена</SelectItem>
                  <SelectItem value="cancelled">Отменена</SelectItem>
                  <SelectItem value="rejected">Отклонена</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Заметки администратора</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Внутренние заметки о заявке"
                rows={4}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Информация о заявке</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Клиника:</span> {selectedOrder.clinic_name}
                </div>
                <div>
                  <span className="text-gray-600">Контакт:</span> {selectedOrder.contact_person}
                </div>
                <div>
                  <span className="text-gray-600">Телефон:</span> {selectedOrder.contact_phone}
                </div>
                <div>
                  <span className="text-gray-600">Дата визита:</span> {formatDate(selectedOrder.visit_date)}
                </div>
              </div>
              {selectedOrder.clinic_comments && (
                <div className="mt-3">
                  <span className="text-gray-600 font-semibold">Комментарий клиники:</span>
                  <p className="text-sm mt-1">{selectedOrder.clinic_comments}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={onUpdate}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderManagementDialog;
