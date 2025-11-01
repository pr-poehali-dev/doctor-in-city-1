import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

const EconomyCalculator = () => {
  const [consultationPrice, setConsultationPrice] = useState(3500);
  const [consultationsCount, setConsultationsCount] = useState(14);

  const doctorFee = 15000;
  const flights = 10000;
  const accommodation = 3000;
  const food = 1500;
  
  const totalRevenue = consultationPrice * consultationsCount;
  const expenses = doctorFee + flights + accommodation + food;
  const netRevenueBeforeFee = totalRevenue - expenses;
  const serviceFee = netRevenueBeforeFee * 0.15;
  const finalProfit = netRevenueBeforeFee - serviceFee;
  const roi = ((finalProfit / expenses) * 100).toFixed(1);
  const revenuePerPatient = (finalProfit / consultationsCount).toFixed(0);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">
          Калькулятор экономики выезда специалиста
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Настройте параметры и увидьте прозрачный расчет прибыли для вашего медицинского центра
        </p>

        <Card className="shadow-xl border-blue-200 overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-6 flex items-center gap-2 text-xl">
                  <Icon name="Sliders" size={24} />
                  Настройте параметры
                </h4>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-gray-700 font-medium">Стоимость консультации</Label>
                      <div className="text-3xl font-bold text-blue-600 transition-all duration-300">
                        {formatNumber(consultationPrice)} ₽
                      </div>
                    </div>
                    <Slider
                      value={[consultationPrice]}
                      onValueChange={(value) => setConsultationPrice(value[0])}
                      min={1000}
                      max={10000}
                      step={500}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 000 ₽</span>
                      <span>10 000 ₽</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Label className="text-gray-700 font-medium">Количество консультаций</Label>
                      <div className="text-3xl font-bold text-blue-600 transition-all duration-300">
                        {consultationsCount}
                      </div>
                    </div>
                    <Slider
                      value={[consultationsCount]}
                      onValueChange={(value) => setConsultationsCount(value[0])}
                      min={5}
                      max={30}
                      step={1}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>5</span>
                      <span>30</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 transition-all duration-300 hover:scale-105">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Выручка от консультаций
                  </h4>
                  <div className="text-4xl font-bold text-green-600 mb-1 transition-all duration-300">
                    {formatNumber(totalRevenue)} ₽
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatNumber(consultationPrice)} × {consultationsCount} = {formatNumber(totalRevenue)}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <Icon name="MinusCircle" size={18} />
                    Фиксированные расходы на выезд
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Комиссия врача:</span>
                      <span className="font-semibold">{formatNumber(doctorFee)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Авиабилеты:</span>
                      <span className="font-semibold">{formatNumber(flights)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Проживание:</span>
                      <span className="font-semibold">{formatNumber(accommodation)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Питание:</span>
                      <span className="font-semibold">{formatNumber(food)} ₽</span>
                    </div>
                    <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Всего расходов:</span>
                      <span className="font-bold text-lg">{formatNumber(expenses)} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-900">
                    Чистая выручка до комиссии сервиса:
                  </span>
                  <span className="text-3xl font-bold text-blue-600 transition-all duration-300">
                    {formatNumber(netRevenueBeforeFee)} ₽
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {formatNumber(totalRevenue)} - {formatNumber(expenses)} (расходы) = {formatNumber(netRevenueBeforeFee)}
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-900">Комиссия сервиса (15%):</span>
                  <span className="text-2xl font-bold text-purple-600 transition-all duration-300">
                    {formatNumber(serviceFee)} ₽
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex flex-col md:flex-row justify-between items-center text-white gap-4">
                  <div>
                    <p className="text-sm mb-1 text-green-100">Итоговая чистая прибыль клиники</p>
                    <h3 className="text-5xl md:text-6xl font-bold transition-all duration-300">
                      {formatNumber(finalProfit)} ₽
                    </h3>
                  </div>
                  <Icon name="TrendingUp" size={80} className="text-green-200 hidden md:block" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-green-100 mb-1">ROI (окупаемость)</p>
                    <p className="text-3xl font-bold text-white">{roi}%</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-green-100 mb-1">Прибыль на пациента</p>
                    <p className="text-3xl font-bold text-white">{revenuePerPatient} ₽</p>
                  </div>
                </div>
              </div>

              {netRevenueBeforeFee < 0 && (
                <div className="bg-red-50 p-6 rounded-xl border border-red-200 flex items-start gap-3">
                  <Icon name="AlertCircle" size={24} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Убыточная конфигурация</h4>
                    <p className="text-sm text-gray-700">
                      При текущих параметрах выезд будет убыточным. Попробуйте увеличить стоимость консультации
                      или количество пациентов.
                    </p>
                  </div>
                </div>
              )}

              {netRevenueBeforeFee > 0 && finalProfit > 20000 && (
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 flex items-start gap-3">
                  <Icon name="Sparkles" size={24} className="text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Отличная конфигурация!</h4>
                    <p className="text-sm text-gray-700">
                      Высокая рентабельность выезда. Не забудьте про дополнительную прибыль от диагностики (~20%
                      конверсия) и агентского вознаграждения (~1%).
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 p-5 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-sm text-gray-700">
                <strong className="text-blue-900">💡 Принцип расчета:</strong> Выручка от консультаций минус
                фиксированные расходы (комиссия врача + командировочные) = Чистая выручка. Комиссия сервиса 15%
                применяется к чистой выручке.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EconomyCalculator;
