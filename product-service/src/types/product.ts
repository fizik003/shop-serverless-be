export interface Product {
  title: string
  id: string
  price: number
  description: string
}

export interface ProductCard extends Product {
  count: number
}

export type ProductCreateData = Omit<ProductCard, 'id'>
