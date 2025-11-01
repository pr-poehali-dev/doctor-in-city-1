import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

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

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctorId: number, doctorName: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Активен</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-500">Неактивен</Badge>;
    case 'on_moderation':
      return <Badge className="bg-yellow-500">На модерации</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const DoctorCard = ({ doctor, onEdit, onDelete }: DoctorCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 flex-1">
            {doctor.photo_url && (
              <img
                src={doctor.photo_url}
                alt={doctor.full_name}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{doctor.full_name}</h3>
                {getStatusBadge(doctor.status)}
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Специальность:</strong> {doctor.specialty}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Место работы:</strong> {doctor.workplace}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Опыт:</strong> {doctor.experience_years} лет
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Предоплата:</strong> {doctor.prepayment_amount} ₽
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Рейтинг:</strong> {doctor.rating ? doctor.rating.toFixed(1) : '—'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Визитов:</strong> {doctor.successful_visits_count || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 ml-4">
            <Button variant="outline" onClick={() => onEdit(doctor)}>
              <Icon name="Edit" size={18} />
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:bg-red-50"
              onClick={() => onDelete(doctor.id, doctor.full_name)}
            >
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
