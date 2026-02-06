export const data = {
  "users": [
    {
      "id": 1,
      "email": "admin1@mail.ru",
      "password": "admin111"
    },
    {
      "id": 2,
      "email": "admin2@mail.ru",
      "password": "admin222"
    }
  ],
  "mailings": [
    {
      "id": "a1b2c3",
      "name": "Приветственное SMS",
      "type": "sms",
      "status": "draft",
      "recipients": [
        "+79001112233",
        "+79004445566"
      ],
      "template_id": 2,
      "scheduleType": "recurring",
      "stats": {
        "total": 2,
        "delivered": 1,
        "failed": 1
      },
      "createdAt": "2023-10-25T08:00:00.000Z",
      "scheduleData": {
        "recurrence": "monthly",
        "nums": [
          "10",
          "20",
          "30"
        ],
        "time": "02:00"
      }
    },
    {
      "id": "a1b2c4",
      "name": "Повторное SMS",
      "type": "sms",
      "status": "error",
      "recipients": [
        "+79001112233",
        "+79004445566"
      ],
      "template_id": 2,
      "scheduleType": "recurring",
      "stats": {
        "total": 2,
        "delivered": 1,
        "failed": 1
      },
      "createdAt": "2023-10-25T09:30:00.000Z",
      "scheduleData": {
        "recurrence": "weekly",
        "days": [
          "mon",
          "wed",
          "fri"
        ],
        "time": "15:00"
      }
    },
    {
      "id": "a1b2c5",
      "name": "Рекламное SMS",
      "type": "sms",
      "status": "launched",
      "recipients": [
        "+79001112233",
        "+79004445566"
      ],
      "template_id": 2,
      "scheduleType": "recurring",
      "stats": {
        "total": 2,
        "delivered": 1,
        "failed": 1
      },
      "createdAt": "2023-10-25T11:45:00.000Z",
      "scheduleData": {
        "recurrence": "daily",
        "time": "20:00"
      }
    },
    {
      "id": "a1b2c6",
      "name": "Напоминание SMS",
      "type": "sms",
      "status": "draft",
      "recipients": [
        "+79001112233",
        "+79004445566"
      ],
      "template_id": 2,
      "scheduleType": "scheduled",
      "stats": {
        "total": 2,
        "delivered": 1,
        "failed": 1
      },
      "createdAt": "2023-10-25T14:15:00.000Z",
      "scheduleData": {
        "date": "2026-01-26T19:00:00.000Z",
        "time": "18:00"
      }
    },
    {
      "id": "d4e5f6",
      "name": "Акция октября",
      "type": "email",
      "status": "draft",
      "recipients": [
        "user1@mail.com",
        "user2@mail.com"
      ],
      "template_id": 1,
      "scheduleType": "immediate",
      "createdAt": "2023-10-20T14:30:00.000Z"
    },
    {
      "id": "d4e5f7",
      "name": "Акция ноября",
      "type": "email",
      "status": "draft",
      "recipients": [
        "user1@mail.com",
        "user2@mail.com"
      ],
      "template_id": 1,
      "scheduleType": "immediate",
      "createdAt": "2023-10-20T15:30:00.000Z"
    },
    {
      "id": "d4e5f8",
      "name": "Акция декабря",
      "type": "email",
      "status": "error",
      "recipients": [
        "user1@mail.com",
        "user2@mail.com"
      ],
      "template_id": 1,
      "scheduleType": "immediate",
      "createdAt": "2023-10-20T16:30:00.000Z"
    },
    {
      "id": "d4e5f9",
      "name": "Акция января",
      "type": "email",
      "status": "draft",
      "recipients": [
        "user1@mail.com",
        "user2@mail.com"
      ],
      "template_id": 3,
      "scheduleType": "immediate",
      "createdAt": "2023-10-20T17:30:00.000Z"
    }
  ],
  "templates": [
    {
      "id": 1,
      "name": "Приветственное письмо",
      "type": "email",
      "subject": "Добро пожаловать!",
      "body": "Уважаемый {{name}}, спасибо за регистрацию!",
      "createdAt": "2023-10-25T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "SMS-напоминание",
      "type": "sms",
      "subject": null,
      "body": "Напоминаем о записи на {{date}}.",
      "createdAt": "2023-10-24T15:30:00.000Z"
    },
    {
      "name": "Email - подтверждение",
      "type": "email",
      "body": "<h2>Привет {{name}}!</h2><p>Вы успешно выполнили действия</p><ul><li><p>действие 1</p></li><li><p>действие 2</p></li><li><p>действие 3</p></li></ul><p></p><p></p>",
      "subject": "Подтверждение действия",
      "createdAt": "2025-09-30T10:18:12.421Z",
      "id": 3
    }
  ],
  "stats": [
    {
      "id": 1,
      "totalMailings": { 
        "all": 145,
        "success": 102,
        "partly": 36,
        "error": 7
      },
      "mailingsToday": {
        "all": 5,
        "success": 3,
        "partly": 1,
        "error": 1
      },
      "deliveredSms": {
        "all": 1280,
        "today": 11,
        "week": 65,
        "month": 281
      },
      "deliveredEmails": {
        "all": 5642,
        "today": 32,
        "week": 154,
        "month": 587
      },
      "chartData": {
        "lastWeek": [15, 12, 8, 10, 5, 9, 5],
        "lastMonth": [45, 52, 48, 60, 55, 58, 45, 50, 48, 52, 60, 55]
      }
    }
  ]
}
