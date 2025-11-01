import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import funcUrls from '../../backend/func2url.json';

interface Order {
  id: number;
  clinic_id: number;
  doctor_id: number | null;
  visit_date: string;
  visit_time: string | null;
  patient_count: number;
  service_type: string | null;
  urgency_level: string;
  status: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string | null;
  visit_address: string;
  visit_city: string | null;
  visit_region: string | null;
  special_requirements: string | null;
  estimated_cost: number;
  actual_cost: number | null;
  payment_status: string;
  prepayment_paid: boolean;
  clinic_comments: string | null;
  admin_notes: string | null;
  clinic_rating: number | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
  clinic_name: string;
  clinic_email: string;
  clinic_phone: string;
  doctor_name: string | null;
  doctor_specialty: string | null;
}

interface Doctor {
  id: number;
  full_name: string;
  specialty: string;
}

const AdminOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [assignDoctorId, setAssignDoctorId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const adminToken = localStorage.getItem('admin_token');

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (urgencyFilter !== 'all') {
        params.append('urgency', urgencyFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`${funcUrls['admin-orders']}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
      } else {
        toast({
          title: "Ошибка загрузки",
          description: data.error || "Не удалось загрузить список заявок",
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

  const loadDoctors = async () => {
    try {
      const response = await fetch(`${funcUrls['admin-doctors']}?status=active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error('Failed to load doctors:', error);
    }
  };

  useEffect(() => {
    loadOrders();
    loadDoctors();
  }, [statusFilter, urgencyFilter]);

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    const updateData: any = { id: selectedOrder.id };
    
    if (assignDoctorId) {
      updateData.doctor_id = assignDoctorId;
    }
    
    if (newStatus) {
      updateData.status = newStatus;
    }
    
    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    if (Object.keys(updateData).length === 1) {
      toast({
        title: "Нет изменений",
        description: "Выберите что нужно обновить",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(funcUrls['admin-orders'], {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "✅ Заявка обновлена",
          description: "Изменения успешно сохранены",
        });
        loadOrders();
        closeDialog();
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось обновить заявку",
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

  const openOrderDialog = (order: Order) => {
    setSelectedOrder(order);
    setAssignDoctorId(order.doctor_id);
    setNewStatus(order.status);
    setAdminNotes(order.admin_notes || '');
  };

  const closeDialog = () => {
    setSelectedOrder(null);
    setAssignDoctorId(null);
    setNewStatus("");
    setAdminNotes("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">Новая</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Подтверждена</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">В работе</Badge>;
      case 'completed':
        return <Badge className="bg-gray-600">Завершена</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Отменена</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Отклонена</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return <Badge className="bg-red-600">Срочно!</Badge>;
      case 'urgent':
        return <Badge className="bg-orange-500">Повышенная</Badge>;
      case 'normal':
        return <Badge variant="outline">Обычная</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
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
                <h1 className="text-2xl font-bold text-gray-900">Все заявки</h1>
                <p className="text-sm text-gray-600">Управление заявками от клиник на выезд врачей</p>
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
                  placeholder="Поиск по клинике, контакту или городу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={loadOrders}>
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
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="confirmed">Подтвержденные</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="completed">Завершенные</SelectItem>
                  <SelectItem value="cancelled">Отмененные</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Срочность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="emergency">Срочные</SelectItem>
                  <SelectItem value="urgent">Повышенные</SelectItem>
                  <SelectItem value="normal">Обычные</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-gray-600">
                Найдено: <span className="font-bold text-blue-600">{orders.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка заявок...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          Заявка #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                        {getUrgencyBadge(order.urgency_level)}
                        {order.prepayment_paid && (
                          <Badge className="bg-green-600">Предоплата внесена</Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Клиника</p>
                          <p className="text-sm font-semibold text-gray-900">{order.clinic_name}</p>
                          <p className="text-sm text-gray-600">{order.clinic_phone}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Врач</p>
                          {order.doctor_name ? (
                            <>
                              <p className="text-sm font-semibold text-gray-900">{order.doctor_name}</p>
                              <p className="text-sm text-gray-600">{order.doctor_specialty}</p>
                            </>
                          ) : (
                            <p className="text-sm text-red-600">Не назначен</p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Визит</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(order.visit_date)} {order.visit_time || ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.visit_city}, пациентов: {order.patient_count}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-4 text-sm">
                          <p className="text-gray-600">
                            <strong>Контакт:</strong> {order.contact_person}, {order.contact_phone}
                          </p>
                          <p className="text-gray-600">
                            <strong>Адрес:</strong> {order.visit_address}
                          </p>
                          {order.estimated_cost > 0 && (
                            <p className="text-gray-600">
                              <strong>Стоимость:</strong> {order.estimated_cost.toLocaleString()} ₽
                            </p>
                          )}
                        </div>
                        {order.special_requirements && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Особые требования:</strong> {order.special_requirements}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3 mt-4 text-xs text-gray-500">
                        <span>Создана: {formatDateTime(order.created_at)}</span>
                        {order.confirmed_at && <span>• Подтверждена: {formatDateTime(order.confirmed_at)}</span>}
                        {order.completed_at && <span>• Завершена: {formatDateTime(order.completed_at)}</span>}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button onClick={() => openOrderDialog(order)}>
                        <Icon name="Settings" className="mr-2" size={18} />
                        Управление
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="ClipboardList" size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">Заявки не найдены</h3>
                  <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <Dialog open={!!selectedOrder} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Управление заявкой #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <Label>Назначить врача</Label>
                <Select
                  value={assignDoctorId?.toString() || ''}
                  onValueChange={(value) => setAssignDoctorId(value ? parseInt(value) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите врача" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Не назначен</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.full_name} — {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Изменить статус</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="confirmed">Подтверждена</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="completed">Завершена</SelectItem>
                    <SelectItem value="cancelled">Отменена</SelectItem>
                    <SelectItem value="rejected">Отклонена</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Заметки администратора</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Внутренние заметки о заявке"
                  rows={4}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Информация о заявке</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Клиника:</span> {selectedOrder.clinic_name}
                  </div>
                  <div>
                    <span className="text-gray-600">Контакт:</span> {selectedOrder.contact_person}
                  </div>
                  <div>
                    <span className="text-gray-600">Телефон:</span> {selectedOrder.contact_phone}
                  </div>
                  <div>
                    <span className="text-gray-600">Дата визита:</span> {formatDate(selectedOrder.visit_date)}
                  </div>
                </div>
                {selectedOrder.clinic_comments && (
                  <div className="mt-3">
                    <span className="text-gray-600 font-semibold">Комментарий клиники:</span>
                    <p className="text-sm mt-1">{selectedOrder.clinic_comments}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Отмена
            </Button>
            <Button
              onClick={handleUpdateOrder}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
