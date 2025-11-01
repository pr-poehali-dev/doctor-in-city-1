import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import funcUrls from '../../backend/func2url.json';
import DoctorCard from "@/components/admin/doctors/DoctorCard";
import DoctorFormDialog from "@/components/admin/doctors/DoctorFormDialog";
import DoctorsSearchBar from "@/components/admin/doctors/DoctorsSearchBar";

interface Doctor {
  id: number;
  full_name: string;
  specialty: string;
  workplace: string;
  workplace_type: string | null;
  experience_years: number;
  photo_url: string | null;
  prepayment_amount: number;
  status: string;
  rating: number | null;
  successful_visits_count: number | null;
  created_at: string;
  description?: string;
  price_includes?: string;
}

const AdminDoctors = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<Partial<Doctor>>({
    full_name: '',
    specialty: '',
    workplace: '',
    workplace_type: '',
    experience_years: 0,
    prepayment_amount: 0,
    description: '',
    price_includes: '',
    status: 'active'
  });

  const adminToken = localStorage.getItem('admin_token');

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`${funcUrls['admin-doctors']}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDoctors(data.doctors);
      } else {
        toast({
          title: "Ошибка загрузки",
          description: data.error || "Не удалось загрузить список врачей",
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
    loadDoctors();
  }, [statusFilter]);

  const handleCreateDoctor = async () => {
    if (!formData.full_name || !formData.specialty || !formData.workplace) {
      toast({
        title: "Ошибка валидации",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(funcUrls['admin-doctors'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "✅ Врач создан",
          description: `Врач ${formData.full_name} успешно добавлен`,
        });
        loadDoctors();
        setIsCreateMode(false);
        resetForm();
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось создать врача",
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

  const handleUpdateDoctor = async () => {
    if (!selectedDoctor) return;

    setIsUpdating(true);
    try {
      const response = await fetch(funcUrls['admin-doctors'], {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
        body: JSON.stringify({ ...formData, id: selectedDoctor.id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "✅ Данные обновлены",
          description: `Информация о враче обновлена`,
        });
        loadDoctors();
        setIsEditMode(false);
        setSelectedDoctor(null);
        resetForm();
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось обновить данные",
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

  const handleDeleteDoctor = async (doctorId: number, doctorName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить врача "${doctorName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${funcUrls['admin-doctors']}?id=${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': adminToken || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "✅ Врач удален",
          description: `Врач ${doctorName} удален из базы`,
        });
        loadDoctors();
        setSelectedDoctor(null);
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось удалить врача",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка соединения",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      full_name: doctor.full_name,
      specialty: doctor.specialty,
      workplace: doctor.workplace,
      workplace_type: doctor.workplace_type || '',
      experience_years: doctor.experience_years,
      prepayment_amount: doctor.prepayment_amount,
      description: doctor.description || '',
      price_includes: doctor.price_includes || '',
      status: doctor.status,
      photo_url: doctor.photo_url || ''
    });
    setIsEditMode(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateMode(true);
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      specialty: '',
      workplace: '',
      workplace_type: '',
      experience_years: 0,
      prepayment_amount: 0,
      description: '',
      price_includes: '',
      status: 'active'
    });
  };

  const closeDialog = () => {
    setIsEditMode(false);
    setIsCreateMode(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (isCreateMode) {
      handleCreateDoctor();
    } else {
      handleUpdateDoctor();
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Управление врачами</h1>
                <p className="text-sm text-gray-600">CRUD операции с врачами в базе</p>
              </div>
            </div>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Icon name="Plus" className="mr-2" size={18} />
              Добавить врача
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <DoctorsSearchBar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          totalCount={doctors.length}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onSearch={loadDoctors}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка врачей...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onEdit={openEditDialog}
                onDelete={handleDeleteDoctor}
              />
            ))}

            {doctors.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="User" size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">Врачи не найдены</h3>
                  <p className="text-gray-600">Попробуйте изменить параметры поиска или добавьте нового врача</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <DoctorFormDialog
        isOpen={isEditMode || isCreateMode}
        isCreateMode={isCreateMode}
        isUpdating={isUpdating}
        formData={formData}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        onFormChange={setFormData}
      />
    </div>
  );
};

export default AdminDoctors;
