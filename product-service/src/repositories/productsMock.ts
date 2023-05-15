import { injectable } from 'inversify'
import { ProductCard, ProductCreateData } from '@types'
import { ProductsRepository } from '.'
import { productsMock } from '@mocks'
import { v4 as uuidv4 } from 'uuid'

@injectable()
export class ProductsMockRepository implements ProductsRepository {
  mockProductsCards: ProductCard[]
  constructor() {
    this.mockProductsCards = [...productsMock]
  }
  async getAll(): Promise<ProductCard[]> {
    return this.mockProductsCards
  }

  async get(productId: string): Promise<ProductCard> {
    return (await this.getAll()).find(({ id }) => productId === id)
  }

  async create(productData: ProductCreateData): Promise<ProductCard> {
    const id = uuidv4()
    const newProduct = { ...productData, id }
    this.mockProductsCards.push(newProduct)
    return this.get(id)
  }
}
