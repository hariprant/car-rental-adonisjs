import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Car from 'App/Models/Car'

export default class CarUsersController {
  public async store({ auth, request, response }: HttpContextContract) {
    const input = request.only(['id', 'needs'])
    try {
      // const user = await User.findBy('id', 1)
      const user = await auth.authenticate()
      const car = await Car.findByOrFail('id', input.id)

      const carUser = await user?.related('cars').attach({
        [car.id]: {
          needs: input.needs,
        },
      })
      return response.status(200).json({ code: 200, status: 'success', data: carUser })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }
  public async index({ response }: HttpContextContract) {
    try {
      // const carUser = await User.query().preload('cars').where('id', 1)

      // const user = await User.findOrFail(1)

      // await user.preload('cars')
      // const needs = user.cars.map((car) => car.$extras.pivot_needs)

      // const allData = {
      //   carUser: carUser,
      //   needs: needs,
      // }

      // const user = await User.findOrFail(1)
      // const cars = await user.related('cars').query()

      const users = await User.query().preload('cars').where('id', 1)
      // const test = users.map((user) =>
      //   user.cars.map((car) => {
      //     return { needs: car.$extras.pivot_needs }
      //   })
      // )
      const test = users.map((user) =>
        user.cars.map((car) => {
          return { cars: user.cars, needs: car.$extras.pivot_needs }
        })
      )

      return response.status(200).json({ code: 200, status: 'success', data: { test } })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }
}
