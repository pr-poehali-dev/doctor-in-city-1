import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";

interface OrdersSearchBarProps {
  searchQuery: string;
  statusFilter: string;
  urgencyFilter: string;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onUrgencyChange: (value: string) => void;
  onSearch: () => void;
}

const OrdersSearchBar = ({
  searchQuery,
  statusFilter,
  urgencyFilter,
  totalCount,
  onSearchChange,
  onStatusChange,
  onUrgencyChange,
  onSearch,
}: OrdersSearchBarProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск по клинике, контакту или городу..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={onSearch}>
            <Icon name="Search" className="mr-2" size={18} />
            Найти
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="confirmed">Подтвержденные</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="completed">Завершенные</SelectItem>
              <SelectItem value="cancelled">Отмененные</SelectItem>
            </SelectContent>
          </Select>

          <Select value={urgencyFilter} onValueChange={onUrgencyChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Срочность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="emergency">Срочные</SelectItem>
              <SelectItem value="urgent">Повышенные</SelectItem>
              <SelectItem value="normal">Обычные</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-gray-600">
            Найдено: <span className="font-bold text-blue-600">{totalCount}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersSearchBar;
