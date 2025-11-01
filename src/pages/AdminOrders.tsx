import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import funcUrls from '../../backend/func2url.json';
import OrderCard from "@/components/admin/orders/OrderCard";
import OrderManagementDialog from "@/components/admin/orders/OrderManagementDialog";
import OrdersSearchBar from "@/components/admin/orders/OrdersSearchBar";
import { getStatusBadge, getUrgencyBadge, formatDate, formatDateTime } from "@/components/admin/orders/orderUtils";

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
        <OrdersSearchBar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          urgencyFilter={urgencyFilter}
          totalCount={orders.length}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onUrgencyChange={setUrgencyFilter}
          onSearch={loadOrders}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка заявок...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onManage={openOrderDialog}
                getStatusBadge={getStatusBadge}
                getUrgencyBadge={getUrgencyBadge}
                formatDate={formatDate}
                formatDateTime={formatDateTime}
              />
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

      <OrderManagementDialog
        isOpen={!!selectedOrder}
        selectedOrder={selectedOrder}
        doctors={doctors}
        assignDoctorId={assignDoctorId}
        newStatus={newStatus}
        adminNotes={adminNotes}
        isUpdating={isUpdating}
        onClose={closeDialog}
        onUpdate={handleUpdateOrder}
        onAssignDoctorChange={setAssignDoctorId}
        onStatusChange={setNewStatus}
        onNotesChange={setAdminNotes}
        formatDate={formatDate}
      />
    </div>
  );
};

export default AdminOrders;
