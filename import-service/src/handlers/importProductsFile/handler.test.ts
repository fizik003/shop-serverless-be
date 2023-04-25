import { main as importProductsFile } from './handler'
import { importServiceContainer } from '@containers'
import { Repository, S3MockRepository } from '@repositories'

describe('importProductsFile', () => {
  beforeEach(() => {
    importServiceContainer.snapshot()
  })

  afterEach(() => {
    importServiceContainer.restore()
  })
  it('should return signed url and status 200', async () => {
    importServiceContainer.unbind(Repository)
    importServiceContainer.bind(Repository).to(S3MockRepository)
    const fileName = 'fileName.csv'
    const mockEvent: any = {
      queryStringParameters: { fileName },
      headers: { 'Content-Type': 'text/csv' },
    }
    const mockContext: any = {}
    const result = await importProductsFile(mockEvent, mockContext)
    expect(result.statusCode).toBe(200)
    expect(result.body).toBe(`"${fileName}"`)
  })
})
