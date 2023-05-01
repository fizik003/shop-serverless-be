import { Notification } from '@types'

export abstract class NotificationRepository {
  abstract sendNotification(notification: Notification): Promise<void>
}
