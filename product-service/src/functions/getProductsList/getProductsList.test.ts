import { main as getProductsList } from './handler'
import { productsMock } from '@mocks'

describe('getProductsList', () => {
  const contextMock: any = {}
  const eventMock: any = {}

  it('should return products list', async () => {
    const result = await getProductsList(eventMock, contextMock)
    expect(result.body).toEqual(JSON.stringify(productsMock))
    expect(result.statusCode).toEqual(200)
  })
})
