import { Product } from '@types'
import { ProductsRepository } from '@repositories'

export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {
    this.productsRepository = productsRepository
  }

  async getAll(): Promise<Product[]> {
    return this.productsRepository.getAll()
  }

  async getById(id: string): Promise<Product> {
    return this.productsRepository.get(id)
  }
}
