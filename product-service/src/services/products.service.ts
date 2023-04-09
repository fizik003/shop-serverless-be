import { injectable, inject } from 'inversify'
import { Product } from '@types'
import { ProductsRepository } from '@repositories'

@injectable()
export class ProductsService {
  constructor(@inject(ProductsRepository) private productsRepository: ProductsRepository) {}

  async getAll(): Promise<Product[]> {
    return this.productsRepository.getAll()
  }

  async getById(id: string): Promise<Product> {
    return this.productsRepository.get(id)
  }
}
