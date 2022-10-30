import pgPromise from 'pg-promise'

import { queries } from './queries'

// Database connection details
const connection = {
  connectionString:
    process.env.DATABASE_URL || 'postgres://kwzz:password@localhost:5432/kwzz',
  ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : false
}

const pgp = pgPromise()
export const db = pgp(connection)
export { queries }

export default { db, queries }
