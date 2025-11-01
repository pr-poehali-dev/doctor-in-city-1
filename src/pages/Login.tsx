import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('auth_token', 'mock_jwt_token');
    localStorage.setItem('clinic_name', 'Медицинский центр "Здоровье"');
    
    toast({
      title: "✅ Вход выполнен!",
      description: "Перенаправляем в личный кабинет...",
    });

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <Icon name="Stethoscope" size={48} className="text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-blue-900">
            Вход в систему
          </CardTitle>
          <p className="text-center text-gray-600">Доктор в Город</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@clinic.ru"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password">Пароль</Label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => toast({ title: "Свяжитесь с поддержкой", description: "Телефон: +7 926 177 1947" })}
                >
                  Забыли пароль?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Запомнить меня
              </Label>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Войти
            </Button>

            <p className="text-center text-sm text-gray-600">
              Нет аккаунта?{" "}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Зарегистрироваться
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
