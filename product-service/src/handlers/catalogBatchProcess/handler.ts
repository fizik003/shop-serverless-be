import { SQSEvent } from 'aws-lambda'

import { productsContainer } from '@containers'
import { ProductsService, SnsService } from '@services'
import { createProductValidateSchema } from '@utils'
import { ProductCreateData, ProductCard } from '@types'

const catalogBatchProcess = async (event: SQSEvent) => {
  const productService = productsContainer.get(ProductsService)
  const snsService = productsContainer.get(SnsService)

  const { Records } = event
  const products = Records.map((record) => JSON.parse(record.body)) as ProductCreateData[]

  console.log('check products')
  const validatedProducts: ProductCreateData[] = []

  try {
    await Promise.all(
      products.map(async (product) => {
        await createProductValidateSchema.validate(product)
        validatedProducts.push(product)
      })
    )
  } catch (error) {
    console.log(error)
  }

  console.log('Validate finished.')
  console.log(validatedProducts.length, 'Products ready to create')

  const createdProducts: ProductCard[] = []

  await Promise.all(
    validatedProducts.map(async (productItem) => {
      try {
        const product = await productService.create(productItem)
        createdProducts.push(product)
      } catch (error) {
        console.log(error)
      }
    })
  )

  console.log(createdProducts.length, 'Products were created')
  console.log('Send notification')
  try {
    await snsService.sendNotificationProductsCreated(createdProducts)
    console.log('Notification sent successfully!')
  } catch (error) {
    console.log(error)
  }
}

export const main = catalogBatchProcess
