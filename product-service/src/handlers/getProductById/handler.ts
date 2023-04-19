import 'reflect-metadata'

import { HttpResponse } from '@utils'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import schema from './schema'
import { middyfy } from '@libs/lambda'
import { productsContainer } from '@containers'
import { ProductsService } from '@services'

const productsService = productsContainer.resolve(ProductsService)

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Lambda invocation with event: ', JSON.stringify(event))
  try {
    const productId = event.pathParameters?.id

    if (!productId) return HttpResponse.bedRequest()

    const product = await productsService.getById(productId)

    console.log('Product:', product)

    if (!product) return HttpResponse.notFoundError()

    return HttpResponse.success(product)
  } catch (error) {
    console.log('An error occurred while loading products', error)
    return HttpResponse.serverError()
  }
}

export const main = middyfy(getProductById)
