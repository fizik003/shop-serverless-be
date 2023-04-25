import { ProductCard, ProductCreateData } from '@types'
export abstract class ProductsRepository {
  abstract getAll(): Promise<ProductCard[]>
  abstract get(id: string): Promise<ProductCard | undefined>
  abstract create(productData: ProductCreateData): Promise<ProductCard>
}
