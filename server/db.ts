import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapter = new FileSync(process.env.DATABASE)
export const db = low(adapter)

