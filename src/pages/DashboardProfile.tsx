import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const DashboardProfile = () => {
  const navigate = useNavigate();
  const clinicName = localStorage.getItem('clinic_name') || 'Медицинский центр';
  const authToken = localStorage.getItem('auth_token');

  if (!authToken) {
    navigate('/login');
    return null;
  }

  const profileData = {
    clinicName: clinicName,
    email: "info@clinic.ru",
    phone: "+7 (812) 555-12-34",
    region: "Санкт-Петербург",
    registeredAt: "15.10.2025",
    completedTrips: 0,
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('clinic_name');
    navigate('/');
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

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-2">Профиль клиники</h2>
          <p className="text-gray-600 text-lg">Информация о вашем медицинском центре</p>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Icon name="Building2" size={24} />
                Информация о клинике
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Название клиники</p>
                  <p className="font-semibold text-lg">{profileData.clinicName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-lg">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Телефон</p>
                  <p className="font-semibold text-lg">{profileData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Регион/Город</p>
                  <p className="font-semibold text-lg">{profileData.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Дата регистрации</p>
                  <p className="font-semibold text-lg">{profileData.registeredAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Завершенных выездов</p>
                  <p className="font-semibold text-lg text-blue-600">{profileData.completedTrips}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" disabled className="cursor-not-allowed">
                  <Icon name="Edit" className="mr-2" size={18} />
                  Редактировать данные
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Для изменения данных свяжитесь с менеджером
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Icon name="Phone" size={24} />
                Контакты для связи
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="User" size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Менеджер проекта</p>
                    <p className="font-semibold text-lg">Илья Грибов</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Phone" size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="font-semibold text-lg">+7 926 177 1947</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Send" size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Telegram</p>
                    <a 
                      href="https://t.me/ilya_Gribov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-lg text-blue-600 hover:underline"
                    >
                      @ilya_Gribov
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
