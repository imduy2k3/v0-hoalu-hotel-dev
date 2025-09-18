import { Client } from 'pg'

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://hoalucity:TicketX123@103.104.119.144:5432/hoalucity',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}

// Create a new client instance
export const createClient = () => {
  return new Client(dbConfig)
}

// Database connection pool for better performance
let client: Client | null = null

export const getClient = async (): Promise<Client> => {
  if (!client) {
    client = new Client(dbConfig)
    await client.connect()
  }
  return client
}

// Close database connection
export const closeClient = async () => {
  if (client) {
    await client.end()
    client = null
  }
}

// Database query helper
export const query = async (text: string, params?: any[]) => {
  const client = await getClient()
  try {
    const result = await client.query(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Database transaction helper
export const transaction = async (queries: Array<{ text: string; params?: any[] }>) => {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    
    const results = []
    for (const query of queries) {
      const result = await client.query(query.text, query.params)
      results.push(result)
    }
    
    await client.query('COMMIT')
    return results
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Transaction error:', error)
    throw error
  }
}
