import { injectable, inject } from 'inversify'
import { ProductCard, ProductCreateData } from '@types'
import { ProductsRepository } from '@repositories'

@injectable()
export class ProductsService {
  constructor(@inject(ProductsRepository) private productsRepository: ProductsRepository) {}

  async getAll(): Promise<ProductCard[]> {
    return this.productsRepository.getAll()
  }

  async getById(id: string): Promise<ProductCard> {
    return this.productsRepository.get(id)
  }

  async create(productData: ProductCreateData): Promise<ProductCard> {
    return this.productsRepository.create(productData)
  }
}
