import { Card, CardContent } from "@/components/ui/card";
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

interface DoctorCardProps {
  doctor: Doctor;
  onViewDetails: (doctor: Doctor) => void;
  onOrder: (doctor: Doctor) => void;
}

const DoctorCard = ({ doctor, onViewDetails, onOrder }: DoctorCardProps) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center mb-4">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-24 h-24 rounded-full mb-4 border-4 border-blue-100"
          />
          <h3 className="font-bold text-lg mb-2 text-blue-900">{doctor.name}</h3>
          <Badge className="mb-2">{doctor.specialty}</Badge>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Icon name="Building2" size={16} />
            <span className="line-clamp-1">{doctor.workplace}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Icon name="Briefcase" size={16} />
            <span>{doctor.experience} опыта</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{doctor.description}</p>

          <div className="bg-blue-50 rounded-lg p-3 mb-4 w-full">
            <p className="text-xs text-gray-600 mb-1">Предоплата за выезд</p>
            <p className="text-2xl font-bold text-blue-600">
              {doctor.prepayment.toLocaleString()} ₽
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <Button variant="outline" onClick={() => onViewDetails(doctor)}>
            <Icon name="Eye" className="mr-2" size={18} />
            Подробнее
          </Button>
          <Button onClick={() => onOrder(doctor)}>
            <Icon name="CalendarCheck" className="mr-2" size={18} />
            Заказать
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
