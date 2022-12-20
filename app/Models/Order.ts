import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import DetailOrder from 'App/Models/DetailOrder'
import Variant from 'App/Models/Variant'
import { PaymentStatus } from 'Contracts/enums'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => DetailOrder)
  public detail_orders: HasMany<typeof DetailOrder>

  @manyToMany(() => Variant, {
    pivotTable: 'order_variants',
    pivotTimestamps: true,
  })
  public cars: ManyToMany<typeof Variant>

  @column()
  public invoice: string

  @column()
  public customer_name: string

  @column()
  public customer_email: string

  @column()
  public customer_phone: string

  @column()
  public customer_address: string

  @column()
  public subtotal: number

  @column()
  public payment_status: PaymentStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
