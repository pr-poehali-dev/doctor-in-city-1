import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const adminName = localStorage.getItem('admin_name') || 'Администратор';
  const adminRole = localStorage.getItem('admin_role') || 'moderator';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('user_type');
    
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
    
    navigate('/admin-login');
  };

  const menuItems = [
    {
      title: "Управление клиниками",
      description: "Просмотр, модерация и управление клиниками-клиентами",
      icon: "Building2",
      path: "/admin/clinics",
      color: "bg-blue-500",
      available: true,
    },
    {
      title: "Управление врачами",
      description: "Добавление, редактирование и удаление врачей-специалистов",
      icon: "Users",
      path: "/admin/doctors",
      color: "bg-green-500",
      available: true,
    },
    {
      title: "Все заявки",
      description: "Просмотр всех заявок на выезд врачей от клиник",
      icon: "ClipboardList",
      path: "/admin/orders",
      color: "bg-purple-500",
      available: false,
    },
    {
      title: "Статистика",
      description: "Аналитика и статистика по системе",
      icon: "BarChart3",
      path: "/admin/stats",
      color: "bg-orange-500",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon name="ShieldCheck" size={32} className="text-yellow-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
                <p className="text-sm text-gray-600">Доктор в Город</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500">
                  {adminRole === 'super_admin' ? 'Супер-администратор' : 'Модератор'}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" className="mr-2" size={18} />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Добро пожаловать!</h2>
          <p className="text-gray-600">Выберите раздел для работы с системой</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                item.available ? 'hover:border-yellow-500' : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => item.available && navigate(item.path)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`${item.color} p-3 rounded-lg`}>
                    <Icon name={item.icon as any} size={28} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      {item.title}
                      {!item.available && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Скоро
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardHeader>
              {item.available && (
                <CardContent className="pt-0">
                  <Button variant="ghost" className="w-full justify-start text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
                    Открыть раздел
                    <Icon name="ArrowRight" className="ml-2" size={18} />
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Icon name="Info" size={24} className="text-yellow-700 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Информация о доступе</h3>
                <p className="text-sm text-yellow-800">
                  Вы авторизованы как {adminRole === 'super_admin' ? 'супер-администратор' : 'модератор'}. 
                  {adminRole === 'super_admin' 
                    ? ' У вас есть полный доступ ко всем функциям системы.' 
                    : ' Некоторые функции могут быть ограничены.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
