import { Client, Events, GatewayIntentBits } from 'discord.js'
import * as handlers from './interactionHandlers'

// Check Environment Variables
const throwEnvErr = (m: string) => { throw 'Missing ENV Variable: ' + m }
export const {
	DISCORD_TOKEN = throwEnvErr('DISCORD_TOKEN'),
	GOOGLE_CLIENT_ID = throwEnvErr('GOOGLE_CLIENT_ID'),
	GOOGLE_CLIENT_SECRET = throwEnvErr('GOOGLE_CLIENT_SECRET'),
	SIGNING_SECRET = crypto.randomUUID(),
	REDIRECT_URI = "http://localhost:3000/api/auth/"
} = Bun.env

// Discord Bot Client
export const client =
	new Client({ intents: [GatewayIntentBits.Guilds] })
		.on(Events.ClientReady, async ({ user: { tag } }) => {
			console.log(`Logged in as ${tag}`)

			// Start the web server once the bot is confirmed online
			await import('./webserver')
		})
		.on(Events.InteractionCreate, int => {
			if (int.isChatInputCommand())
				handlers.commands['/' + [
					int.commandName,
					int.options.getSubcommandGroup(),
					int.options.getSubcommand()
				].filter(Boolean).join(' ')]?.(int)
			if (int.isButton())
				handlers.buttons[int.customId]?.(int)
		})

client.login(DISCORD_TOKEN)
