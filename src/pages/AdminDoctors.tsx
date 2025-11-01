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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Активен</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Неактивен</Badge>;
      case 'on_moderation':
        return <Badge className="bg-yellow-500">На модерации</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск по имени, специальности или месту работы..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={loadDoctors}>
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
                  <SelectItem value="inactive">Неактивные</SelectItem>
                  <SelectItem value="on_moderation">На модерации</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-gray-600">
                Найдено: <span className="font-bold text-blue-600">{doctors.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка врачей...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 flex-1">
                      {doctor.photo_url && (
                        <img
                          src={doctor.photo_url}
                          alt={doctor.full_name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{doctor.full_name}</h3>
                          {getStatusBadge(doctor.status)}
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 mt-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Специальность:</strong> {doctor.specialty}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Место работы:</strong> {doctor.workplace}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Опыт:</strong> {doctor.experience_years} лет
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Предоплата:</strong> {doctor.prepayment_amount} ₽
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Рейтинг:</strong> {doctor.rating ? doctor.rating.toFixed(1) : '—'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Визитов:</strong> {doctor.successful_visits_count || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" onClick={() => openEditDialog(doctor)}>
                        <Icon name="Edit" size={18} />
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteDoctor(doctor.id, doctor.full_name)}
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

      <Dialog open={isEditMode || isCreateMode} onOpenChange={() => { setIsEditMode(false); setIsCreateMode(false); resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreateMode ? 'Добавить врача' : 'Редактировать врача'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>ФИО врача *</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Специальность *</Label>
                <Input
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Кардиолог"
                />
              </div>
              <div>
                <Label>Опыт работы (лет) *</Label>
                <Input
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label>Место работы *</Label>
              <Input
                value={formData.workplace}
                onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                placeholder="Городская больница №1"
              />
            </div>

            <div>
              <Label>Тип места работы</Label>
              <Select
                value={formData.workplace_type || ''}
                onValueChange={(value) => setFormData({ ...formData, workplace_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Больница</SelectItem>
                  <SelectItem value="clinic">Клиника</SelectItem>
                  <SelectItem value="private">Частная практика</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Предоплата (₽)</Label>
              <Input
                type="number"
                value={formData.prepayment_amount}
                onChange={(e) => setFormData({ ...formData, prepayment_amount: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label>URL фотографии</Label>
              <Input
                value={formData.photo_url || ''}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div>
              <Label>Описание</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание врача"
                rows={3}
              />
            </div>

            <div>
              <Label>Что включено в стоимость</Label>
              <Textarea
                value={formData.price_includes || ''}
                onChange={(e) => setFormData({ ...formData, price_includes: e.target.value })}
                placeholder="Описание услуг"
                rows={2}
              />
            </div>

            <div>
              <Label>Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активен</SelectItem>
                  <SelectItem value="inactive">Неактивен</SelectItem>
                  <SelectItem value="on_moderation">На модерации</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setIsEditMode(false); setIsCreateMode(false); resetForm(); }}>
              Отмена
            </Button>
            <Button
              onClick={isCreateMode ? handleCreateDoctor : handleUpdateDoctor}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Сохранение...' : (isCreateMode ? 'Создать' : 'Сохранить')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDoctors;
