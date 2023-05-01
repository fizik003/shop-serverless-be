import { injectable, inject } from 'inversify'

import { NotificationRepository } from '@repositories'
import { ProductCard } from '@types'

@injectable()
export class SnsService {
  private snsRepository: NotificationRepository
  constructor(@inject(NotificationRepository) snsRepo) {
    this.snsRepository = snsRepo
  }

  async sendNotificationProductsCreated(products: ProductCard[]): Promise<void> {
    const message = `Products have just created: ${products.map(({ title }) => title).join(', ')}`
    await this.snsRepository.sendNotification({
      Message: message,
      Subject: 'Products have updated',
    })
  }
}
