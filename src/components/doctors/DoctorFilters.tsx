import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface DoctorFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (value: string) => void;
  workplaceFilter: string;
  setWorkplaceFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  specialties: string[];
  filteredCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const DoctorFilters = ({
  searchQuery,
  setSearchQuery,
  specialtyFilter,
  setSpecialtyFilter,
  workplaceFilter,
  setWorkplaceFilter,
  sortBy,
  setSortBy,
  specialties,
  filteredCount,
  hasActiveFilters,
  onResetFilters,
}: DoctorFiltersProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-6 py-6">
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Поиск по ФИО врача..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Специальность" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={workplaceFilter} onValueChange={setWorkplaceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Место работы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="federal">Федеральные центры</SelectItem>
                  <SelectItem value="private">Частная практика</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphabet">По алфавиту</SelectItem>
                  <SelectItem value="price-asc">По стоимости (возрастание)</SelectItem>
                  <SelectItem value="price-desc">По стоимости (убывание)</SelectItem>
                  <SelectItem value="experience">По опыту</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-600 font-medium">
                Найдено специалистов: <span className="text-blue-600 font-bold">{filteredCount}</span>
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={onResetFilters}>
                  <Icon name="X" className="mr-2" size={16} />
                  Сбросить фильтры
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorFilters;
