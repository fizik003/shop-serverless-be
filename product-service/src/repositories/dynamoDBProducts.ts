import 'reflect-metadata'
import { DynamoDBDocument, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { ProductsRepository } from '@repositories'
import { injectable, inject } from 'inversify'
import { ProductCard, Stock, Product, ProductCreateData } from '@types'
import { v4 as uuidv4 } from 'uuid'

@injectable()
export class DynamoProductsRepository implements ProductsRepository {
  private client: DynamoDBDocument
  private PRODUCT_TABLE: string
  private STOCK_TABLE: string
  constructor(@inject('DYNAMO-CLIENT') clientFactory) {
    this.client = clientFactory()
    this.PRODUCT_TABLE = process.env.PRODUCTS_TABLE
    this.STOCK_TABLE = process.env.STOCK_TABLE
  }

  async getAll(): Promise<ProductCard[]> {
    const productsScanParam = { TableName: this.PRODUCT_TABLE }
    const stocksScanParam = { TableName: this.STOCK_TABLE }
    const productsRequest = this.client.send(new ScanCommand(productsScanParam))
    const stocksRequest = this.client.send(new ScanCommand(stocksScanParam))
    const [products, stocks] = await Promise.all([
      (await productsRequest).Items as Product[],
      (await stocksRequest).Items as Stock[],
    ])

    const stocksMap = this.createStocksMap(stocks)

    return this.joinProductsStock(products, stocksMap)
  }

  private createStocksMap = (stocks) =>
    stocks.reduce((stocksMap, { count, product_id }) => {
      stocksMap[product_id] = count
      return stocksMap
    }, {})

  private joinProductsStock = (products: Product[], stocksMap: Record<string, number>) => {
    return products.map((product) => {
      const { id } = product
      const productsAmount = stocksMap[id] ? stocksMap[id] : 0
      return { ...product, count: productsAmount }
    })
  }

  async get(id: string): Promise<ProductCard> {
    const productQuery = {
      ExpressionAttributeValues: { ':id': id },
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      TableName: this.PRODUCT_TABLE,
    }
    const stockQuery = {
      ExpressionAttributeValues: { ':product_id': id },
      KeyConditionExpression: 'product_id = :product_id',
      TableName: this.STOCK_TABLE,
    }

    const productsRequest = this.client.query(productQuery)
    const stocksRequest = this.client.query(stockQuery)

    const [products, stocks] = await Promise.all([
      (await productsRequest).Items as Product[],
      (await stocksRequest).Items as Stock[],
    ])

    return this.joinProductsStock(products, this.createStocksMap(stocks))[0]
  }

  async create(productData: ProductCreateData) {
    const { count, ...restProductData } = productData
    const id = uuidv4()

    await this.client.transactWrite({
      TransactItems: [
        {
          Put: {
            Item: { id, ...restProductData },
            TableName: this.PRODUCT_TABLE,
          },
        },
        {
          Put: {
            Item: { product_id: id, count },
            TableName: this.STOCK_TABLE,
          },
        },
      ],
    })

    return this.get(id)
  }
}
