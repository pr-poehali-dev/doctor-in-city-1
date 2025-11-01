import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import funcUrls from '../../backend/func2url.json';

interface Clinic {
  id: number;
  clinic_name: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  account_status: string;
  registration_date: string;
  last_login: string | null;
  total_orders_count: number;
  completed_visits_count: number;
  active_orders_count: number;
  total_orders_amount: number;
  average_service_rating: number | null;
  contact_person_name: string;
  inn: string | null;
}

const AdminClinics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const adminToken = localStorage.getItem('admin_token');

  const loadClinics = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`${funcUrls['admin-clinics']}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setClinics(data.clinics);
      } else {
        toast({
          title: "Ошибка загрузки",
          description: data.error || "Не удалось загрузить список клиник",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка соединения",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClinics();
  }, [statusFilter]);

  const handleStatusChange = async (clinicId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(funcUrls['admin-clinics'], {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
        body: JSON.stringify({
          action: 'update_status',
          clinic_id: clinicId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "✅ Статус обновлен",
          description: `Статус клиники изменен на "${newStatus}"`,
        });
        loadClinics();
        setSelectedClinic(null);
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось обновить статус",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка соединения",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Активна</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500">Заблокирована</Badge>;
      case 'on_moderation':
        return <Badge className="bg-yellow-500">На модерации</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Управление клиниками</h1>
                <p className="text-sm text-gray-600">Просмотр и модерация клиник-клиентов</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск по названию, email или городу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={loadClinics}>
                <Icon name="Search" className="mr-2" size={18} />
                Найти
              </Button>
            </div>

            <div className="flex gap-4 items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="on_moderation">На модерации</SelectItem>
                  <SelectItem value="blocked">Заблокированные</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-gray-600">
                Найдено: <span className="font-bold text-blue-600">{clinics.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка клиник...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{clinic.clinic_name}</h3>
                        {getStatusBadge(clinic.account_status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Icon name="Mail" size={16} />
                            {clinic.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Icon name="Phone" size={16} />
                            {clinic.phone}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Icon name="MapPin" size={16} />
                            {clinic.city}, {clinic.region}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">
                            <strong>Контакт:</strong> {clinic.contact_person_name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Регистрация:</strong> {formatDate(clinic.registration_date)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Последний вход:</strong> {formatDate(clinic.last_login)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6 mt-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{clinic.total_orders_count}</p>
                          <p className="text-xs text-gray-600">Всего заказов</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{clinic.completed_visits_count}</p>
                          <p className="text-xs text-gray-600">Завершено</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-600">{clinic.active_orders_count}</p>
                          <p className="text-xs text-gray-600">Активных</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{clinic.total_orders_amount.toLocaleString()} ₽</p>
                          <p className="text-xs text-gray-600">Общая сумма</p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button onClick={() => setSelectedClinic(clinic)}>
                        <Icon name="Edit" className="mr-2" size={18} />
                        Управление
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {clinics.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="Building2" size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">Клиники не найдены</h3>
                  <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <Dialog open={!!selectedClinic} onOpenChange={() => setSelectedClinic(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Управление клиникой</DialogTitle>
          </DialogHeader>

          {selectedClinic && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">{selectedClinic.clinic_name}</h3>
                <p className="text-sm text-gray-600">{selectedClinic.email}</p>
              </div>

              <div>
                <Label>Изменить статус</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <Button
                    variant={selectedClinic.account_status === 'active' ? 'default' : 'outline'}
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => handleStatusChange(selectedClinic.id, 'active')}
                    disabled={isUpdating}
                  >
                    <Icon name="CheckCircle" className="mr-2" size={18} />
                    Активировать
                  </Button>
                  <Button
                    variant={selectedClinic.account_status === 'on_moderation' ? 'default' : 'outline'}
                    className="bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => handleStatusChange(selectedClinic.id, 'on_moderation')}
                    disabled={isUpdating}
                  >
                    <Icon name="Clock" className="mr-2" size={18} />
                    На модерацию
                  </Button>
                  <Button
                    variant={selectedClinic.account_status === 'blocked' ? 'default' : 'outline'}
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => handleStatusChange(selectedClinic.id, 'blocked')}
                    disabled={isUpdating}
                  >
                    <Icon name="Ban" className="mr-2" size={18} />
                    Заблокировать
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedClinic(null)}>
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClinics;
