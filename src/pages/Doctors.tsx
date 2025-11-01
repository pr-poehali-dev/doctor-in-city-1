import { useState, useMemo } from "react";
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

const Doctors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [workplaceFilter, setWorkplaceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("alphabet");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    date: "",
    contactPerson: "",
    phone: "",
    patientCount: "",
    comment: "",
  });

  const clinicName = localStorage.getItem('clinic_name') || '';
  const authToken = localStorage.getItem('auth_token');

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Иванов Иван Иванович",
      specialty: "Нейрохирург",
      workplace: "НМИЦ нейрохирургии им. Бурденко",
      workplaceType: "federal",
      education: ["МГМСУ, 2010", "Ординатура: НМИЦ им. Бурденко, 2012"],
      experience: "15 лет",
      experienceYears: 15,
      prepayment: 49000,
      dates: ["15.04", "16.04", "18.04", "20.04", "25.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
      description: "Ведущий специалист в области микрохирургии позвоночника и нейроонкологии",
      skills: ["Микрохирургия позвоночника", "Нейроонкология", "Малоинвазивные операции", "Эндоскопическая нейрохирургия"],
      achievements: [
        "Более 500 успешных операций на позвоночнике",
        "Кандидат медицинских наук",
        "Автор 20+ научных публикаций в международных журналах",
        "Член Российского общества нейрохирургов",
        "Преподаватель ординатуры НМИЦ им. Бурденко"
      ],
      servicesProvided: ["Первичная консультация", "Повторный прием", "Предоперационная подготовка", "Консультация по КТ/МРТ"]
    },
    {
      id: 2,
      name: "Петрова Анна Сергеевна",
      specialty: "Кардиолог",
      workplace: "НМИЦ кардиологии им. Чазова",
      workplaceType: "federal",
      education: ["РНИМУ им. Пирогова, 2012", "Ординатура: НМИЦ кардиологии, 2014"],
      experience: "13 лет",
      experienceYears: 13,
      prepayment: 45000,
      dates: ["15.04", "18.04", "22.04", "25.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
      description: "Специалист по интервенционной кардиологии и лечению нарушений ритма сердца",
      skills: ["Интервенционная кардиология", "Аритмология", "ЭхоКГ", "Холтер ЭКГ"],
      achievements: [
        "Более 300 интервенционных процедур",
        "Специализация в США (Cleveland Clinic, 2018)",
        "Эксперт по имплантации кардиостимуляторов",
        "Автор 15 научных работ",
        "Член Европейского общества кардиологов"
      ],
      servicesProvided: ["Консультация кардиолога", "ЭКГ", "ЭхоКГ", "Холтер ЭКГ", "Подбор терапии"]
    },
    {
      id: 3,
      name: "Сидоров Петр Дмитриевич",
      specialty: "Ортопед-травматолог",
      workplace: "НМИЦ травматологии им. Приорова",
      workplaceType: "federal",
      education: ["Первый МГМУ им. Сеченова, 2008", "Ординатура: НМИЦ им. Приорова, 2010"],
      experience: "17 лет",
      experienceYears: 17,
      prepayment: 52000,
      dates: ["16.04", "20.04", "25.04", "27.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petr",
      description: "Ведущий специалист по эндопротезированию суставов и артроскопическим операциям",
      skills: ["Эндопротезирование тазобедренного сустава", "Артроскопия коленного сустава", "Спортивная травматология", "Реконструктивные операции"],
      achievements: [
        "Более 700 операций эндопротезирования",
        "Доктор медицинских наук",
        "Врач сборной России по хоккею (2015-2020)",
        "Автор методики быстрой реабилитации после эндопротезирования",
        "Член Международного общества ортопедов"
      ],
      servicesProvided: ["Консультация ортопеда", "Анализ рентгенограмм", "Подбор протеза", "План лечения"]
    },
    {
      id: 4,
      name: "Кузнецова Елена Владимировна",
      specialty: "Офтальмолог",
      workplace: "НМИЦ глазных болезней им. Гельмгольца",
      workplaceType: "federal",
      education: ["СЗГМУ им. Мечникова, 2015", "Ординатура: НМИЦ им. Гельмгольца, 2017"],
      experience: "10 лет",
      experienceYears: 10,
      prepayment: 42000,
      dates: ["15.04", "18.04", "20.04", "27.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      description: "Специалист по лазерной коррекции зрения и хирургии катаракты",
      skills: ["Лазерная коррекция зрения (LASIK)", "Хирургия катаракты", "Рефракционная хирургия", "Диагностика глаукомы"],
      achievements: [
        "Более 400 операций по коррекции зрения",
        "Сертификат European Board of Ophthalmology",
        "Эксперт по имплантации премиум-линз",
        "Автор 10 научных публикаций",
        "Член Российского глаукомного общества"
      ],
      servicesProvided: ["Диагностика зрения", "Подбор очков/линз", "Консультация по лазерной коррекции", "Осмотр глазного дна"]
    },
    {
      id: 5,
      name: "Морозов Алексей Николаевич",
      specialty: "ЛОР",
      workplace: "Частная практика",
      workplaceType: "private",
      education: ["Первый МГМУ им. Сеченова, 2011", "Ординатура: НМИЦО ФМБА России, 2013"],
      experience: "14 лет",
      experienceYears: 14,
      prepayment: 38000,
      dates: ["16.04", "18.04", "22.04", "25.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
      description: "Эксперт по эндоскопической хирургии носа и околоносовых пазух",
      skills: ["Эндоскопическая хирургия носа", "Септопластика", "Ринопластика", "Лечение храпа"],
      achievements: [
        "Более 600 эндоскопических операций",
        "Стажировка в Германии (Universitätsklinikum Hamburg, 2019)",
        "Специалист по функциональной ринопластике",
        "Автор методики бескровной септопластики",
        "Член European Rhinologic Society"
      ],
      servicesProvided: ["Консультация ЛОР", "Эндоскопия полости носа", "Аудиометрия", "Подбор слуховых аппаратов"]
    },
    {
      id: 6,
      name: "Волкова Ольга Игоревна",
      specialty: "Онколог",
      workplace: "НМИЦ онкологии им. Блохина",
      workplaceType: "federal",
      education: ["РНИМУ им. Пирогова, 2013", "Ординатура: НМИЦ онкологии, 2015"],
      experience: "12 лет",
      experienceYears: 12,
      prepayment: 47000,
      dates: ["15.04", "20.04", "22.04", "27.04"],
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olga",
      description: "Специалист по онкомаммологии и таргетной терапии рака молочной железы",
      skills: ["Онкомаммология", "Таргетная терапия", "Иммунотерапия", "Химиотерапия"],
      achievements: [
        "Более 500 пациентов на таргетной терапии",
        "Кандидат медицинских наук",
        "Участие в международных клинических исследованиях",
        "Автор 18 научных публикаций",
        "Член Российского общества онкомаммологов"
      ],
      servicesProvided: ["Онкологическая консультация", "Расшифровка гистологии", "Подбор химиотерапии", "Второе мнение"]
    },
  ];

  const specialties = ["Все специальности", "Нейрохирург", "Кардиолог", "Ортопед-травматолог", "Офтальмолог", "Онколог", "ЛОР"];

  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...doctors];

    if (searchQuery) {
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (specialtyFilter !== "all") {
      result = result.filter(doc => doc.specialty === specialtyFilter);
    }

    if (workplaceFilter === "federal") {
      result = result.filter(doc => doc.workplaceType === "federal");
    } else if (workplaceFilter === "private") {
      result = result.filter(doc => doc.workplaceType === "private");
    }

    switch (sortBy) {
      case "alphabet":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.prepayment - b.prepayment);
        break;
      case "price-desc":
        result.sort((a, b) => b.prepayment - a.prepayment);
        break;
      case "experience":
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
    }

    return result;
  }, [searchQuery, specialtyFilter, workplaceFilter, sortBy]);

  const hasActiveFilters = searchQuery || specialtyFilter !== "all" || workplaceFilter !== "all" || sortBy !== "alphabet";

  const resetFilters = () => {
    setSearchQuery("");
    setSpecialtyFilter("all");
    setWorkplaceFilter("all");
    setSortBy("alphabet");
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('clinic_name');
    navigate('/');
  };

  const handleOrderClick = (doctor: Doctor) => {
    if (!authToken) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему или зарегистрируйтесь для заказа выезда врача",
        variant: "destructive",
      });
      setTimeout(() => navigate('/register'), 1500);
      return;
    }

    setSelectedDoctor(null);
    setOrderForm({
      date: "",
      contactPerson: "",
      phone: "",
      patientCount: "",
      comment: "",
    });
    setOrderModalOpen(true);
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

    setOrderModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Icon name="Stethoscope" size={32} className="text-blue-200" />
            <h1 className="text-2xl font-bold">Доктор в Город</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <button className="hover:text-blue-200 transition-colors font-medium" onClick={() => navigate('/')}>
              Главная
            </button>
            <button className="hover:text-blue-200 transition-colors font-medium" onClick={() => navigate('/doctors')}>
              Врачи
            </button>
            <button className="hover:text-blue-200 transition-colors font-medium">
              О нас
            </button>
          </nav>
          <div className="flex items-center gap-4">
            {authToken ? (
              <>
                <button className="hover:text-blue-200 transition-colors font-medium hidden md:block" onClick={() => navigate('/dashboard/orders')}>
                  Мои заявки
                </button>
                <div className="hidden md:block text-right">
                  <p className="text-sm text-blue-200">Вы вошли как:</p>
                  <p className="font-semibold">{clinicName}</p>
                </div>
                <Button variant="ghost" className="text-white hover:bg-blue-800" onClick={handleLogout}>
                  <Icon name="LogOut" className="mr-2" size={18} />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-white hover:bg-blue-800" onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button variant="secondary" onClick={() => navigate('/register')}>
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="py-16 px-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">Врачи-специалисты федеральных клиник</h2>
          <p className="text-xl text-blue-100">Выберите нужного специалиста и согласуйте дату выезда</p>
        </div>
      </section>

      <div className="sticky top-[72px] z-40 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Поиск по имени врача..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Специальность" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все специальности</SelectItem>
                    {specialties.filter(s => s !== "Все специальности").map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={workplaceFilter} onValueChange={setWorkplaceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Место работы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="federal">Федеральные центры</SelectItem>
                    <SelectItem value="private">Частная практика</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabet">По алфавиту</SelectItem>
                    <SelectItem value="price-asc">По стоимости (возрастание)</SelectItem>
                    <SelectItem value="price-desc">По стоимости (убывание)</SelectItem>
                    <SelectItem value="experience">По опыту</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-600 font-medium">
                  Найдено специалистов: <span className="text-blue-600 font-bold">{filteredAndSortedDoctors.length}</span>
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <Icon name="X" className="mr-2" size={16} />
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="py-12 px-6">
        <div className="container mx-auto">
          {filteredAndSortedDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
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
                      <Button variant="outline" onClick={() => setSelectedDoctor(doctor)}>
                        <Icon name="Eye" className="mr-2" size={18} />
                        Подробнее
                      </Button>
                      <Button onClick={() => handleOrderClick(doctor)}>
                        <Icon name="CalendarCheck" className="mr-2" size={18} />
                        Заказать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Icon name="SearchX" size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700">По вашему запросу врачи не найдены</h3>
                <p className="text-gray-600 mb-6">Попробуйте изменить параметры фильтрации</p>
                <Button onClick={resetFilters}>
                  <Icon name="RotateCcw" className="mr-2" size={18} />
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl">{selectedDoctor?.name}</DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col items-center">
                  <img
                    src={selectedDoctor.photo}
                    alt={selectedDoctor.name}
                    className="w-48 h-48 rounded-full mb-4 border-4 border-blue-100 shadow-lg"
                  />
                  <Badge className="mb-2 text-base px-4 py-1">{selectedDoctor.specialty}</Badge>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="Building2" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Место работы</p>
                      <p className="font-semibold">{selectedDoctor.workplace}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Icon name="Briefcase" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Опыт работы</p>
                      <p className="font-semibold">{selectedDoctor.experience}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg">
                  <p className="text-sm mb-2 text-blue-100">Предоплата за выезд</p>
                  <p className="text-4xl font-bold mb-3">{selectedDoctor.prepayment.toLocaleString()} ₽</p>
                  <p className="text-xs text-blue-100">
                    В стоимость входит: организация выезда, авиабилеты, проживание
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
                    <Icon name="GraduationCap" size={20} />
                    Образование
                  </h4>
                  <ul className="space-y-1">
                    {selectedDoctor.education.map((edu, idx) => (
                      <li key={idx} className="text-gray-700">{edu}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
                    <Icon name="Target" size={20} />
                    Специализация и навыки
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
                    <Icon name="Award" size={20} />
                    Профессиональные достижения
                  </h4>
                  <ul className="space-y-2">
                    {selectedDoctor.achievements.map((achievement, idx) => (
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
                    {selectedDoctor.servicesProvided.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50">{service}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" size="lg" onClick={() => handleOrderClick(selectedDoctor)}>
                    <Icon name="CalendarCheck" className="mr-2" size={20} />
                    Заказать выезд
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setSelectedDoctor(null)}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Заказ выезда врача-специалиста</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {selectedDoctor && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-lg mb-2 text-blue-900">{selectedDoctor?.name}</h4>
                  <p className="text-sm text-gray-700 mb-1">
                    {selectedDoctor?.specialty} • {selectedDoctor?.workplace}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    Предоплата: {selectedDoctor?.prepayment.toLocaleString()} ₽
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Выбор даты *</Label>
                <Select value={orderForm.date} onValueChange={(value) => setOrderForm({ ...orderForm, date: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите дату выезда" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDoctor?.dates.map((date: string) => (
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
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
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
                📋 После отправки заявки мы создадим проектный чат в Telegram для оперативной координации всех
                деталей выезда
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOrderModalOpen(false)}>
                Отменить
              </Button>
              <Button className="flex-1" onClick={handleOrderSubmit}>
                Отправить заявку
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Doctors;