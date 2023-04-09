import { HttpResponse } from '@utils'
import { getProductsMock } from '@mocks'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import schema from './schema'
import { middyfy } from '@libs/lambda'

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Lambda invocation with event: ', JSON.stringify(event))
  try {
    const productId = event.pathParameters?.id

    if (!productId) return HttpResponse.bedRequest()

    const products = await getProductsMock()
    const product = products.find(({ id }) => id === productId)

    console.log('Product:', product)

    if (!product) return HttpResponse.notFoundError()

    return HttpResponse.success(product)
  } catch (error) {
    console.log('An error occurred while loading products', error)
    return HttpResponse.serverError()
  }
}

export const main = middyfy(getProductById)
