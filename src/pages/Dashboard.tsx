import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
    date: "",
    contactPerson: "",
    phone: "",
    patientCount: "",
    comment: "",
  });

  const clinicName = localStorage.getItem('clinic_name') || 'Медицинский центр';
  const authToken = localStorage.getItem('auth_token');

  if (!authToken) {
    navigate('/login');
    return null;
  }

  const doctors = [
    {
      id: 1,
      name: "Иванов Иван Иванович",
      specialty: "Нейрохирург",
      workplace: "НМИЦ нейрохирургии им. Бурденко",
      education: "МГМСУ, 2010",
      experience: "15 лет",
      prepayment: "49 000 ₽",
      dates: ["15.04", "16.04", "18.04", "20.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    },
    {
      id: 2,
      name: "Петрова Анна Сергеевна",
      specialty: "Кардиолог",
      workplace: "НМИЦ кардиологии им. Чазова",
      education: "РНИМУ им. Пирогова, 2012",
      experience: "13 лет",
      prepayment: "45 000 ₽",
      dates: ["15.04", "18.04", "22.04", "25.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    },
    {
      id: 3,
      name: "Сидоров Петр Дмитриевич",
      specialty: "Ортопед-травматолог",
      workplace: "НМИЦ травматологии им. Приорова",
      education: "Первый МГМУ им. Сеченова, 2008",
      experience: "17 лет",
      prepayment: "52 000 ₽",
      dates: ["16.04", "20.04", "25.04", "27.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petr",
    },
    {
      id: 4,
      name: "Кузнецова Елена Владимировна",
      specialty: "Офтальмолог",
      workplace: "НМИЦ глазных болезней им. Гельмгольца",
      education: "СЗГМУ им. Мечникова, 2015",
      experience: "10 лет",
      prepayment: "42 000 ₽",
      dates: ["15.04", "18.04", "20.04", "27.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    },
    {
      id: 5,
      name: "Морозов Алексей Николаевич",
      specialty: "ЛОР (оториноларинголог)",
      workplace: "Частная практика",
      education: "Первый МГМУ им. Сеченова, 2011",
      experience: "14 лет",
      prepayment: "38 000 ₽",
      dates: ["16.04", "18.04", "22.04", "25.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
    },
    {
      id: 6,
      name: "Волкова Ольга Игоревна",
      specialty: "Онколог-маммолог",
      workplace: "НМИЦ онкологии им. Блохина",
      education: "РНИМУ им. Пирогова, 2013",
      experience: "12 лет",
      prepayment: "47 000 ₽",
      dates: ["15.04", "20.04", "22.04", "27.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olga",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('clinic_name');
    navigate('/');
  };

  const handleOrderClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    setOrderForm({
      date: "",
      contactPerson: "",
      phone: "",
      patientCount: "",
      comment: "",
    });
  };

  const handleOrderSubmit = () => {
    if (!orderForm.date || !orderForm.contactPerson || !orderForm.phone) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Заявка успешно отправлена!",
      description: "Мы свяжемся с вами в ближайшее время для согласования деталей и создания проектного чата в Telegram",
    });

    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="Stethoscope" size={32} className="text-blue-200" />
            <h1 className="text-2xl font-bold">Доктор в Город</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <button className="hover:text-blue-200 transition-colors font-medium" onClick={() => navigate('/dashboard')}>
              Врачи
            </button>
            <button className="hover:text-blue-200 transition-colors font-medium" onClick={() => navigate('/dashboard/orders')}>
              Мои заявки
            </button>
            <button className="hover:text-blue-200 transition-colors font-medium" onClick={() => navigate('/dashboard/profile')}>
              Профиль
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-blue-200">Вы вошли как:</p>
              <p className="font-semibold">{clinicName}</p>
            </div>
            <Button variant="ghost" className="text-white hover:bg-blue-800" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-2">Добро пожаловать, {clinicName}!</h2>
          <p className="text-gray-600 text-lg">Выберите врача-специалиста для организации выезда</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mb-4 border-4 border-blue-100"
                  />
                  <h3 className="font-bold text-lg mb-1 text-blue-900">{doctor.name}</h3>
                  <Badge className="mb-2">{doctor.specialty}</Badge>
                  <p className="text-sm text-gray-600">{doctor.workplace}</p>
                  <p className="text-xs text-gray-500 mt-1">{doctor.education}</p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4 text-gray-700">
                  <Icon name="Briefcase" size={16} />
                  <span className="text-sm font-medium">{doctor.experience} опыта</span>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Предоплата за выезд</p>
                  <p className="text-2xl font-bold text-blue-600">{doctor.prepayment}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Доступные даты:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {doctor.dates.map((date, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white">
                        {date}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleOrderClick(doctor)}>
                  <Icon name="Calendar" className="mr-2" size={18} />
                  Заказать выезд
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Заказ выезда врача-специалиста</DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-2 text-blue-900">{selectedDoctor.name}</h4>
                  <p className="text-sm text-gray-700 mb-1">{selectedDoctor.specialty} • {selectedDoctor.workplace}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">Предоплата: {selectedDoctor.prepayment}</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Выбор даты *</Label>
                  <Select value={orderForm.date} onValueChange={(value) => setOrderForm({ ...orderForm, date: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите дату выезда" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDoctor.dates.map((date: string) => (
                        <SelectItem key={date} value={date}>
                          {date}.2025
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contactPerson">Контактное лицо *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="ФИО ответственного лица"
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
                    onChange={(e) => setOrderForm({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="patientCount">Ожидаемое количество пациентов</Label>
                  <Input
                    id="patientCount"
                    type="number"
                    placeholder="Примерное количество консультаций"
                    value={orderForm.patientCount}
                    onChange={(e) => setOrderForm({ ...orderForm, patientCount: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea
                    id="comment"
                    placeholder="Дополнительная информация о выезде"
                    value={orderForm.comment}
                    onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Icon name="MessageCircle" className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-gray-700">
                  📋 После отправки заявки мы создадим проектный чат в Telegram для оперативной координации всех деталей выезда
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedDoctor(null)}>
                  Отменить
                </Button>
                <Button className="flex-1" onClick={handleOrderSubmit}>
                  Отправить заявку
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
