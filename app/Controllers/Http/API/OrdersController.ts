import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class OrdersController {
  public async rental_order({ auth, request, response }: HttpContextContract) {
    const input = request.only(['car_id', 'duration', 'type', 'name', 'email', 'phone', 'address'])

    try {
      const user = await auth.authenticate()
      const car = await Database.from('cars').select('*').where('id', input.car_id)

      const trx = await Database.transaction()
      const inv = await this.generatedInvoice()
      try {
        // 1. input to order table
        const order = await trx.insertQuery().table('orders').returning('id').insert({
          user_id: user.id,
          invoice: inv,
          customer_name: input.name,
          customer_email: input.email,
          customer_phone: input.phone,
          customer_address: input.address,
          subtotal: car[0].price,
        })

        // 2. Input to detail_orders table
        const detailOrder = await trx.insertQuery().table('detail_orders').returning('id').insert({
          order_id: order[0].id,
          car_id: car[0].id,
          qty: 1,
          price: car[0].price,
        })

        // 3. Input to order_variants
        const orderVariant = await trx
          .insertQuery()
          .table('order_variants')
          .returning('id')
          .multiInsert([
            {
              order_id: order[0].id,
              variant_id: input.duration,
            },
            {
              order_id: order[0].id,
              variant_id: input.type,
            },
          ])

        await trx.commit()

        return response.status(200).json({
          code: 200,
          status: 'success',
          data: {
            user: user,
            order: order,
            detail: detailOrder,
            variant: orderVariant,
          },
        })
      } catch (error) {
        await trx.rollback()
      }
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }

  private async generatedInvoice() {
    try {
      const now = new Date()
      const dateNow = [
        now.getFullYear(),
        this.padTo2Digits(now.getMonth() + 1),
        this.padTo2Digits(now.getDate()),
      ].join('')
      const randomNumber = Math.floor(10000000 + Math.random() * 90000000)
      return 'INV' + dateNow + 'RTL' + randomNumber
    } catch (err) {
      return null
    }
  }

  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0')
  }

  public async all_transaction({ auth, response }: HttpContextContract) {
    const user = await auth.authenticate()
    const order = await Database.from('orders')
      .join('users', 'orders.user_id', '=', 'users.id')
      .join('detail_orders', 'orders.id', '=', 'detail_orders.order_id')
      .join('cars', 'detail_orders.car_id', '=', 'cars.id')
      .select('orders.customer_name')
      .select('detail_orders.qty')
      .select('cars.name as car_name')
      .where('users.id', user.id)

    try {
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: {
          list_transct: order,
        },
      })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }
  public async rental_transaction({ params, response }: HttpContextContract) {
    const order = await Database.from('orders')
      .join('detail_orders', 'orders.id', '=', 'detail_orders.order_id')
      .join('cars', 'detail_orders.car_id', '=', 'cars.id')
      .select('orders.customer_name')
      .select('detail_orders.qty')
      .select('cars.name as car_name')
      .where('orders.invoice', params.inv)

    const variants = await Database.from('orders')
      .join('order_variants', 'orders.id', '=', 'order_variants.order_id')
      .join('variants', 'order_variants.variant_id', '=', 'variants.id')
      .select('variants.name as variants')
      .where('orders.invoice', params.inv)
    try {
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: {
          transct: order,
          variants: variants,
        },
      })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }
}
