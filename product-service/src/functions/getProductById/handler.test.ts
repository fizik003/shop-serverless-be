import { main as getProductById } from './handler'
import { productsMock } from '@mocks'

describe('getProductById', () => {
  const contextMock = {} as any
  let eventMock: any
  beforeEach(() => {
    eventMock = { headers: { 'Content-Type': 'text/json' } }
  })
  it('should return product by id', async () => {
    eventMock.pathParameters = {
      id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    }

    const result = await getProductById(eventMock, contextMock)

    const product = productsMock.find(({ id }) => eventMock.pathParameters.id === id)

    expect(result).toEqual({
      body: JSON.stringify({
        ...product,
      }),
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
    })
  })

  it('should return 400 error if productId is not valid', async () => {
    const result = await getProductById(eventMock, contextMock)

    expect(result.statusCode).toEqual(400)
  })

  it('should return 404 error if product no exist', async () => {
    eventMock.pathParameters = {
      id: '12345',
    }

    const result = await getProductById(eventMock, contextMock)

    expect(result.statusCode).toEqual(404)
  })
})
