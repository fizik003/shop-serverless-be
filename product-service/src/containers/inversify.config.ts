import { Container } from 'inversify'
import { ProductsRepository, ProductsMockRepository } from '@repositories'
import { ProductsService } from '@services'

export const productsContainer = new Container()
productsContainer.bind<ProductsRepository>(ProductsRepository).to(ProductsMockRepository)
productsContainer.bind<ProductsService>(ProductsService).to(ProductsService)
