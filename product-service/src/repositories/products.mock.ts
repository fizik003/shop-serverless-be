import { Product } from '@types'
import { ProductsRepositoryAbstract } from './'
import { getProductsMock } from '@mocks'

export class ProductsMockRepository implements ProductsRepository {
  getAll(): Promise<Product[]> {
    return getProductsMock()
  }

  async get(productId: string): Promise<Product> {
    return (await this.getAll()).find(({ id }) => productId === id)
  }
}
