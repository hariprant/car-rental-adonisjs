import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PaymentStatus } from 'Contracts/enums'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.string('invoice').unique()
      table.string('customer_name')
      table.string('customer_email')
      table.string('customer_phone')
      table.string('customer_address')
      table.integer('subtotal')
      table
        .enu('payment_status', Object.values(PaymentStatus))
        .defaultTo(PaymentStatus.PENDING)
        .notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
