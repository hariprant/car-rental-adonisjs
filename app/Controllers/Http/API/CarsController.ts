import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Car from 'App/Models/Car'

export default class CarsController {
  public async store({ request, response }: HttpContextContract) {
    const input = request.only(['name', 'price'])
    try {
      const car = await Car.create(input)
      return response.status(200).json({ code: 200, status: 'success', data: car })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }

  public async index({ response }: HttpContextContract) {
    const cars = await Car.all()
    return response.status(200).json({ code: 200, status: 'success', data: cars })
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const car = await Car.findBy('id', params.id)
      return response.status(200).json({ code: 200, status: 'success', data: car })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    const input = request.only(['name', 'price'])
    try {
      const car = await Car.findBy('id', params.id)
      car?.merge(input)
      await car?.save()
      return response.status(200).json({ code: 200, status: 'success', data: car })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const car = await Car.findBy('id', params.id)
      await car?.delete()
      return response.status(200).json({ code: 200, status: 'success', data: car })
    } catch (err) {
      return response.status(500).json({ code: 500, status: 'error', message: err.message })
    }
  }
}
