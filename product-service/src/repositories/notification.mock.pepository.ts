import { injectable } from 'inversify'

import { NotificationRepository } from '@repositories'
import { Notification } from 'src/types'

@injectable()
export class NotificationMockRepository implements NotificationRepository {
  async sendNotification(notification: Notification): Promise<void> {
    console.log(notification)
  }
}
