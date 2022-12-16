import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Car from 'App/Models/Car'
import User from 'App/Models/User'

export default class CarUsersController {
  public async index({ view }: HttpContextContract) {
    const cars = await Car.all()
    return view.render('home', { cars })
  }

  public async selected({ params, view }: HttpContextContract) {
    const car = await Car.findBy('id', params.id)
    return view.render('selected', { car })
  }

  public async booking({ auth, request, response }: HttpContextContract) {
    const input = request.only(['id', 'needs'])
    try {
      // const user = await User.findBy('id', 1)
      const user = await auth.authenticate()
      const car = await Car.findByOrFail('id', input.id)

      await user?.related('cars').attach({
        [car.id]: {
          needs: input.needs,
        },
      })
      response.redirect('/order')
    } catch (err) {
      response.redirect('/errors/server-error')
    }
  }

  public async order({ auth, view, response }: HttpContextContract) {
    try {
      const user = await auth.authenticate()
      const order = await User.query().preload('cars').where('id', user.id).first()
      const cars = order?.cars.map((x) => ({
        name: x.name,
        price: x.price,
        needs: x.$extras.pivot_needs,
      }))

      const car = Object.assign({}, cars)

      if (Object.keys(car).length !== 0) {
        return view.render('order', {
          cars: {
            name: car[0].name,
            price: car[0].price,
            needs: car[0].needs,
          },
        })
      } else {
        console.log('empty')
      }
    } catch {
      response.redirect('/errors/server-error')
    }
  }
}
