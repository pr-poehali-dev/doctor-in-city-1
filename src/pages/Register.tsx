import { useState } from "react";
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
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      newErrors.region = "Регион/Город обязателен";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "✅ Регистрация успешна!",
        description: "Теперь вы можете войти в систему",
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
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

            <div>
              <Label htmlFor="region">Регион/Город *</Label>
              <Input
                id="region"
                type="text"
                placeholder="Санкт-Петербург"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className={errors.region ? "border-red-500" : ""}
              />
              {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
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

            <Button type="submit" className="w-full" size="lg">
              Зарегистрироваться
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
