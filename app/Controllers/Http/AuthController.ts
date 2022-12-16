import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      name: schema.string([rules.maxLength(50)]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
    })
    const userDetails = await request.validate({
      schema: validationSchema,
    })
    /**
     * Create a new user
     */
    const user = new User()
    user.name = userDetails.name
    user.email = userDetails.email
    user.password = userDetails.password
    await user.save()
    await auth.login(user)
    response.redirect('/home')
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    await auth.attempt(email, password)
    response.redirect('/home')
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    response.redirect('/login')
  }
}
