import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Doctor {
  id: number;
  full_name: string;
  specialty: string;
  workplace: string;
  workplace_type: string | null;
  experience_years: number;
  photo_url: string | null;
  prepayment_amount: number;
  status: string;
  rating: number | null;
  successful_visits_count: number | null;
  created_at: string;
  description?: string;
  price_includes?: string;
}

interface DoctorFormDialogProps {
  isOpen: boolean;
  isCreateMode: boolean;
  isUpdating: boolean;
  formData: Partial<Doctor>;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (data: Partial<Doctor>) => void;
}

const DoctorFormDialog = ({
  isOpen,
  isCreateMode,
  isUpdating,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}: DoctorFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreateMode ? 'Добавить врача' : 'Редактировать врача'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>ФИО врача *</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => onFormChange({ ...formData, full_name: e.target.value })}
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Специальность *</Label>
              <Input
                value={formData.specialty}
                onChange={(e) => onFormChange({ ...formData, specialty: e.target.value })}
                placeholder="Кардиолог"
              />
            </div>
            <div>
              <Label>Опыт работы (лет) *</Label>
              <Input
                type="number"
                value={formData.experience_years}
                onChange={(e) => onFormChange({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label>Место работы *</Label>
            <Input
              value={formData.workplace}
              onChange={(e) => onFormChange({ ...formData, workplace: e.target.value })}
              placeholder="Городская больница №1"
            />
          </div>

          <div>
            <Label>Тип места работы</Label>
            <Select
              value={formData.workplace_type || ''}
              onValueChange={(value) => onFormChange({ ...formData, workplace_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital">Больница</SelectItem>
                <SelectItem value="clinic">Клиника</SelectItem>
                <SelectItem value="private">Частная практика</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Предоплата (₽)</Label>
            <Input
              type="number"
              value={formData.prepayment_amount}
              onChange={(e) => onFormChange({ ...formData, prepayment_amount: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <Label>URL фотографии</Label>
            <Input
              value={formData.photo_url || ''}
              onChange={(e) => onFormChange({ ...formData, photo_url: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <Label>Описание</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              placeholder="Краткое описание врача"
              rows={3}
            />
          </div>

          <div>
            <Label>Что включено в стоимость</Label>
            <Textarea
              value={formData.price_includes || ''}
              onChange={(e) => onFormChange({ ...formData, price_includes: e.target.value })}
              placeholder="Описание услуг"
              rows={2}
            />
          </div>

          <div>
            <Label>Статус</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onFormChange({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Активен</SelectItem>
                <SelectItem value="inactive">Неактивен</SelectItem>
                <SelectItem value="on_moderation">На модерации</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? 'Сохранение...' : (isCreateMode ? 'Создать' : 'Сохранить')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorFormDialog;
