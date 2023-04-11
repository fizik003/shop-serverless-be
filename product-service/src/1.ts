import 'reflect-metadata'
import { productsContainer } from '@containers'
import { DynamoProductsRepository } from '@repositories'

const a = productsContainer.get(DynamoProductsRepository)

console.log()

// a.get('7567ec4b-b10c-48c5-9345-fc73c48a80a').then((data) => {
//   console.log(data)
// })

// a.getAll().then((data) => {
//   console.log(data)
// })

a.create({ count: 5, description: 'description', price: 100, title: '222222' }).then((a) => {
  console.log(a)
})
