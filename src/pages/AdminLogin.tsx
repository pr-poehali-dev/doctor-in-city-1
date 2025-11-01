import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import funcUrls from '../../backend/func2url.json';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(funcUrls['auth-admin'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "❌ Ошибка входа",
          description: data.error || "Неверный email или пароль",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_name', data.admin.full_name);
      localStorage.setItem('admin_email', data.admin.email);
      localStorage.setItem('admin_role', data.admin.role);
      localStorage.setItem('user_type', 'admin');
      
      toast({
        title: "✅ Вход выполнен!",
        description: `Добро пожаловать, ${data.admin.full_name}`,
      });

      setTimeout(() => {
        navigate('/admin');
      }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-gray-700">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <Icon name="ShieldCheck" size={48} className="text-yellow-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            Панель администратора
          </CardTitle>
          <p className="text-center text-gray-600">Доктор в Город</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email администратора</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@doctor-in-city.ru"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="ShieldCheck" className="mr-2" size={20} />
                  Войти в панель
                </>
              )}
            </Button>

            <div className="pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-gray-900 w-full text-center"
              >
                ← Вернуться на главную
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
