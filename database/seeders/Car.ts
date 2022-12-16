import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Car from 'App/Models/Car'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Car.createMany([
      {
        name: 'Toyota Avanza',
        detail: 'MPV 7 Seater',
        price: 450000,
        qty: 5,
      },
      {
        name: 'Honda Brio',
        detail: 'City Car 5 Seater',
        price: 350000,
        qty: 3,
      },
      {
        name: 'Suzuki Ertiga',
        detail: 'MPV 7 Seater',
        price: 400000,
        qty: 2,
      },
    ])
  }
}
