import { main as getProductsList } from './handler'
import { productsMock } from '@mocks'

describe('getProductsList', () => {
  const contextMock: any = {}

  xit('should return products list', async () => {
    const eventMock: any = { headers: { 'Content-Type': 'text/json' } }
    const result = await getProductsList(eventMock, contextMock)
    expect(result.body).toEqual(JSON.stringify(productsMock))
    expect(result.statusCode).toBe(200)
  })
})
