import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'detail_orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('order_id')
        .unsigned()
        .references('orders.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('car_id')
        .unsigned()
        .references('cars.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.integer('qty')
      table.integer('price')

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
