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
    await Promise.all(
      products.map(async (product) => {
        return await this.snsRepository.sendNotification({
          Message: `Product ${product.title} was created`,
          Subject: 'Products have updated',
          MessageAttributes: {
            count: {
              DataType: 'Number',
              StringValue: `${product.count}`,
            },
          },
        })
      })
    )
  }
}
