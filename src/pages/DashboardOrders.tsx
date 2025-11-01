import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

const DashboardOrders = () => {
  const navigate = useNavigate();
  const clinicName = localStorage.getItem('clinic_name') || 'Медицинский центр';
  const authToken = localStorage.getItem('auth_token');

  if (!authToken) {
    navigate('/login');
    return null;
  }

  const orders = [
    {
      id: "#001",
      doctor: "Иванов И.И.",
      specialty: "Нейрохирург",
      date: "15.04.2025",
      patients: 14,
      status: "new",
      createdAt: "01.11.2025",
    },
    {
      id: "#002",
      doctor: "Петрова А.С.",
      specialty: "Кардиолог",
      date: "18.04.2025",
      patients: 12,
      status: "in_progress",
      createdAt: "28.10.2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      new: { label: "Новая", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
      in_progress: { label: "В согласовании", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
      confirmed: { label: "Подтверждена", className: "bg-green-100 text-green-700 hover:bg-green-100" },
      completed: { label: "Завершена", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
    };

    const variant = variants[status] || variants.new;
    return <Badge className={variant.className}>{variant.label}</Badge>;
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

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-2">История заявок</h2>
          <p className="text-gray-600 text-lg">Все ваши заявки на выезды врачей-специалистов</p>
        </div>

        {orders.length > 0 ? (
          <>
            <Card className="hidden md:block shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead className="font-semibold">ID заявки</TableHead>
                      <TableHead className="font-semibold">Врач</TableHead>
                      <TableHead className="font-semibold">Дата выезда</TableHead>
                      <TableHead className="font-semibold">Пациентов</TableHead>
                      <TableHead className="font-semibold">Статус</TableHead>
                      <TableHead className="font-semibold">Создана</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{order.doctor}</p>
                            <p className="text-sm text-gray-600">{order.specialty}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.patients}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-gray-600">{order.createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Заявка {order.id}</p>
                        <h3 className="font-bold text-lg text-blue-900">{order.doctor}</h3>
                        <p className="text-sm text-gray-600">{order.specialty}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Дата выезда:</span>
                        <span className="font-semibold">{order.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Пациентов:</span>
                        <span className="font-semibold">{order.patients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Создана:</span>
                        <span className="font-semibold">{order.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Icon name="FileX" size={64} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-700">У вас пока нет заявок</h3>
              <p className="text-gray-600 mb-6">
                У вас пока нет заявок на выезды врачей. Перейдите к списку специалистов и создайте первую заявку!
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                <Icon name="Users" className="mr-2" size={18} />
                Перейти к специалистам
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardOrders;
