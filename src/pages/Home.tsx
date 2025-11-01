import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: "Заключение договора",
      description: "Подписание договора между клиникой и сервисом",
      icon: "FileCheck",
    },
    {
      number: 2,
      title: "Организация коммуникации",
      description: "Создание проектного чата в Telegram для оперативного взаимодействия",
      icon: "MessageCircle",
    },
    {
      number: 3,
      title: "Планирование визита",
      description: "Согласование даты выезда, выбор специалиста и расчет стоимости командировки",
      icon: "Calendar",
    },
    {
      number: 4,
      title: "Финансовое обеспечение",
      description: "Внесение предоплаты, комиссия врача + командировочные расходы",
      icon: "Wallet",
    },
    {
      number: 5,
      title: "Организация записи",
      description: "Открытие записи пациентов к специалисту в клинике, информирование пациентов",
      icon: "CalendarCheck",
    },
    {
      number: 6,
      title: "Проведение приемов",
      description: "Визит специалиста и проведение консультаций",
      icon: "Stethoscope",
    },
    {
      number: 7,
      title: "Взаиморасчеты",
      description: "Расчет чистой выручки от приемов врача и оплата комиссии",
      icon: "TrendingUp",
    },
  ];

  const benefits = [
    {
      title: "Высококвалифицированные специалисты",
      description: "Организуем выезды врачей-специалистов из федеральных клиник России (Москва), а также опытных врачей частной практики",
      icon: "Award",
    },
    {
      title: "Полная логистическая поддержка",
      description: "Берем на себя всю логистику: организация транспортировки врача до места назначения и обратно в Москву, бронирование авиабилетов и поиск жилья для комфортного пребывания",
      icon: "Plane",
    },
    {
      title: "Прозрачная финансовая модель",
      description: "Принцип честного финансового расчета: оплата за консультации - предоплата - командировочные расходы = Чистая выручка, гарантирующая ясность и отсутствие скрытых платежей",
      icon: "Calculator",
    },
    {
      title: "Инновационная диагностика и маршрутизация",
      description: "Используем нейронные модели для анализа архива медицинских изображений, выявляя пациентов из группы 'high-risk' и обеспечивая их маршрутизацию с агентским вознаграждением",
      icon: "Brain",
    },
  ];

  const specialties = [
    "Нейрохирург",
    "Кардиолог",
    "Ортопед-травматолог",
    "Офтальмолог",
    "Онколог",
    "ЛОР",
    "Уролог",
    "Гинеколог",
    "Эндокринолог",
    "Гастроэнтеролог",
    "Невролог",
    "Хирург",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="Stethoscope" size={32} className="text-blue-200" />
            <h1 className="text-2xl font-bold">Доктор в Город</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="text-white hover:bg-blue-800" onClick={() => navigate('/login')}>
              Войти
            </Button>
            <Button variant="secondary" onClick={() => navigate('/register')}>
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Врачи-специалисты федеральных клиник для вашего региона
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Организуем выезды высококвалифицированных специалистов из Москвы и опытных врачей частной практики в ваш медицинский центр
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button size="lg" variant="secondary" onClick={() => navigate('/dashboard')}>
                <Icon name="Users" className="mr-2" size={20} />
                Посмотреть врачей
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-blue-800" onClick={() => navigate('/register')}>
                Зарегистрироваться
              </Button>
            </div>
          </div>
          <div className="hidden md:block animate-slide-up">
            <img 
              src="https://cdn.poehali.dev/files/afcc9db5-a748-462a-84b6-2b1935bf7b9d.png" 
              alt="Врач с чемоданом" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">Процесс сотрудничества</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">7 простых шагов от договора до успешного выезда специалиста</p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            {steps.slice(0, 4).map((step) => (
              <Card key={step.number} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {step.number}
                    </div>
                    <Icon name={step.icon as any} className="text-blue-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.slice(4).map((step) => (
              <Card key={step.number} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {step.number}
                    </div>
                    <Icon name={step.icon as any} className="text-blue-600" size={28} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-blue-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">Почему выбирают нас</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Комплексное решение для организации выездов специалистов</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mb-4 shadow-lg">
                    <Icon name={benefit.icon as any} className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-blue-900">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">Пример экономики успешного выезда специалиста</h2>
          <p className="text-center text-gray-600 mb-12">Прозрачный расчет прибыли для вашего медицинского центра</p>
          
          <Card className="shadow-xl border-blue-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Icon name="Settings" size={20} />
                    Параметры
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Стоимость консультации:</span>
                      <span className="font-bold text-lg">3 500 ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Количество консультаций:</span>
                      <span className="font-bold text-lg">14</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Выручка от консультаций
                  </h4>
                  <div className="text-4xl font-bold text-green-600">49 000 ₽</div>
                  <p className="text-sm text-gray-600 mt-2">3 500 × 14 = 49 000</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="MinusCircle" size={20} />
                  Расходы на выезд
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Комиссия врача:</span>
                    <span className="font-semibold">15 000 ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Авиабилеты:</span>
                    <span className="font-semibold">10 000 ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Проживание:</span>
                    <span className="font-semibold">3 000 ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Питание:</span>
                    <span className="font-semibold">1 500 ₽</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-900">Чистая выручка до комиссии сервиса:</span>
                    <span className="text-3xl font-bold text-blue-600">19 500 ₽</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">49 000 - 15 000 - 10 000 - 3 000 - 1 500</p>
                </div>

                <div className="flex justify-between items-center px-6">
                  <span className="text-gray-600">Комиссия сервиса (15%):</span>
                  <span className="font-semibold text-lg">2 925 ₽</span>
                </div>

                <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 rounded-xl text-white shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <Icon name="Check" className="inline mr-2" size={24} />
                      <span className="text-xl font-semibold">Прибыль медицинского центра:</span>
                    </div>
                    <span className="text-4xl font-bold">16 575 ₽</span>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                    <Icon name="Plus" size={20} />
                    Дополнительная прибыль
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">От диагностики (конверсия ~20%):</span>
                      <span className="font-semibold text-yellow-700">~8 000 ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">От агентского вознаграждения (~1%):</span>
                      <span className="font-semibold text-yellow-700">~15 000 ₽</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-sm text-gray-700">
                  <strong className="text-blue-900">Принцип:</strong> Выручка - Комиссия врача - Командировочные = Чистая выручка до комиссии сервиса. Комиссия 15% применяется к чистой выручке
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-6 bg-blue-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">Наши специалисты</h2>
          <p className="text-center text-gray-600 mb-12">Врачи из ведущих федеральных клиник России</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specialties.map((specialty, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="px-6 py-3 text-base justify-center bg-white hover:bg-blue-100 transition-colors cursor-default shadow-sm"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Готовы начать сотрудничество?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Присоединяйтесь к проекту "Доктор в Город" уже сегодня и расширяйте спектр оказываемых услуг без существенных инвестиций в штат специалистов!
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => navigate('/register')}>
            <Icon name="UserPlus" className="mr-2" size={24} />
            Создать аккаунт
          </Button>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Stethoscope" size={32} className="text-blue-400" />
                <h3 className="text-2xl font-bold">Доктор в Город</h3>
              </div>
              <p className="text-gray-400">Платформа для организации выездов врачей-специалистов из федеральных клиник в региональные медицинские центры</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <Icon name="User" size={18} />
                  Илья Грибов
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Phone" size={18} />
                  +7 926 177 1947
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="Send" size={18} />
                  Telegram: @ilya_Gribov
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Доктор в Город. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
