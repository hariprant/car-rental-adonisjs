import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'
import Car from 'App/Models/Car'

export default class DetailOrder extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Order)
  public order: BelongsTo<typeof Order>

  @belongsTo(() => Car)
  public car: BelongsTo<typeof Car>

  @column()
  public qty: number

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
