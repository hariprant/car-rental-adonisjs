import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Car from 'App/Models/Car'

export default class CarsController {
  public async index({ view }: HttpContextContract) {
    const cars = await Car.all()
    return view.render('home', { cars })
  }
}
