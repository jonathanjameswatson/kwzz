import { queries } from './queries'

import pgPromise from 'pg-promise'

// Database connection details
const connection = {
  host: process.env.KWZZ_DB_HOST || 'localhost',
  port: process.env.KWZZ_DB_PORT || 5432,
  database: process.env.KWZZ_DB_DATABASE || 'kwzz',
  user: process.env.KWZZ_DB_USER || 'kwzz',
  password: process.env.KWZZ_DB_PASSWORD || 'password'
}

const pgp = pgPromise()
const db = pgp(connection)

export default { db, queries }
