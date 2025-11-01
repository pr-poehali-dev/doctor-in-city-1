import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DoctorsHeader from "@/components/doctors/DoctorsHeader";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorCard from "@/components/doctors/DoctorCard";
import DoctorDetailsModal from "@/components/doctors/DoctorDetailsModal";
import OrderModal from "@/components/doctors/OrderModal";
import { mockDoctors, specialties, Doctor } from "@/components/doctors/mockDoctors";

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

  const filteredAndSortedDoctors = useMemo(() => {
    let result = [...mockDoctors];

    if (searchQuery) {
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (specialtyFilter !== "all" && specialtyFilter !== "Все специальности") {
      result = result.filter(doc => doc.specialty === specialtyFilter);
    }

    if (workplaceFilter !== "all") {
      result = result.filter(doc => doc.workplaceType === workplaceFilter);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.prepayment - b.prepayment);
        break;
      case "price-desc":
        result.sort((a, b) => b.prepayment - a.prepayment);
        break;
      case "experience":
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case "alphabet":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchQuery, specialtyFilter, workplaceFilter, sortBy]);

  const hasActiveFilters = searchQuery !== "" || specialtyFilter !== "all" || workplaceFilter !== "all" || sortBy !== "alphabet";

  const resetFilters = () => {
    setSearchQuery("");
    setSpecialtyFilter("all");
    setWorkplaceFilter("all");
    setSortBy("alphabet");
  };

  const handleOrderClick = (doctor: Doctor) => {
    if (!authToken) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему для заказа выезда врача",
        variant: "destructive",
      });
      setTimeout(() => navigate('/register'), 1500);
      return;
    }

    setSelectedDoctor(doctor);
    setOrderModalOpen(true);
  };

  const handleSubmitOrder = () => {
    if (!orderForm.date || !orderForm.contactPerson || !orderForm.phone) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время",
    });

    setOrderModalOpen(false);
    setOrderForm({
      date: "",
      contactPerson: "",
      phone: "",
      patientCount: "",
      comment: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorsHeader isAuthenticated={!!authToken} clinicName={clinicName} />

      <DoctorFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        specialtyFilter={specialtyFilter}
        setSpecialtyFilter={setSpecialtyFilter}
        workplaceFilter={workplaceFilter}
        setWorkplaceFilter={setWorkplaceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        specialties={specialties}
        filteredCount={filteredAndSortedDoctors.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
      />

      <section className="py-12 px-6">
        <div className="container mx-auto">
          {filteredAndSortedDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewDetails={setSelectedDoctor}
                  onOrder={handleOrderClick}
                />
              ))}
            </div>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Icon name="SearchX" size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700">По вашему запросу врачи не найдены</h3>
                <p className="text-gray-600 mb-6">Попробуйте изменить параметры фильтрации</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <DoctorDetailsModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onOrder={handleOrderClick}
      />

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        doctor={selectedDoctor}
        orderForm={orderForm}
        setOrderForm={setOrderForm}
        clinicName={clinicName}
        onSubmit={handleSubmitOrder}
      />
    </div>
  );
};

export default Doctors;
