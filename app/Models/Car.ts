import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import DetailOrder from 'App/Models/DetailOrder'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasMany(() => DetailOrder)
  public detail_orders: HasMany<typeof DetailOrder>

  @column()
  public name: string

  @column()
  public detail: string

  @column()
  public price: number

  @column()
  public qty: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
