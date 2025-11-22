'use client';

import { useEffect } from 'react';
import { useSupabase, useCollection, supabase } from '@/supabase';
import { 
  showAppNotification, 
  NotificationType, 
  checkNotificationPermission,
  playNotificationSound 
} from '@/lib/notifications';

export function NotificationListener() {
  const { user } = useSupabase();

  // Query para obtener notificaciones no leídas del usuario (solo si hay usuario)
  const { data: notifications } = useCollection(
    'notifications',
    user?.id ? {
      filters: [
        { column: 'user_id', operator: '==', value: user.id },
        { column: 'read', operator: '==', value: false }
      ],
      orderBy: { column: 'created_at', ascending: false },
      limit: 10
    } : null
  );

  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    // Verificar permisos de notificaciones
    const permission = checkNotificationPermission();
    if (!permission.granted) return;

    // Procesar cada notificación no leída
    notifications.forEach((notification) => {
      // Verificar si ya fue mostrada en esta sesión
      const shownKey = `notification-shown-${notification.id}`;
      if (sessionStorage.getItem(shownKey)) return;

      // Mostrar notificación según el tipo
      let notificationType: NotificationType;
      
      switch (notification.type) {
        case 'appointment_confirmed':
          notificationType = NotificationType.APPOINTMENT_CONFIRMED;
          break;
        case 'appointment_rescheduled':
          notificationType = NotificationType.APPOINTMENT_RESCHEDULED;
          break;
        case 'appointment_cancelled':
          notificationType = NotificationType.APPOINTMENT_CANCELLED;
          break;
        case 'reschedule_request':
          notificationType = NotificationType.RESCHEDULE_REQUEST;
          break;
        case 'diagnosis_ready':
          notificationType = NotificationType.DIAGNOSIS_READY;
          break;
        case 'formula_created':
          notificationType = NotificationType.FORMULA_CREATED;
          break;
        default:
          notificationType = NotificationType.NEW_MESSAGE;
      }

      // Mostrar la notificación
      const browserNotification = showAppNotification(
        notificationType,
        notification.title,
        notification.message,
        { notificationId: notification.id, relatedId: notification.relatedId }
      );

      if (browserNotification) {
        // Reproducir sonido
        playNotificationSound();

        // Manejar clic en la notificación
        browserNotification.onclick = () => {
          window.focus();
          
          // Navegar según el tipo de notificación
          if (notification.relatedId) {
            if (notification.type.includes('appointment')) {
              window.location.href = '/dashboard/citas';
            } else if (notification.type.includes('diagnosis')) {
              window.location.href = '/dashboard/historial';
            } else if (notification.type.includes('formula')) {
              window.location.href = '/dashboard/formulas';
            }
          }

          // Marcar como leída
          supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notification.id)
            .then(() => {});

          browserNotification.close();
        };

        // Marcar como mostrada en esta sesión
        sessionStorage.setItem(shownKey, 'true');
      }
    });
  }, [notifications]);

  return null; // Este componente no renderiza nada
}
