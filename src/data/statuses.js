export const statuses = {
    draft: {
        translation: 'Черновик',
        action: 'Выполнить',
        action_time: 5,
        status_after_action: {
            immediate: 'completed',
            scheduled: 'planned',
            recurring: 'launched'
        },
        icon: 'mdi-file-edit-outline'
    },
    completed: {
        translation: 'Выполнена',
        action: 'Повторить',
        action_time: 5,
        status_after_action: {
            immediate: 'completed',
            scheduled: 'planned',
            recurring: 'launched'
        },
        icon: 'mdi-check'
    },
    planned: {
        translation: 'Запланирована',
        action: 'Отменить',
        action_time: 1,
        status_after_action: {
            immediate: 'draft',
            scheduled: 'draft',
            recurring: 'draft'
        },
        icon: 'mdi-clock-outline'
    },
    error: {
        translation: 'Ошибка',
        action: 'Повторить',
        action_time: 5,
        status_after_action: {
            immediate: 'completed',
            scheduled: 'planned',
            recurring: 'launched'
        },
        icon: 'mdi-alert-circle-outline'
    },
    launched: {
        translation: 'Запущена',
        action: 'Отменить',
        action_time: 1,
        status_after_action: {
            immediate: 'draft',
            scheduled: 'draft',
            recurring: 'draft'
        },
        icon: 'mdi-checkbox-multiple-outline'
    }
}