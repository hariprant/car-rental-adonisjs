import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Variant from 'App/Models/Variant'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Variant.createMany([
      {
        name: '12 Hour',
        price: 0,
      },
      {
        name: 'Full Day',
        price: 75000,
      },
      {
        name: 'Car Only',
        price: 0,
      },
      {
        name: 'Include Driver',
        price: 100000,
      },
    ])
  }
}
