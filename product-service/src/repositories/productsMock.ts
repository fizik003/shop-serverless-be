import { injectable } from 'inversify'
import { ProductCard } from '@types'
import { ProductsRepository } from '.'
import { getProductsMock } from '@mocks'

@injectable()
export class ProductsMockRepository implements ProductsRepository {
  async getAll(): Promise<ProductCard[]> {
    const products = await getProductsMock()
    return products.map((product) => ({
      ...product,
      count: Math.round(Math.random() * 10 + 1),
    }))
  }

  async get(productId: string): Promise<ProductCard> {
    return (await this.getAll()).find(({ id }) => productId === id)
  }
}
