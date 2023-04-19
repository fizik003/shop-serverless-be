import 'reflect-metadata'

import { HttpResponse } from '@utils'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { ProductsService } from '@services'
import { productsContainer } from '@containers'

import schema from './schema'

const productsService = productsContainer.get(ProductsService)

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Lambda invocation with event: ', JSON.stringify(event))

  try {
    const products = await productsService.getAll()

    console.log('Products received: ', JSON.stringify(products))

    return HttpResponse.success(products)
  } catch (error) {
    console.log('An error occurred while loading products', error)
    return HttpResponse.serverError()
  }
}

export const main = middyfy(getProductsList)
