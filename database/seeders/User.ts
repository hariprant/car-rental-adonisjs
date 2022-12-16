import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name: 'testuser',
        email: 'testuser@adonisjs.com',
        password: 'secret',
      },
    ])
  }
}
