export function formatDate(dateString) {
  const date = new Date(dateString);
  
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return date.toLocaleString('ru-RU', options);
}

export function statusRussian(status) {
    const statuseNames = {
        completed: 'Выполнена',
        draft: 'Запланирована'
    };
    return statuseNames[status] ?? '';
}
