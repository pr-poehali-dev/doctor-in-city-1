import { useState } from "react";
import funcUrls from '../../backend/func2url.json';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clinicName: "",
    email: "",
    phone: "",
    region: "",
    city: "",
    contactPersonName: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = "Название клиники обязательно";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    }

    if (!formData.region.trim()) {
      newErrors.region = "Регион обязателен";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Город обязателен";
    }

    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = "ФИО контактного лица обязательно";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (!formData.agreed) {
      newErrors.agreed = "Необходимо согласие с условиями";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(funcUrls['auth-clinic'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          clinic_name: formData.clinicName,
          email: formData.email,
          phone: formData.phone,
          region: formData.region,
          city: formData.city,
          password: formData.password,
          contact_person_name: formData.contactPersonName,
          terms_accepted: formData.agreed,
          data_processing_accepted: formData.agreed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "❌ Ошибка регистрации",
          description: data.error || "Не удалось зарегистрировать клинику",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('clinic_name', data.clinic.clinic_name);
      localStorage.setItem('clinic_id', data.clinic.id);
      localStorage.setItem('clinic_email', data.clinic.email);

      toast({
        title: "✅ Регистрация успешна!",
        description: "Ваш аккаунт на модерации. Вы можете войти в систему.",
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast({
        title: "❌ Ошибка соединения",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <Icon name="Stethoscope" size={48} className="text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-blue-900">
            Регистрация медицинского центра
          </CardTitle>
          <p className="text-center text-gray-600">Заполните данные для создания аккаунта</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="clinicName">Название клиники *</Label>
              <Input
                id="clinicName"
                type="text"
                placeholder="ООО 'Медицинский центр'"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className={errors.clinicName ? "border-red-500" : ""}
              />
              {errors.clinicName && <p className="text-red-500 text-sm mt-1">{errors.clinicName}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@clinic.ru"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Регион *</Label>
                <Input
                  id="region"
                  type="text"
                  placeholder="Московская область"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className={errors.region ? "border-red-500" : ""}
                />
                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
              </div>

              <div>
                <Label htmlFor="city">Город *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Москва"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="contactPersonName">ФИО контактного лица *</Label>
              <Input
                id="contactPersonName"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={formData.contactPersonName}
                onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                className={errors.contactPersonName ? "border-red-500" : ""}
              />
              {errors.contactPersonName && <p className="text-red-500 text-sm mt-1">{errors.contactPersonName}</p>}
            </div>

            <div>
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Подтверждение пароля *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreed"
                checked={formData.agreed}
                onCheckedChange={(checked) => setFormData({ ...formData, agreed: checked as boolean })}
              />
              <Label htmlFor="agreed" className="text-sm font-normal cursor-pointer">
                Согласен с условиями договора и политикой обработки данных
              </Label>
            </div>
            {errors.agreed && <p className="text-red-500 text-sm">{errors.agreed}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Регистрация...
                </>
              ) : (
                "Зарегистрироваться"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{" "}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Войти
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;