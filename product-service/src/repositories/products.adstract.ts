import { Product } from '@types'
export abstract class ProductsRepository {
  abstract getAll(): Promise<Product[]>
  abstract get(id: string): Promise<Product | undefined>
}
