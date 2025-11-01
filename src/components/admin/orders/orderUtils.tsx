import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return <Badge className="bg-blue-500">Новая</Badge>;
    case 'confirmed':
      return <Badge className="bg-green-500">Подтверждена</Badge>;
    case 'in_progress':
      return <Badge className="bg-yellow-500">В работе</Badge>;
    case 'completed':
      return <Badge className="bg-gray-600">Завершена</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Отменена</Badge>;
    case 'rejected':
      return <Badge className="bg-red-600">Отклонена</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const getUrgencyBadge = (urgency: string) => {
  switch (urgency) {
    case 'emergency':
      return <Badge className="bg-red-600">Срочно!</Badge>;
    case 'urgent':
      return <Badge className="bg-orange-500">Повышенная</Badge>;
    case 'normal':
      return <Badge variant="outline">Обычная</Badge>;
    default:
      return <Badge variant="outline">{urgency}</Badge>;
  }
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
