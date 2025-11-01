import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import funcUrls from '../../../backend/func2url.json';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = localStorage.getItem('admin_token');
      const userType = localStorage.getItem('user_type');

      if (!adminToken || userType !== 'admin') {
        setIsChecking(false);
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await fetch(funcUrls['auth-admin'], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'verify',
            token: adminToken,
          }),
        });

        const data = await response.json();

        if (response.ok && data.valid && data.admin.user_type === 'admin') {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_name');
          localStorage.removeItem('admin_email');
          localStorage.removeItem('admin_role');
          localStorage.removeItem('user_type');
          setIsAuthorized(false);
          
          toast({
            title: "Сессия истекла",
            description: "Пожалуйста, войдите снова",
            variant: "destructive",
          });
        }
      } catch (error) {
        setIsAuthorized(false);
        toast({
          title: "Ошибка проверки доступа",
          description: "Не удалось проверить права доступа",
          variant: "destructive",
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [toast]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
