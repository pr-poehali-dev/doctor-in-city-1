import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  workplace: string;
  workplaceType: "federal" | "private";
  education: string[];
  experience: string;
  experienceYears: number;
  prepayment: number;
  photo: string;
  description: string;
  skills: string[];
  achievements: string[];
  servicesProvided: string[];
  dates: string[];
}

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onOrder: (doctor: Doctor) => void;
}

const DoctorDetailsModal = ({ doctor, onClose, onOrder }: DoctorDetailsModalProps) => {
  if (!doctor) return null;

  return (
    <Dialog open={!!doctor} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Профиль врача-специалиста</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-32 h-32 rounded-full border-4 border-blue-100 flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{doctor.name}</h3>
              <Badge className="mb-3 text-base px-4 py-1">{doctor.specialty}</Badge>
              
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Icon name="Building2" size={20} className="text-blue-600" />
                  <span>{doctor.workplace}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Briefcase" size={20} className="text-blue-600" />
                  <span>Опыт работы: {doctor.experience}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-4 inline-block">
                <p className="text-sm text-gray-600 mb-1">Предоплата за выезд</p>
                <p className="text-3xl font-bold text-blue-600">
                  {doctor.prepayment.toLocaleString()} ₽
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
              <Icon name="GraduationCap" size={20} />
              Образование
            </h4>
            <ul className="space-y-2">
              {doctor.education.map((edu, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={16} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{edu}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
              <Icon name="Sparkles" size={20} />
              Профессиональные навыки
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
              <Icon name="Award" size={20} />
              Профессиональные достижения
            </h4>
            <ul className="space-y-2">
              {doctor.achievements.map((achievement, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={16} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
              <Icon name="Clipboard" size={20} />
              Принимает пациентов
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor.servicesProvided.map((service, idx) => (
                <Badge key={idx} variant="outline" className="bg-blue-50">{service}</Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" size="lg" onClick={() => onOrder(doctor)}>
              <Icon name="CalendarCheck" className="mr-2" size={20} />
              Заказать выезд
            </Button>
            <Button variant="outline" size="lg" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetailsModal;
