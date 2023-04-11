import 'reflect-metadata'
import { ProductsService } from '@services'
import { productsContainer } from '@containers'
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import schema from './schema'
import { middyfy } from '@libs/lambda'
import { ProductCreateData } from '@types'
import { HttpResponse } from '@utils'

const productService = productsContainer.get(ProductsService)

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('Lambda invocation with event: ', JSON.stringify(event))

  try {
    const { body: productData } = event
    if (!isDataValid(productData)) return HttpResponse.bedRequest('Data is incorrect')

    const newProductCard = await productService.create(productData as ProductCreateData)
    console.log('Product created success', newProductCard)

    return HttpResponse.success(newProductCard)
  } catch (error) {
    console.log('An error occurred while creating products', error)
    return HttpResponse.serverError()
  }
}

const isDataValid = (data): boolean => {
  const { title, description, price, count } = data
  const isTitleValid = title && typeof title === 'string'
  const isDescriptionValid = !description || typeof description === 'string'
  const isPriceValid = price >= 0 && typeof price === 'number'
  const isCountValid = count >= 0 && typeof count === 'number'
  return isTitleValid && isDescriptionValid && isPriceValid && isCountValid
}

export const main = middyfy(createProduct)
