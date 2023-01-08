/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})
Route.on('register').render('auth/register')
Route.post('register', 'AuthController.register')

Route.on('login').render('auth/login')
Route.post('login', 'AuthController.login')

Route.group(() => {
  Route.get('home', 'CarUsersController.index').as('home')
  Route.get('selected/:id', 'CarUsersController.selected').as('selected')
  Route.post('booking', 'CarUsersController.booking').as('booking')
  Route.get('order', 'CarUsersController.order').as('order')
  Route.get('logout', 'AuthController.logout')
}).middleware('auth:web')

Route.group(() => {
  Route.post('register', 'API/AuthController.register')
  Route.post('login', 'API/AuthController.login')

  Route.group(() => {
    Route.resource('users', 'API/UsersController').apiOnly()
    Route.resource('cars', 'API/CarsController').apiOnly()
    Route.post('orders', 'API/OrdersController.rental_order')
    Route.get('orders', 'API/OrdersController.rental_transaction')

    Route.post('caruser', 'API/CarUsersController.store')
    Route.get('caruser', 'API/CarUsersController.index')
  }).middleware('auth:api')
}).prefix('/api/v1')
