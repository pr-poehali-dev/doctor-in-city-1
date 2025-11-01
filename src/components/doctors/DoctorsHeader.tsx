import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface DoctorsHeaderProps {
  isAuthenticated: boolean;
  clinicName: string;
}

const DoctorsHeader = ({ isAuthenticated, clinicName }: DoctorsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Icon name="Stethoscope" size={40} />
            Доктор в Город
          </h1>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                  <Icon name="LayoutDashboard" className="mr-2" size={20} />
                  Личный кабинет
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => navigate('/login')}>
                  <Icon name="LogIn" className="mr-2" size={20} />
                  Войти
                </Button>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-blue-800" onClick={() => navigate('/register')}>
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-4">
            Каталог врачей-специалистов
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl">
            Выберите высококвалифицированного специалиста из федеральных центров Москвы или опытного врача частной практики для выезда в ваш медицинский центр
          </p>
          {isAuthenticated && clinicName && (
            <div className="mt-4 bg-blue-800 inline-block px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-200">Клиника:</p>
              <p className="font-semibold">{clinicName}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DoctorsHeader;
