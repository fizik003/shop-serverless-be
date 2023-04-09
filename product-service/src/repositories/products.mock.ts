import { injectable } from 'inversify'
import { Product } from '@types'
import { ProductsRepository } from './'
import { getProductsMock } from '@mocks'

@injectable()
export class ProductsMockRepository implements ProductsRepository {
  getAll(): Promise<Product[]> {
    return getProductsMock()
  }

  async get(productId: string): Promise<Product> {
    return (await this.getAll()).find(({ id }) => productId === id)
  }
}
