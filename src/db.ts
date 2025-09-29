const db = new Bun.SQL('sqlite://data.db')

await db`CREATE TABLE IF NOT EXISTS users (
	email TEXT UNIQUE NOT NULL PRIMARY KEY,
	discord TEXT NOT NULL,
	name TEXT
)`

export default {
	sql: db,
	users: {
		async discordExists(discordId: string) {
			const { count: exists } = await db`SELECT NULL FROM users WHERE discord=${discordId} LIMIT 1`
			return !!exists
		},
		async add({ email, discord, name }: { discord: string, email: string, name: string | null }) {
			const [user] = await db`INSERT INTO users ${Bun.sql({ discord, email, name })} RETURNING *`

			return user
		}
	}
}